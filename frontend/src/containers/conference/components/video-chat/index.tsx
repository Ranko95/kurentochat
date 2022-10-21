import React, { FunctionComponent, useCallback } from 'react';
import cn from 'classnames';
import { useConference } from 'src/contexts/conference';
import UserVideo from '../user-video';
import css from './index.module.css';

const VideoChat: FunctionComponent = () => {
  const { localStream, remoteStreams } = useConference();

  const getGridCount = useCallback(() => {
    return remoteStreams.length + (localStream ? 1 : 0);
  }, [remoteStreams, localStream]);

  const getGridClassName = useCallback(() => {
    const count = getGridCount();
    return css[`Grid${count}`];
  }, [getGridCount]);

  const containerClassName = cn(css.Container, getGridClassName());

  return (
    <div className={containerClassName}>
      {localStream && <UserVideo stream={localStream} isOwn />}
      {remoteStreams.map((s) => (
        <UserVideo key={s.callId} stream={s.stream} />
      ))}
    </div>
  );
};

export default VideoChat;
