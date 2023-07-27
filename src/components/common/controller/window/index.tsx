import { useEffect, useState } from 'react';
import { Minus, PlusCross, OverallReduction, ScreenshotOne } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { Tooltip } from 'antd';

import './index.less';

import { IContext } from '@/interface';

const Window = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const [zoomNumber, setZoomNumber] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const judgeProp = 100;

  useEffect(() => {
    init();
  }, [updateKey]);

  const init = () => {
    const zoom = canvasRef.handler.zoomHandler.getZoom();
    const prop = 100;

    setZoomNumber(Math.round(zoom * prop));
  };

  return (
    <div
      className="window-wrapper global-common-bg-color3 global-border-canvas"
      onMouseOver={() => setShowAll(true)}
      onMouseOut={() => setShowAll(false)}
      style={{ width: showAll ? '155px' : '60px' }}
    >
      <Minus
        theme="filled"
        size="24"
        fill="#636c78"
        strokeWidth={6}
        onClick={() => {
          canvasRef.handler.zoomHandler.zoomOut();
        }}
        style={{ display: showAll ? '' : 'none' }}
      />
      <PlusCross
        theme="filled"
        size="20"
        fill="#636c78"
        strokeWidth={1}
        onClick={() => {
          canvasRef.handler.zoomHandler.zoomIn();
        }}
        style={{ display: showAll ? '' : 'none' }}
      />

      <Tooltip title="适应屏幕">
        <OverallReduction
          theme="filled"
          size="30"
          fill="#636c78"
          strokeWidth={2}
          onClick={() => {
            canvasRef.handler.zoomHandler.zooToFit();
          }}
          style={{ display: showAll && zoomNumber === judgeProp ? '' : 'none' }}
        />
      </Tooltip>

      <Tooltip title="实际大小">
        <ScreenshotOne
          theme="filled"
          size="30"
          fill="#636c78"
          strokeWidth={2}
          onClick={() => {
            canvasRef.handler.zoomHandler.zoomOneToOne();
          }}
          style={{ display: showAll && zoomNumber !== judgeProp ? '' : 'none' }}
        />
      </Tooltip>

      <div className="number">{zoomNumber}%</div>
    </div>
  );
};

export default Window;
