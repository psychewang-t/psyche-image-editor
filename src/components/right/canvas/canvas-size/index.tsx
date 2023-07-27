import { useEffect, useState } from 'react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { InputNumber } from 'antd';

import './index.less';

const CanvasSize = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    init();
  }, [updateKey]);

  const init = () => {
    const workarea = canvasRef.handler.commonHandler.findById('workarea');
    if (!workarea) {
      return;
    }

    setCanvasWidth(workarea.width);
    setCanvasHeight(workarea.height);
  };

  return (
    <div className="canvas-size-wrapper">
      <div className="size-head-wrapper">
        <span className="global-common-third-title">画布尺寸</span>
      </div>
      <div className="size-body-wrapper size-edit">
        <div className="size-box global-common-bg-color global-second-title">
          <InputNumber
            value={canvasWidth}
            bordered={false}
            controls={false}
            min={0}
            precision={0}
            onChange={setCanvasWidth}
            onPressEnter={() => {
              canvasRef.handler.workareaHandler.setSize({ width: canvasWidth, height: canvasHeight });
            }}
          ></InputNumber>
          <span className="global-second-title1">宽</span>
        </div>
        <div className="size-box global-common-bg-color global-second-title">
          <InputNumber
            value={canvasHeight}
            bordered={false}
            controls={false}
            min={0}
            precision={0}
            onChange={setCanvasHeight}
            onPressEnter={() => {
              canvasRef.handler.workareaHandler.setSize({ width: canvasWidth, height: canvasHeight });
            }}
          ></InputNumber>
          <span className="global-second-title1">高</span>
        </div>
      </div>
    </div>
  );
};

export default CanvasSize;
