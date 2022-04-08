import FixedCanvas from './FixedMode/components/Canvas';
import DragCanvas from './DragMode/entry';
import {
  registerNodes as registerDragCanvasNodes,
  registerLines as registerDragCanvasLines
 } from './DragMode/utils';
 
import * as fixedCanvasUtil from './FixedMode/utils';

export { FixedCanvas, fixedCanvasUtil, DragCanvas, registerDragCanvasNodes, registerDragCanvasLines };
