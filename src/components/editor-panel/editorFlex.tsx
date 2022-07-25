import React, { Component, ReactNode } from 'react';
import type { BasicConfig } from '@app/types';

type Basic = BasicConfig.Basic;
type Flex = BasicConfig.Flex;

function genContainerStyle(basic: Basic) {}

type FlexBoxProps<T extends Basic = Basic> = {
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
