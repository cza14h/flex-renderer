import type { CSSProperties } from 'react';
import { preventDefault, stopPropagation } from '@app/utils';

export type GhostInicatorProps = {
  style: CSSProperties;
  childrenStyle?: CSSProperties;
};

function onDragOver(e: any) {
  preventDefault(e);
  stopPropagation(e);
}

export function GhostIndicator({ style, childrenStyle }: GhostInicatorProps) {
  return (
    <div className="ghost" style={style} onDrop={preventDefault} onDragOver={onDragOver}>
      <div className="ghost-children" style={childrenStyle}></div>
    </div>
  );
}
