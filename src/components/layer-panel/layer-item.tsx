import React, { FC, useContext } from 'react';
import { BranchContext } from '@app/context';
import arrow from '@app/assets/arrow.svg';
import style from './layer-item.module.scss';

type LayerItemProps = {
  indent: number;
  name: string;
  height: number;
};

export const LayerBranch: FC<LayerItemProps> = ({ name, height }) => {
  const ctx = useContext(BranchContext);
  const isExpand = ctx.expanded[name];

  const className = isExpand ? 'expanded' : ' collapsed';

  const toggleExpand = () => {
    ctx.toggleExpand(name);
  };

  return (
    <div className={style['layer-item']} style={{ height }} draggable>
      <img src={arrow} className={className + ' arrow'} alt="arrow" onClick={toggleExpand} />
      {name}
    </div>
  );
};

export const LayerLeaf: FC<LayerItemProps> = ({ name, height }) => {
  return (
    <div className={style['layer-item']} style={{ height }} draggable>
      {name}
    </div>
  );
};
