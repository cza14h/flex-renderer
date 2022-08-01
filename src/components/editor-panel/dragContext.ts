import { ReplaySubject } from 'rxjs';
import type { Flex } from './draggable';
import type EditorRenderer from './draggable';
import type { MemberIdentifier, SortLayerType } from './types';

export default class DragContext {
  inDragEvent = new ReplaySubject<MemberIdentifier>();

  constructor(private sortLayer: SortLayerType) {}
  private initiator: MemberIdentifier | null = null;
  private target: MemberIdentifier | null = null;

  private reset = () => {
    this.initiator = this.target = null;
    this.inDragEvent.observers.forEach((ob) => {
      ob.complete();
    });
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

  commitSort = () => {
    const target = this.getTarget();
    const initiator = this.getInitiator();
    if (target && initiator) {
      this.sortLayer([initiator?.chain], target?.chain);
    }
    this.reset();
  };

  subscribeDragEvent(_scope: Flex | EditorRenderer) {
    const ref = {
      unsubscribe: (scope: Flex | EditorRenderer) => {},
    };

    const sub$ = this.inDragEvent.subscribe({
      next: ({ chain }: MemberIdentifier) => {
        const parentChain = _scope.props.chain;
        if (!chain.startsWith(parentChain) || chain.length !== parentChain.length + 1) {
          ref.unsubscribe(_scope);
        }
      },
      complete: () => {
        ref.unsubscribe(_scope);
      },
    });
    ref.unsubscribe = (scope: Flex | EditorRenderer) => {
      sub$.unsubscribe();
      scope.setState({ ghost: null });
    };
  }
}
