import React, { FunctionComponent } from 'react';
import Button, { ButtonTypes } from 'src/components/button';
import { useConference } from 'src/contexts/conference';
import css from './index.module.css';

const PreviewStage: FunctionComponent = () => {
  const { joinError, join } = useConference();

  return (
    <div className={css.Container}>
      {joinError && <span className={css.ErrorMessage}>{joinError}</span>}
      <Button type={ButtonTypes.Primary} className={css.ActionButton} onClick={join}>
        Join
      </Button>
    </div>
  );
};

export default PreviewStage;
