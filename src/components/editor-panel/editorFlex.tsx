import React, { Component, createRef, CSSProperties, ReactNode } from 'react';
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

type BoxProps = {
  id: string;
  chain: string;
  /** @injected */
  canDrag?: boolean;
  /** @injected */
  reportHover?: (e: React.DragEvent, chain: string) => void;
};

abstract class Box<T extends BoxProps, S = {}> extends Component<T, S> {
  static contextType = MetaContext;
  static defaultProps = { canDrag: true };
  // declare context: MetaContextType;
  context!: MetaContextType;
  className = 'com';
  onDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
  };

  onDragEnd = (e: React.DragEvent) => {};

  get basic() {
    //TODO responsive to the breakpoint id
    return this.context.basics.default[this.props.id];
  }
}

type FlexContainerProps = {
  children: ReactNode[];
} & BoxProps;

type FlexContainerState = {
  cursorInside: boolean;
  children: ReactNode[];
};
export class FlexContainer extends Box<FlexContainerProps, FlexContainerState> {
  ref = createRef<HTMLDivElement>();
  state: FlexContainerState;

  constructor(props: FlexContainerProps) {
    super(props);
    this.state = { children: props.children, cursorInside: false };
  }

  onDragOver = (e: React.DragEvent) => {};

  onDragEnter = (e: React.DragEvent) => {};

  onDragLeave = (e: React.DragEvent) => {};

  componentDidUpdate(prevProps: FlexContainerProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({ children: this.props.children });
    }
  }

  render() {
    const props = {
      onDragStartCapture: this.onDragStart,
      onDragOverCapture: this.onDragOver,
      style: getFlexStyle(this.basic as BasicConfig.Flex),
      draggable: this.props.canDrag,
    };
    return (
      <div ref={this.ref} className="flex" {...props}>
        {React.Children.map(this.state.children, (node) => {
          return React.cloneElement(node as any, { canDrag: false });
        })}
      </div>
    );
  }
}

export class NormalContainer extends Box<BoxProps> {
  render(): React.ReactNode {
    const props = {
      onDragStartCapture: this.onDragStart,
      style: getBoxStyle(this.basic),
      draggable: this.props.canDrag,
    };

    return <div className="com" {...props}></div>;
  }
}
