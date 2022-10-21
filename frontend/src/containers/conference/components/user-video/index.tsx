import React, { FunctionComponent, useRef, useEffect } from 'react';
import css from './index.module.css';

interface IProps {
  stream: MediaStream;
  isOwn?: boolean;
}

const UserVideo: FunctionComponent<IProps> = (props) => {
  const { stream, isOwn } = props;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = stream;
    videoRef.current.muted = Boolean(isOwn);
    videoRef.current.play();
  }, [videoRef, stream]);

  return (
    <div className={css.Wrapper}>
      <video
        ref={videoRef}
        className={css.VideoElement}
        x-yandex-pip="false"
        preload="none"
        muted
        autoPlay
        playsInline
      />
    </div>
  );
};

export default UserVideo;
