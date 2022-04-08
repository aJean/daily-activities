import { INode } from '../../../src/FixedMode';

const validtor = (node: INode) => {
  return !!node.data?.name;
};

export default validtor;
