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

export function onDragOverCapture(this: Box, e: React.DragEvent) {
  const { dragContext } = this.props;
  if (!dragContext.getInitiator()) return;
  const chain = this.onChildDragOver(e);
  dragContext.setTarget(chain);
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

export function getSortedChildrenMiddleLine(element: HTMLCollection) {
  return Array.from(element).reduce<{ v: number[]; h: number[] }>(
    (last, child) => {
      const { top, left, width, height } = child.getBoundingClientRect();
      if (child.className !== 'ghost') {
        last.v.push(top + height / 2);
        last.h.push(left + width / 2);
      }
      return last;
    },
    { v: [], h: [] },
  );
}
