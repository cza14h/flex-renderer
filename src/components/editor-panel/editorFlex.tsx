import React, { Component, ReactNode } from 'react';
import type { BasicConfig } from '@app/types';

function genContainerStyle(basic: BasicConfig) {}

type FlexBoxProps<T extends BasicConfig = BasicConfig> = {
  // basic
  children?: ReactNode;
};

class FlexBox extends Component<FlexBoxProps> {
  render(): React.ReactNode {
    return <div>{this.props.children}</div>;
  }
}

export class GroupContainer extends FlexBox {}

export class NormalContainer extends FlexBox {}
