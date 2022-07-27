import { CFunction } from './widgets';

export type ComItemType = 'com' | 'group' | 'subcom' | 'logical' | 'module';

type ComIdentifier = {
  category: string; // 组件分类
  name: string; //组件名称 eg:txt
  version: string; // 组件版本
  icon: string; //组件图标
  user: string | null;
};

export namespace LayerConfig {
  export type LayerItem = {
    id: string;
    children?: LayerItem[];
    type: ComItemType;
  };
  export type ItemList = LayerItem[];
  export type LayerList = {
    name: string;
    layer: ItemList;
  }[];
}

/** Configs Inside the dashboardComponents */
export namespace DataConfig {
  export enum SourceType {
    Static = 'Static',
    API = 'API',
    MySQL = 'MySQL',
    Oracle = 'Oracle',
    SQLServer = 'SQLServer',
    PostgreSQL = 'PostgreSQL',
    File = 'File',
    // WebSocket = 'WebSocket',
    Passive = 'Passive',
  }

  type FilterConfig = {
    useFilter: boolean;
    filters: { id: string; enable: string }[];
  };

  type AuxiliariesType = FilterConfig; // currently only have filter config
  type DatabaseConfig<T = any> = {
    sourceId: string;
    sqlContent: string;
  } & T;
  type MySqlOracleConfig = DatabaseConfig<{ dbName: string }>;
  type PostgreSqlConfig = DatabaseConfig<{ dbName: string; patternName: string }>;
  type SqlServerConfig = DatabaseConfig<{ dbName: string }>;
  type ApiConfg = Record<string, any>;
  type StaticDataConfig = Record<string, any>;

  type SourceConfigCollection =
    | StaticDataConfig
    | ApiConfg
    | PostgreSqlConfig
    | MySqlOracleConfig
    | SqlServerConfig;

  type SourceConfigType = {
    mappingList?: Record<string, string>;
    autoUpdate?: number;
    controlledMode: boolean;
    auxiliaries: AuxiliariesType; //filters
    type: SourceType;
    source: SourceConfigCollection;
  };

  export type SourceConfigRuntime = SourceConfigType & {
    filters: string[];
  };

  export type ConfigValue<T = SourceConfigType> = {
    [sourceName: string]: T;
  };

  export type ConfigValueRuntime = Record<string, SourceConfigRuntime>;
}

export namespace BasicConfig {
  export type Flex = {
    flexDirection: 'column' | 'row' | 'row-reverse' | 'column-reverse';
    flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
    alignItems: 'normal' | 'center' | 'flex-start' | 'flex-end';
    justifyContent:
      | 'normal'
      | 'flex-start'
      | 'center'
      | 'space-between'
      | 'space-around'
      | 'space-evenly'
      | 'flex-end';
  } & Basic;

  export type Basic = {
    height: string | null;
    width: string | null;
    maxHeight: string | null;
    minHeight: string | null;
    maxWidth: string | null;
    minWidth: string | null;
    flexGrow: number;
    flexShrink: number;
    deg: number;
    opacity: number;
    //TODO Padding margin border
  };

  export type Combination = Flex | Basic;
}

type WatermarkType = {
  show: boolean;
  content: string;
  textStyle: {
    width: number;
    height: number;
    color: string;
    fontSize: number;
    rotate: number;
  };
};
export namespace PanelConfig {
  type Default = {
    backgroundImage: string | null;
    backgroundColor: string | null;
    height: {
      value: number;
      unit: string;
    };
  };

  export type PageInfo = {
    id: string;
    name: string;
    watermark: WatermarkType;
  } & Default;

  export type CanvasModule = {} & Default;
}

namespace FormConfig {
  type ValidatorType = 'system' | 'custom';

  export type ConfigValue = {
    name: string;
    verifyEnable?: boolean;
    rules: {
      type: ValidatorType;
      message: string;
      system: string;
      custom: CFunction.Value;
    };
  };
}

export namespace NodeConfigs {
  export type DefaultNode = {
    top: number;
    left: number;
    disable: boolean;
  };
  export type ComNode = {
    type: Omit<ComItemType, 'logical'>;
  } & DefaultNode;

  export type LogicalNode<T extends Record<string, any> = Record<string, any>> = {
    cn_name: string;
    com: ComIdentifier;
    type: 'logical';
    config: T;
  } & DefaultNode;
}

export namespace ComConfigs {
  type Default = {
    id: string;
    cn_name: string;
    hide?: boolean;
  };

  type DefaultAttr = Record<string, any>;
  type Basic<T extends BasicConfig.Basic = BasicConfig.Basic> = {
    basic: T;
  };

  type ComBasic<
    Attr extends DefaultAttr = DefaultAttr,
    Data extends DataConfig.ConfigValue = DataConfig.ConfigValue,
  > = {
    attr: Attr;
    data?: Data;
    // disable for test
    // com: ComIdentifier;
    // nodeExport: boolean;
  };

  export type Com<
    Attr extends DefaultAttr = DefaultAttr,
    Data extends DataConfig.ConfigValue = DataConfig.ConfigValue,
  > = {
    form?: FormConfig.ConfigValue | null;
    type: 'com';
  } & ComBasic<Attr, Data> &
    Default;

  export type ComRuntime<Attr extends DefaultAttr = DefaultAttr> = Com<
    Attr,
    DataConfig.ConfigValueRuntime
  > &
    Basic;

  export type Subcom<
    Attr extends DefaultAttr = DefaultAttr,
    Data extends DataConfig.ConfigValue = DataConfig.ConfigValue,
  > = {
    type: 'subcom';
  } & ComBasic<Attr, Data> &
    Default;

  export type SubcomRuntime<Attr extends DefaultAttr = DefaultAttr> = Subcom<
    Attr,
    DataConfig.ConfigValueRuntime
  >;

  export type Group = {
    type: 'group';
  } & Default;

  export type GroupRuntime = Group & Basic<BasicConfig.Flex>;

  export type CanvasModule = {
    type: 'module';
    attr: PanelConfig.CanvasModule;
    dataControlled?: boolean;
    controlType?: 'form';
  } & Default;

  export type CanvasModuleRuntime = CanvasModule & Basic;

  export type Configs = Com | Subcom | Group | CanvasModule;

  export type ConfigsRuntime = ComRuntime | SubcomRuntime | GroupRuntime | CanvasModuleRuntime;
}
