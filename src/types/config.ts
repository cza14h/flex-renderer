import { CSSProperties } from 'react';
import { CFunction } from './widgets';

export type CanvasItemType = 'com' | 'group' | 'subcom' | 'logical' | 'subpanel';

export type LayerItem = {
  id: string;
  children?: LayerItem[];
  type: CanvasItemType;
};

export type SingleLayer = LayerItem[];

export type LayerList = SingleLayer[];

type ComIdentifier = {
  category: string; // 组件分类
  name: string; //组件名称 eg:txt
  version: string; // 组件版本
  icon: string; //组件图标
  user: string | null;
};

type BasicComConfig = {
  id: string;
  type: CanvasItemType;
};

type BasicNodeConfig = {
  top: number;
  left: number;
  disable: boolean;
} & BasicComConfig;

export type ComNodeConfigType = BasicNodeConfig;

export type LogicalNodeConfigType<T = Record<string, any>> = {
  cn_name: string;
  type: 'logical';
  config: T;
} & BasicNodeConfig;

namespace DataConfig {
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

  export type Config = {
    [sourceName: string]: SourceConfigType;
  };
}

export namespace BasicConfig {
  export type Flex = {
    direction: 'column' | 'row' | 'row-reverse' | 'column-reverse';
    wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
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
    height: {
      value: string;
      unit: string;
    };
    width: {
      value: string;
      unit: string;
    };
    maxHeight: {
      value: string;
      unit: string;
    };
    minHeight: {
      value: string;
      unit: string;
    };
    maxWidth: {
      value: string;
      unit: string;
    };
    minWidth: {
      value: string;
      unit: string;
    };
    flexGrow: number;
    flexShrink: number;
    deg: number;
    opacity: number;
    //TODO Padding margin border
  };
}

type FormValidatorType = 'system' | 'custom';

type FormConfig = {
  name: string;
  verifyEnable?: boolean;
  rules: {
    type: FormValidatorType;
    message: string;
    system: string;
    custom: CFunction.Value;
  };
};

type ComConfigType<
  Basic extends BasicConfig.Basic = BasicConfig.Basic,
  Attr extends Record<string, any> = Record<string, any>,
  Data extends DataConfig.Config = DataConfig.Config,
> = {
  basic: Basic;
  form?: FormConfig | null;
} & SubcomConfigType<Attr, Data>;

type SubcomConfigType<
  Attr extends Record<string, any> = Record<string, any>,
  Data extends DataConfig.Config = DataConfig.Config,
> = {
  attr?: Attr;
  data?: Data;
  com: ComIdentifier;
};

type SubpanelConfigType<> = {};
