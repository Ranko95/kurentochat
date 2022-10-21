import React, { FunctionComponent, useState, useContext, useCallback, useEffect } from 'react';
import SocketIOClient, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import config from "src/config/publicConfig";
import { joinConferenceRequest } from 'src/lib/conference/join';
import WebRTCController from 'src/lib/webrtc/WebRTCController';
import { transferPublishConnectionOfferRequest } from 'src/lib/connection/publish';
import { transferIceCandidateRequest } from 'src/lib/connection/iceCandidate';
import { transferViewConnectionOfferRequest } from 'src/lib/connection/view';
import { IceServersProvider } from 'src/utils/ice-servers/IceServersProvider';
export interface IConeferceUserState {
  id: string;
  publishStream: string | undefined;
  viewStreams: string[];
}

export interface IRemoteMediaStream {
  callId: string;
  stream: MediaStream;
}

export interface IContextValue {
  isJoined: boolean;
  joinError: string;
  localStream: MediaStream | null;
  remoteStreams: IRemoteMediaStream[];
  join(): void;
}

export const Context = React.createContext<IContextValue>({} as IContextValue);
Context.displayName = 'ConferenceContext';

export const Provider: FunctionComponent = ({ children }) => {
  const [isInitiallyConnected, setIsInitiallyConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<IRemoteMediaStream[]>([]);
  const [conferenceState, setConeferenceState] = useState<IConeferceUserState[]>([]);
  const [currViewedStreamCallIds, setCurrViewedStreamCallIds] = useState<string[]>([]);

  const connect = useCallback(() => {
    if (isInitiallyConnected || socket) {
      return;
    }

    const socketClient = SocketIOClient(config.socketUrl, { transports: ['websocket'], forceNew: true });

    socketClient.on('connect', () => {
      console.log('Initial connect to socket server');
      setIsInitiallyConnected(true);
      setSocket(socketClient);
    });

    socketClient.on('connection:iceCandidate', (data: { candidate: RTCIceCandidate; callId: string }) => {
      WebRTCController.processIceCandidate(data.candidate, data.callId);
    });

    socketClient.on('conference:state', (data: IConeferceUserState[]) => {
      setConeferenceState(data);
    });
  }, [isInitiallyConnected, socket]);

  const join = useCallback(async () => {
    if (!socket) {
      return;
    }

    try {
      const response = await joinConferenceRequest(socket);
      if (response.error) {
        setJoinError(response.error);
        return;
      }
      setIsJoined(Boolean(response.result?.joined));
      setJoinError('');
    } catch (e) {
      setJoinError('Join failed...');
    }
  }, [socket]);

  useEffect(() => {
    connect();
  }, []);

  const handleGotLocalStream = (stream: MediaStream) => {
    setLocalStream(stream);
  };

  const handleGotRemoteStream = (stream: MediaStream, callId?: string) => {
    if (!callId) {
      return;
    }

    console.log(stream, '----- remote stream -----');
    setRemoteStreams((remoteStreams) => [...remoteStreams.filter((s) => s.callId !== callId), { callId, stream }]);
  };

  const handleGotPublishOffer = async (sdp: string | undefined, callId: string) => {
    if (!socket) {
      return;
    }

    const response = await transferPublishConnectionOfferRequest(socket, { sdp, callId });

    if (response.result) {
      const { answer } = response.result;
      await WebRTCController.processAnswer(answer, callId);
    }
  };

  const handleGotViewOffer = async (sdp: string | undefined, callId: string, publishCallId: string) => {
    if (!socket) {
      return;
    }

    const response = await transferViewConnectionOfferRequest(socket, { sdp, callId, publishCallId });

    if (response.result) {
      const { answer } = response.result;
      await WebRTCController.processAnswer(answer, callId);
    }
  };

  const handleGotIceCandidate = async (candidate: RTCIceCandidate, callId: string) => {
    if (!socket) {
      return;
    }

    transferIceCandidateRequest(socket, { candidate, callId });
  };

  const publishStream = async () => {
    await WebRTCController.createPublishConnection({
      callId: uuidv4(),
      iceServers: IceServersProvider.getIceServers(),
      onGotStream: handleGotLocalStream,
      onGotOffer: handleGotPublishOffer,
      onGotIceCandidate: handleGotIceCandidate,
    });
  };

  const viewStream = async (publishStreamCallId: string) => {
    await WebRTCController.createViewConnection({
      callId: uuidv4(),
      publishCallId: publishStreamCallId,
      iceServers: IceServersProvider.getIceServers(),
      onGotStream: handleGotRemoteStream,
      onGotOffer: (sdp, callId) => handleGotViewOffer(sdp, callId, publishStreamCallId),
    });
  };

  const stopViewStream = async (callId: string) => {
    WebRTCController.stopConnection(callId);
  };

  const processConferenceState = async () => {
    if (!socket) {
      return;
    }

    const me = conferenceState.find((u) => u.id === socket.id);

    if (!me) {
      return;
    }

    const isMePublishing = Boolean(me.publishStream);

    if (!isMePublishing) {
      await publishStream();
    }

    const usersButMe = conferenceState.filter((u) => u.id !== socket.id);

    const allRemoteStreams = usersButMe.map((u) => u.publishStream).filter(Boolean) as string[];

    const streamsToStop = currViewedStreamCallIds.filter((s) => !allRemoteStreams.includes(s));
    const streamsToView = allRemoteStreams.filter((s) => !currViewedStreamCallIds.includes(s));

    for (const streamCallId of streamsToStop) {
      stopViewStream(streamCallId);
    }

    for (const streamCallId of streamsToView) {
      if (streamCallId && !currViewedStreamCallIds.includes(streamCallId)) {
        await viewStream(streamCallId);
      }
    }

    setCurrViewedStreamCallIds(allRemoteStreams);
    setRemoteStreams((remoteStreams) => [...remoteStreams.filter((s) => allRemoteStreams.includes(s.callId))]);
  };

  useEffect(() => {
    if (isJoined) {
      processConferenceState();
    }
  }, [conferenceState, isJoined]);

  return (
    <Context.Provider
      value={{
        isJoined,
        joinError,
        localStream,
        remoteStreams,
        join,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useConference = (): IContextValue => {
  const conferenceContextValue = useContext(Context);

  if (conferenceContextValue === undefined) {
    console.error(`${useConference.name} should be within ${Context.displayName}`);
  }

  return conferenceContextValue;
};
