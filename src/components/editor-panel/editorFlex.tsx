import React, { Component, createRef, CSSProperties, ReactNode } from 'react';
import { MetaContext, MetaContextType } from '@app/context';
import { cursorOffset, CursorOffset, isThreeQuarterBoundary } from '@app/utils/boundary';
import { createMemo, preventDefault } from '@app/utils';
import produce from 'immer';
import { getBoxStyle, getFlexStyle, DIR_MAP } from './utils';
import type { BasicConfig } from '@app/types';
import type { DragSortRW } from '.';

interface ReportHoverType {
  (chain: string, cursorOffset: CursorOffset): string | null;
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

  reportParent = (e: React.DragEvent) => {
    e.stopPropagation();
    const offset = cursorOffset(e);
    return this.props.reportHover?.(this.props.chain, offset) ?? this.props.chain;
  };

  onDragStart = (e: React.DragEvent) => {
    if (!this.props.canDrag) return;
    this.setState({ hide: true });
    this.props.dragSort.setInitiator({
      chain: this.props.chain,
      id: this.props.id,
    });
  };

  onDragOver(e: React.DragEvent) {
    const { dragSort, id } = this.props;
    // console.log(chain, id);
    if (!dragSort.getInitiator()) return;
    const chain = this.reportParent(e);
    dragSort.setTarget({ chain, id });
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
    const row = (this.getBasic() as BasicConfig.Flex).flexDirection.startsWith('row');
    const isInside = isThreeQuarterBoundary(e, row);
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
      if (this.state.dummy !== nextDummy) {
        this.setState({ dummy: nextDummy });
      }
      return nextDummy;
    }
    return null;
  };

  renderChildren = createMemo((dummy: string | null, children: ReactNode[]) => {
    const target = this.props.dragSort.getTarget();
    if (!dummy || !target) {
      return children;
    }
    const basic = getBoxStyle(this.getBasic(this.props.dragSort.getInitiator()?.id));
    console.log(basic, target.id);
    return produce(children, (draft) => {
      draft.splice(+dummy[dummy.length - 1], 0, <DummyContainer key="dummy" style={basic} />);
    });
  });

  render() {
    const children = this.renderChildren(this.state.dummy, this.props.children);
    return (
      <div
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

// export class EditorContainer extends Box<> {}

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
    <div className="dummy" style={style} onDrop={preventDefault}>
      <div className="dummy-children" style={childrenStyle}></div>
    </div>
  );
}
