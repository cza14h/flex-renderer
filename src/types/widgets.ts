export namespace CFunction {
  export type Value = {
    id: string;
    name: string;
    content: string;
  }[];

  export type Options = {
    type: 'CFunction';
    default: Value;
    maxFun?: number;
    addable?: number;
    functionName?: string;
    title?: string;
  };
}

export namespace CSuite {
  export type Value = any;

  //TODO replace with the true widgets Options instead of `Record`
  export type Options<Children extends Record<string, Record<string, any>> = {}> = {
    type: 'CSuite';
    name: string;
    children: {
      [key in keyof Children]: Children[key] & { col: number };
    };
  };
}
