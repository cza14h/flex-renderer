import React, { Component, CSSProperties, ReactNode } from 'react';
import { MetaContext, MetaContextType } from '@app/context';
import type { BasicConfig } from '@app/types';

function getBoxStyle(basic: BasicConfig.Basic): CSSProperties {
  const { opacity, deg, ...sizes } = basic;

  return {
    ...Object.fromEntries(Object.entries(sizes).filter((entry) => entry[1] !== null)),
    opacity: opacity,
    transform: `rotate(${deg}deg)`,
  };
}

function getFlexStyle(basic: BasicConfig.Flex): CSSProperties {
  const { flexDirection, alignItems, justifyContent, flexWrap, ...other } = basic;
  return {
    display: 'flex',
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    ...getBoxStyle(other),
  };
}

type FlexBoxProps = {
  id: string;
  chain: string;
  canDrag?: boolean;
};

abstract class FlexBox<T extends FlexBoxProps, S = {}> extends Component<T, S> {
  static contextType = MetaContext;
  static defaultProps = { canDrag: true };
  // declare context: MetaContextType;
  context!: MetaContextType;
  className = 'com';
  onDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    console.log(this.props.id);
  };

  get basic() {
    //TODO responsive to the breakpoint id
    return this.context.basics.default[this.props.id];
  }
}

type GroupContainerProps = {
  children: ReactNode[];
} & FlexBoxProps;

type GroupContainerState = {
  children: ReactNode[];
};
export class GroupContainer extends FlexBox<GroupContainerProps, GroupContainerState> {
  state: GroupContainerState = { children: [] };
  onDragOver = (e: React.DragEvent) => {};
  render() {
    const props = {
      onDragStartCapture: this.onDragStart,
      onDragOverCpature: this.onDragOver,
      style: getFlexStyle(this.basic as BasicConfig.Flex),
      draggable: this.props.canDrag,
    };
    return (
      <div className="flex" {...props}>
        {React.Children.map(this.props.children, (node) => {
          return React.cloneElement(node as any, { canDrag: false });
        })}
      </div>
    );
  }
}

export class NormalContainer extends FlexBox<FlexBoxProps> {
  render(): React.ReactNode {
    const props = {
      onDragStartCapture: this.onDragStart,
      style: getBoxStyle(this.basic),
      draggable: this.props.canDrag,
    };

    return <div className="com" {...props}></div>;
  }
}
