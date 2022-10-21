import React, { FunctionComponent, MouseEvent } from 'react';
import cn from 'classnames';
import css from './index.module.css';

export enum ButtonTypes {
  Primary = 'primary',
}

interface IProps {
  type: ButtonTypes;
  className?: string;
  onClick?(e: MouseEvent<HTMLButtonElement>): void;
}

const Button: FunctionComponent<IProps> = (props) => {
  const { type, className, onClick, children } = props;

  const buttonClassName = cn(className, css.Button, { [css.Primary]: type === ButtonTypes.Primary });

  return (
    <button className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
