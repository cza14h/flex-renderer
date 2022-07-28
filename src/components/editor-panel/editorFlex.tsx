import React, { Component, createRef, CSSProperties, ReactNode } from 'react';
import { MetaContext, MetaContextType } from '@app/context';
import type { BasicConfig } from '@app/types';
import type { DragSortRW } from '.';
import { cursorOffset, CursorOffset, isThreeQuarterBoundary } from '@app/utils/boundary';
import { createMemo, preventDefault } from '@app/utils';
import produce from 'immer';

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
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    ...getBoxStyle(other),
  };
}

interface ReportHoverType {
  (chain: string, cursorOffset: CursorOffset): void;
  (chain: null): void;
}

type BoxProps = {
  id: string;
  chain: string;
  dragSort: DragSortRW;
  /** @injected */
  canDrag?: boolean;
  /** @injected */
  reportHover?: ReportHoverType;
};

type BoxState = {
  hide: boolean;
};

abstract class Box<T extends BoxProps, S extends BoxState = BoxState> extends Component<T, S> {
  static contextType = MetaContext;
  static defaultProps = { canDrag: true };
  // declare context: MetaContextType;
  context!: MetaContextType;
  ref = createRef<HTMLDivElement>();

  reportParent = (e: React.DragEvent) => {
    e.stopPropagation();
    const offset = cursorOffset(e);
    this.props.reportHover?.(this.props.chain, offset);
  };

  onDragStart = (e: React.DragEvent) => {
    if (!this.props.canDrag) return;
    this.reportParent(e);
    this.setState({ hide: true });
    this.props.dragSort.setInitiator({
      chain: this.props.chain,
      id: this.props.id,
    });
  };

  onDragOver(e: React.DragEvent) {
    const { dragSort, chain, id } = this.props;
    // console.log(chain, id);
    if (!dragSort.getInitiator()) return;
    dragSort.setTarget({ chain, id });
    this.reportParent(e);
  }

  onDragEnd = (e: React.DragEvent) => {
    const { dragSort, chain } = this.props;
    const target = dragSort.getTarget();
    // console.log(chain, target?.chain);
    dragSort.sortLayer([chain], target!.chain);
    // this.props.dragSort.sortLayer()
    dragSort.reset();
    this.setState({ hide: false });
  };

  getBasic(id = this.props.id) {
    const { basics, breakpoint } = this.context;
    return basics[breakpoint]?.[id] ?? basics.default[id];
  }
}

const DIR_MAP = {
  column: 'bottom',
  'column-reverse': 'top',
  row: 'right',
  'row-reverse': 'left',
} as const;

type FlexContainerProps = {
  children: ReactNode[];
} & BoxProps;

type FlexContainerState = {
  dummy: string | null;
} & BoxState;
export class FlexContainer extends Box<FlexContainerProps, FlexContainerState> {
  state: FlexContainerState = { hide: false, dummy: null };

  onDragOver = (e: React.DragEvent) => {
    if (!this.props.dragSort.getInitiator()) return;
    const isInside = isThreeQuarterBoundary(e);
    // console.log(isInside);
    if (isInside) {
      this.props.reportHover?.(null);
    } else {
      super.onDragOver(e);
    }
  };

  onDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      this.setState({ dummy: null });
    }
    // this.props.reportHover?.(null);
  };

  reportHover: ReportHoverType = (chain: string | null, offset?: CursorOffset) => {
    if (chain === null && this.state.dummy !== null) {
      console.log('23333');
      this.setState({ dummy: null });
    } else if (chain !== null) {
      const { flexDirection } = this.getBasic() as BasicConfig.Flex;
      const chainArr = chain.split('').map(Number);
      if (offset![DIR_MAP[flexDirection]]) {
        chainArr[chainArr.length - 1] += 1;
      }
      const nextDummy = chainArr.join('');
      // console.log('origin', chain, 'computed', nextDummy, 'offset', offset);
      if (this.state.dummy !== nextDummy) {
        this.setState({ dummy: nextDummy });
      }
    }
  };

  renderChildren = createMemo((dummy: string | null, children: ReactNode[]) => {
    const target = this.props.dragSort.getTarget();
    if (!dummy || !target) {
      return children;
    }
    const basic = getBoxStyle(this.getBasic(target.id));
    return produce(children, (draft) => {
      draft.splice(+dummy[dummy.length - 1], 0, <DummyContainer style={basic} />);
    });
  });

  render() {
    const children = this.renderChildren(this.state.dummy, this.props.children);
    return (
      <div
        ref={this.ref}
        className="flex"
        onDragStartCapture={this.onDragStart}
        onDragOverCapture={this.onDragOver}
        onDragLeaveCapture={this.onDragLeave}
        onDragEnd={this.onDragEnd}
        style={getFlexStyle(this.getBasic() as BasicConfig.Flex)}
        draggable={this.props.canDrag}
        onDrop={preventDefault}
      >
        {React.Children.map(children, (node) => {
          return React.cloneElement(node as any, {
            canDrag: false,
            reportHover: this.reportHover,
          });
        })}
      </div>
    );
  }
}

export class NormalContainer extends Box<BoxProps> {
  onDragOver = (e: React.DragEvent) => {
    super.onDragOver(e);
  };

  render(): React.ReactNode {
    return (
      <div
        className="com"
        onDragStartCapture={this.onDragStart}
        onDragOverCapture={this.onDragOver}
        onDragEnd={this.onDragEnd}
        style={getBoxStyle(this.getBasic())}
        draggable={this.props.canDrag}
        onDrop={preventDefault}
      ></div>
    );
  }
}

type DummyContainerProps = {
  style: CSSProperties;
  childrenStyle?: CSSProperties;
};

function DummyContainer({ style, childrenStyle }: DummyContainerProps) {
  return (
    <div className="dummy" style={style}>
      <div className="dummy-children" style={childrenStyle}></div>
    </div>
  );
}
