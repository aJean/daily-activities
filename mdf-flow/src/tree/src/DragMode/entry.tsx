import React from 'react';
import Canvas from './components/Canvas'
import {
  registerNodes as rstNodes,
  registerLines as rstLines,
} from './utils'
import {
  ICanvasExposeProps,
  ICanvasProps,
} from './types'

const DragCanvas = React.forwardRef<ICanvasExposeProps, ICanvasProps>((props, ref) => {
  const {
    registerNodes,
    registerLines,
    ...otherProps
  } = props
  const { nodes, lines } = otherProps
  rstNodes(registerNodes || [])
  rstLines(registerLines || [])
  return (
    <Canvas
      key={`drag-canvas-${JSON.stringify(nodes)}${JSON.stringify(lines)}`}
      ref={ref}
      {...otherProps}
    />
  )
})

export default DragCanvas