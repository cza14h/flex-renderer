import { FC } from 'react';
import styles from './layer-item.module.scss';

type DropIndicatorProps = {
  height: number;
  chain: string;
};

const DropIndicator: FC<DropIndicatorProps> = ({ chain, height }) => {
  const left = chain.length ? chain.length * 10 + 8 : 0;
  const top =
    (chain.split('').reduce((last, curr) => {
      return Number(curr) + last;
    }, 0) +
      chain.length -
      1) *
    height;
  return (
    <div
      className={styles['drop-indicator']}
      style={{
        width: `calc(100% - ${left}px)`,
        left,
        top,
      }}
    ></div>
  );
};

export default DropIndicator;
