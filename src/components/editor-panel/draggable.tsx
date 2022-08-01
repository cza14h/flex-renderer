import React, { Component } from 'react';
import { MetaContext, MetaContextType } from '@app/context';
import { getCursorOffset, isInsideBoundary } from '@app/utils/boundary';
import {
  getBoxStyle,
  getFlexStyle,
  DIR_MAP,
  onDragOver,
  EMPTY_OFFSET,
  subscribeDragEvent,
} from './utils';
import { createMemo, preventDefault } from '@app/utils';
import type { BasicConfig, CursorOffset } from '@app/types';
import type {
  BoxProps,
  BoxState,
  FlexProps,
  FlexState,
  OnChildHoverType,
  EditorRendererProps,
  EditorRendererState,
  NormalProps,
} from './types';
import { GhostIndicator } from './GhostIndicator';

export function renderChildren(
  this: Flex | EditorRenderer,
  ghost: string | null,
  children: EditorRendererProps['layers'],
  chain: string,
) {
  const target = this.props.dragContext.getTarget();
  const initiator = this.props.dragContext.getInitiator();
  const res = children.map(({ type, children, id }, index) => {
    const props = {
      key: id,
      id,
      chain: `${chain}${index}`,
      dragContext: this.props.dragContext,
      onChildDragOver: this.showGhost,
    };
    if (type === 'group') {
      return <Flex {...props} layers={children!} />;
    } else {
      return <Normal {...props} />;
    }
  });

  if (ghost && target && initiator) {
    const basic = getBoxStyle(this.getBasic(initiator.id));
    res.splice(+ghost[ghost.length - 1], 0, <GhostIndicator key="dummy" style={basic} />);
  }
  return res;
}

export class Box<
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
    const offset = getCursorOffset(e);
    return this.props.onChildDragOver?.(this.props.chain, offset) ?? this.props.chain;
  };

  onDragStart = (e: React.DragEvent) => {
    setTimeout(() => {
      //@ts-ignore
      e.target.style.display = 'none';
    }, 0);
    this.props.onChildDragOver?.(this.props.chain, EMPTY_OFFSET);
    this.props.dragContext.setInitiator({
      chain: this.props.chain,
      id: this.props.id,
    });
  };

  onDragOver = (e: React.DragEvent) => {
    onDragOver.call(this, e);
  };

  onDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    this.props.dragContext.commitSort();
    //@ts-ignore
    e.target.style.display = '';
    this.props.onChildDragOver?.(null);
  };

  getBasic(id = this.props.id): B {
    const { basics, breakpoint } = this.context;
    return (basics[breakpoint]?.[id] ?? basics.default[id]) as B;
  }
}

export class Flex extends Box<FlexProps, FlexState, BasicConfig.Flex> {
  state: FlexState = { ghost: null };
  onDragOver = (e: React.DragEvent) => {
    if (!this.props.dragContext.getInitiator()) return;
    const row = (this.getBasic() as BasicConfig.Flex).flexDirection.startsWith('row');
    const isInside = isInsideBoundary(e, row);
    if (isInside) {
      if (this.props.layers.length === 0) {
        this.props.onChildDragOver?.(null);
      }
    } else {
      onDragOver.call(this, e);
    }
  };

  showGhost: OnChildHoverType = (chain: string | null, offset?: CursorOffset) => {
    if (chain === null && this.state.ghost !== null) {
      this.setState({ ghost: null });
    } else if (chain !== null) {
      const { flexDirection } = this.getBasic();
      const chainArr = chain.split('').map(Number);
      if (offset![DIR_MAP[flexDirection]]) {
        chainArr[chainArr.length - 1] += 1;
      }
      const nextGhost = chainArr.join('');
      if (this.state.ghost !== nextGhost) {
        this.setState({ ghost: nextGhost });
      }
      return nextGhost;
    }
    return null;
  };

  renderChildren = createMemo(
    (ghost: string | null, children: EditorRendererProps['layers'], chain: string) =>
      renderChildren.call(this, ghost, children, chain),
  );

  componentDidUpdate(_: any, prevState: EditorRendererState) {
    subscribeDragEvent.call(this, _, prevState);
  }

  render() {
    const { layers, chain } = this.props;
    const children = this.renderChildren(this.state.ghost, layers, chain);
    return (
      <div
        className="flex"
        {...this.callbacks}
        onDragOverCapture={this.onDragOver}
        style={getFlexStyle(this.getBasic())}
      >
        {children}
      </div>
    );
  }
}

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
        {this.props.id}
        {this.props.children}
      </div>
    );
  }
}

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
      const nextGhost = chainArr.join('');
      if (this.state.ghost !== nextGhost) {
        this.setState({ ghost: nextGhost });
      }
      return nextGhost;
    }
    return null;
  };

  renderChildren = createMemo(
    (ghost: string | null, children: EditorRendererProps['layers'], chain: string) =>
      renderChildren.call(this, ghost, children, chain),
  );

  componentDidUpdate(_: any, prevState: EditorRendererState) {
    subscribeDragEvent.call(this, _, prevState);
  }

  getBasic(id: string) {
    const { basics, breakpoint } = this.context;
    return basics[breakpoint]?.[id] ?? basics.default[id];
  }

  dragOver = () => {
    const nextGhost = `${this.props.layers.length}`;
    if (nextGhost === this.state.ghost) return;
    this.props.dragContext.setTarget({
      chain: nextGhost,
      id: '',
    });
    this.setState({ ghost: nextGhost });
  };

  render() {
    return (
      <div
        className="dashboard"
        style={{ width: this.props.breakpoint }}
        onDragOver={this.dragOver}
        onDropCapture={preventDefault}
      >
        {this.renderChildren(this.state.ghost, this.props.layers, '')}
      </div>
    );
  }
}

export default EditorRenderer;
