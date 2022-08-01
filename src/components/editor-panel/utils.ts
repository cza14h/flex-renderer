import { CSSProperties } from 'react';
import type { BasicConfig } from '@app/types';
import type { Box, Flex } from './draggable';
import EditorRenderer from './draggable';

export function getBoxStyle(basic: BasicConfig.Basic): CSSProperties {
  const { opacity, deg, ...sizes } = basic;

  return {
    ...Object.fromEntries(Object.entries(sizes).filter((entry) => entry[1] !== null)),
    opacity: opacity,
    transform: `rotate(${deg}deg)`,
  };
}

export function getFlexStyle(basic: BasicConfig.Flex): CSSProperties {
  const { flexDirection, alignItems, justifyContent, flexWrap, ...other } = basic;
  return {
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    ...getBoxStyle(other),
  };
}

export const DIR_MAP = {
  column: 'bottom',
  'column-reverse': 'top',
  row: 'right',
  'row-reverse': 'left',
} as const;

export const EMPTY_OFFSET = {
  left: false,
  top: false,
  bottom: false,
  right: false,
};

export function onDragOver(this: Box, e: React.DragEvent) {
  const { dragContext: dragSort, id } = this.props;
  // console.log(chain, id);
  if (!dragSort.getInitiator()) return;
  const chain = this.onChildDragOver(e);
  dragSort.setTarget({ chain, id });
}

export function subscribeDragEvent(
  this: Flex | EditorRenderer,
  _: any,
  prevState: EditorRenderer['state'],
) {
  if (prevState.ghost === null && this.state.ghost !== null) {
    this.props.dragContext.subscribeDragEvent(this);
  }
}
