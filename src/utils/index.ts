export function createMemo<T extends Array<any>, S>(func: (...args: T) => S) {
  let lastInput: any[] = [];
  let lastRes: any = null;
  return function wrapper(...args: T) {
    if (args.reduce((last, val, index) => val !== lastInput[index] || last, false)) {
      lastRes = func(...args);
      lastInput = args;
    }
    return lastRes as S;
  };
}

export function preventDefault(e: any) {
  e.preventDefault();
}
