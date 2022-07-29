import React, { Component, ReactNode, CSSProperties } from 'react';
import { MetaContext, MetaContextType } from '@app/context';
import { cursorOffset, CursorOffset, isInsideBoundary } from '@app/utils/boundary';
import { getBoxStyle, getFlexStyle, DIR_MAP } from './utils';
import { createMemo, preventDefault } from '@app/utils';
import type { DragSortRW } from '.';
import type { BasicConfig, LayerConfig } from '@app/types';

function onDragOver(this: Box, e: React.DragEvent) {
  const { dragSort, id } = this.props;
  // console.log(chain, id);
  if (!dragSort.getInitiator()) return;
  const chain = this.onChildDragOver(e);
  dragSort.setTarget({ chain, id });
}

interface OnChildHoverType {
  (chain: string, cursorOffset: CursorOffset): string | null;
  (chain: null): void;
}

type BoxProps = {
  id: string;
  chain: string;
  // dragEnable: boolean;
  dragSort: DragSortRW;
  onChildDragOver?: OnChildHoverType;
};
type BoxState = {};

class Box<
  P extends BoxProps = BoxProps,
  S extends BoxState = BoxState,
  B extends BasicConfig.Basic = BasicConfig.Basic,
> extends Component<P, S> {
  static contextType = MetaContext;
  context!: MetaContextType;

  callbacks;

  constructor(props: P) {
    super(props);
    this.callbacks = {
      onDragStartCapture: this.onDragStart,
      onDragEnd: this.onDragEnd,
      onDrop: preventDefault,
    };
  }

  onChildDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    const offset = cursorOffset(e);
    return this.props.onChildDragOver?.(this.props.chain, offset) ?? this.props.chain;
  };

  onDragStart = (e: React.DragEvent) => {
    // if (!this.props.dragEnable) return;
    // e.dataTransfer.effectAllowed = 'copy';
    setTimeout(() => {
      //@ts-ignore
      e.target.style.display = 'none';
    }, 0);
    this.props.onChildDragOver?.(this.props.chain, {
      left: false,
      top: false,
      bottom: false,
      right: false,
    });
    this.props.dragSort.setInitiator({
      chain: this.props.chain,
      id: this.props.id,
    });
  };

  onDragOver = (e: React.DragEvent) => {
    onDragOver.call(this, e);
  };

  onDragEnd = (e: React.DragEvent) => {
    const { dragSort, chain } = this.props;
    const target = dragSort.getTarget();
    if (target) {
      dragSort.sortLayer([chain], target!.chain);
    }
    // console.log(chain, target?.chain);
    dragSort.reset();
    //@ts-ignore
    e.target.style.display = '';

    this.props.onChildDragOver?.(null);
  };

  getBasic(id = this.props.id): B {
    const { basics, breakpoint } = this.context;
    return (basics[breakpoint]?.[id] ?? basics.default[id]) as B;
  }
}
type FlexProps = EditorRendererProps & BoxProps;

type FlexState = EditorRendererState & BoxState;

class Flex extends Box<FlexProps, FlexState, BasicConfig.Flex> {
  state: FlexState = { ghost: null };
  onDragOver = (e: React.DragEvent) => {
    if (!this.props.dragSort.getInitiator()) return;
    const row = (this.getBasic() as BasicConfig.Flex).flexDirection.startsWith('row');
    const isInside = isInsideBoundary(e, row);
    console.log(isInside);
    if (isInside) {
      this.props.onChildDragOver?.(null);
    } else {
      onDragOver.call(this, e);
    }
  };

  onDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      this.setState({ ghost: null });
    }
  };

  showGhost: OnChildHoverType = (chain: string | null, offset?: CursorOffset) => {
    if (chain === null && this.state.ghost !== null) {
      // console.log('23333');
      this.setState({ ghost: null });
    } else if (chain !== null) {
      const { flexDirection } = this.getBasic();
      const chainArr = chain.split('').map(Number);
      if (offset![DIR_MAP[flexDirection]]) {
        chainArr[chainArr.length - 1] += 1;
      }
      const nextDummy = chainArr.join('');
      if (this.state.ghost !== nextDummy) {
        this.setState({ ghost: nextDummy });
      }
      return nextDummy;
    }
    return null;
  };

  renderChildren = createMemo(
    (ghost: string | null, children: LayerConfig.ItemList, chain: string) => {
      const target = this.props.dragSort.getTarget();
      const res = children.map(({ type, children, id }, index) => {
        const props = {
          key: id,
          id,
          chain: `${chain}${index}`,
          dragSort: this.props.dragSort,
          onChildDragOver: this.showGhost,
        };
        if (type === 'group') {
          return <Flex {...props} layers={children!} />;
        } else {
          return <Normal {...props} />;
        }
      });

      if (ghost && target) {
        const basic = getBoxStyle(this.getBasic(target.id));
        res.splice(+ghost[ghost.length - 1], 0, <DummyContainer key="dummy" style={basic} />);
      }
      return res;
    },
  );

  render() {
    const { layers: childList, chain } = this.props;
    const children = this.renderChildren(this.state.ghost, childList, chain);
    return (
      <div
        className="flex"
        {...this.callbacks}
        onDragOverCapture={this.onDragOver}
        style={getFlexStyle(this.getBasic())}
        onDragLeaveCapture={this.onDragLeave}
      >
        {children}
      </div>
    );
  }
}

type NormalProps = {
  children?: ReactNode;
} & BoxProps;

class Normal extends Box<NormalProps> {
  onDragOver: (e: React.DragEvent<Element>) => void = (e) => {
    onDragOver.call(this, e);
  };

  render() {
    return (
      <div
        draggable
        className="com"
        style={getBoxStyle(this.getBasic())}
        {...this.callbacks}
        onDragOverCapture={this.onDragOver}
      >
        {this.props.children}
      </div>
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

type EditorRendererProps = {
  layers: LayerConfig.ItemList;
  dragSort: DragSortRW;
};

type EditorRendererState = {
  ghost: string | null;
};

class EditorRenderer extends Component<EditorRendererProps, EditorRendererState> {
  static contextType = MetaContext;
  context!: MetaContextType;
  state: EditorRendererState = { ghost: null };

  showGhost: OnChildHoverType = (chain: string | null, offset?: CursorOffset) => {
    if (chain === null && this.state.ghost !== null) {
      // console.log('23333');
      this.setState({ ghost: null });
    } else if (chain !== null) {
      const chainArr = chain.split('').map(Number);
      if (offset![DIR_MAP['column']]) {
        chainArr[chainArr.length - 1] += 1;
      }
      const nextDummy = chainArr.join('');
      if (this.state.ghost !== nextDummy) {
        this.setState({ ghost: nextDummy });
      }
      return nextDummy;
    }
    return null;
  };

  renderChildren = createMemo(
    (dummy: string | null, children: LayerConfig.ItemList, chain: string) => {
      const target = this.props.dragSort.getTarget();
      const res = children.map(({ type, children, id }, index) => {
        const props = {
          key: id,
          id,
          chain: `${chain}${index}`,
          dragSort: this.props.dragSort,
          onChildDragOver: this.showGhost,
        };
        if (type === 'group') {
          return <Flex {...props} layers={children!} />;
        } else {
          return <Normal {...props} />;
        }
      });

      if (dummy && target) {
        const basic = getBoxStyle(this.getBasic(target.id));
        res.splice(+dummy[dummy.length - 1], 0, <DummyContainer key="dummy" style={basic} />);
      }

      return res;
    },
  );

  getBasic(id: string) {
    const { basics, breakpoint } = this.context;
    return basics[breakpoint]?.[id] ?? basics.default[id];
  }

  render() {
    const { ghost } = this.state;
    const { layers } = this.props;
    const children = this.renderChildren(ghost, layers, '');
    return <>{children}</>;
  }
}

export default EditorRenderer;
