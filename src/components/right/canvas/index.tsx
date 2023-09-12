import CanvasSize from '@/components/right/canvas/canvas-size';
import CanvasBg from '@/components/right/canvas/canva-bg';
import { useIndexContext } from '@/context/userContext';

import './index.less';
import { IContext } from '@/interface';

const hiddenZIndex = -100;

const Canvas = () => {
  const { selectType }: IContext = useIndexContext();

  return (
    <div className="right-canvas-panel-wrapper" style={{ zIndex: selectType === 'default' ? 1 : hiddenZIndex }}>
      <div className="global-right-head-title global-common-title">画布</div>
      <div className="canvas-panel-body">
        <CanvasSize></CanvasSize>
        <CanvasBg></CanvasBg>
      </div>
    </div>
  );
};

export default Canvas;
