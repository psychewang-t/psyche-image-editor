import CanvasSize from '@/components/right/canvas/canvas-size';
import CanvasBg from '@/components/right/canvas/canva-bg';

import './index.less';

const Canvas = () => (
  <div className="right-canvas-panel-wrapper">
    <div className="global-right-head-title global-common-title">画布</div>
    <div className="canvas-panel-body">
      <CanvasSize></CanvasSize>
      <CanvasBg></CanvasBg>
    </div>
  </div>
);

export default Canvas;
