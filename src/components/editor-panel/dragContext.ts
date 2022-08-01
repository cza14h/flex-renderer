import { ReplaySubject } from 'rxjs';
import type { Flex } from './draggable';
import type EditorRenderer from './draggable';
import type { MemberIdentifier, SortLayerType } from './types';

export default class DragContext {
  inDragEvent = new ReplaySubject<MemberIdentifier>();

  constructor(public sortLayer: SortLayerType) {}
  private initiator: MemberIdentifier | null = null;
  private target: MemberIdentifier | null = null;

  reset = () => {
    this.initiator = this.target = null;
  };
  getInitiator = () => this.initiator;
  setInitiator = (initiator: MemberIdentifier) => {
    this.initiator = initiator;
  };
  getTarget = () => this.target;
  setTarget = (target: MemberIdentifier) => {
    if (target.chain !== this.target?.chain || target.id !== this.target.id) {
      this.target = target;
      this.inDragEvent.next(target);
    }
  };

  subscribeDragEvent(_scope: Flex | EditorRenderer) {
    const ref = {
      next: ({ chain }: MemberIdentifier) => {
        const parentChain = _scope.props.chain;
        if (!chain.startsWith(parentChain) || chain.length === parentChain.length + 1) {
          (this as any).unsubscribe(_scope);
        }
      },
      unsubscribe: (scope: Flex | EditorRenderer) => {},
    };

    const sub$ = this.inDragEvent.subscribe({
      next: ref.next,
    });
    ref.unsubscribe = (scope: Flex | EditorRenderer) => {
      scope.setState({ ghost: null });
      sub$.unsubscribe();
    };
  }
}
