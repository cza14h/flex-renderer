import { FC } from 'react';
import styles from './layer-item.module.scss';

type DropIndicatorProps = {
  height: number;
  chain: string;
  index: number;
};

const DropIndicator: FC<DropIndicatorProps> = ({ chain, height, index }) => {
  const left = chain.length ? chain.length * 10 + 8 : 0;
  const top = index * height;
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
