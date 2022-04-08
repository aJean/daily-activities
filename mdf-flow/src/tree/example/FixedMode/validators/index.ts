import { INode } from '../../../src/FixedMode';

const validator = (node: INode) => {
  return !!node.data?.name;
};

export default validator;
