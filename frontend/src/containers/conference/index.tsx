import React, { FunctionComponent, useState, useEffect } from 'react';
import cn from 'classnames';
import { useConference } from 'src/contexts/conference';
import PreviewStage from './components/preview';
import css from './index.module.css';
import VideoChat from './components/video-chat';

enum Stages {
  Preview = 'preview',
  Conference = 'conference',
}

const Conference: FunctionComponent = () => {
  const { isJoined } = useConference();

  const resolveStage = () => (isJoined ? Stages.Conference : Stages.Preview);

  const [stage, setStage] = useState(resolveStage());

  useEffect(() => {
    setStage(resolveStage());
  }, [isJoined]);

  const containerClassName = cn(css.Container, {
    [css.ContainerPreview]: stage === Stages.Preview,
    [css.ContainerConferense]: stage === Stages.Conference,
  });

  return (
    <div className={containerClassName}>
      {stage === Stages.Preview && <PreviewStage />}
      {stage === Stages.Conference && <VideoChat />}
    </div>
  );
};

export default Conference;
