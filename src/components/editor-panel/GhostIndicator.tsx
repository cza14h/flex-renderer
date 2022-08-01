import type { CSSProperties } from 'react';
import { preventDefault, stopPropagation } from '@app/utils';

export type GhostInicatorProps = {
  style: CSSProperties;
  childrenStyle?: CSSProperties;
};

export function GhostIndicator({ style, childrenStyle }: GhostInicatorProps) {
  return (
    <div className="ghost" style={style} onDrop={preventDefault} onDragOver={stopPropagation}>
      <div className="ghost-children" style={childrenStyle}></div>
    </div>
  );
}
