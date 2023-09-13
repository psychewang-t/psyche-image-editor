import { useEffect, useState } from 'react';
import { InputNumber, Slider } from 'antd';
import { NodeRound } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor } from '@/global';

import { IContext } from '@/interface';
import './index.less';

const BorderRadius = () => {
  const { canvasRef, selectKey }: IContext = useIndexContext();
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const defaultMax = 1000;
  const [max, setMax] = useState(defaultMax);

  useEffect(() => {
    init();
  }, [selectKey]);

  const init = () => {
    const currentObj: fabric.Rect = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    if (currentObj.rx) {
      setBorderRadius(Math.round(currentObj.rx));
    } else {
      setBorderRadius(0);
    }

    const half = 2;
    const { width, height } = currentObj.getBoundingRect(true);
    setMax(Math.round(Math.max(width, height) / half));
  };

  const handleSetOpacity = (o: number) => {
    canvasRef.handler.commonHandler.setProperty({ key: 'borderRadius', value: o });
    setBorderRadius(o);
  };

  return (
    <div className="figure-border-radius-wrapper">
      <div className="border-radius-head">
        <span className="global-common-third-title">圆角</span>
      </div>
      <div className="global-common-bg-color border-radius-box">
        <NodeRound fill={normalIconColor} theme="outline" size="16" strokeWidth={4} className="global-icon-hover" />
        <Slider min={0} max={max} onChange={handleSetOpacity} value={borderRadius} className="opacity-slider" />
        <InputNumber
          min={0}
          max={max}
          style={{ backgroundColor: '#f6f7f9' }}
          size="small"
          bordered={false}
          controls={false}
          value={borderRadius}
          onChange={handleSetOpacity}
          className="border-radius-input"
          formatter={(value) => `${value}`}
          parser={(value) => Number(value)}
        />
      </div>
    </div>
  );
};

export default BorderRadius;
