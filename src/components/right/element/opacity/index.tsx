import { useEffect, useState } from 'react';
import { InputNumber, Slider } from 'antd';
import { Mosaic } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import './index.less';

const Opacity = () => {
  const { canvasRef, selectKey }: IContext = useIndexContext();
  const [opacity, setOpacity] = useState<number>(0);
  const PERCENT = 100;

  useEffect(() => {
    init();
  }, [selectKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    setOpacity(Math.round((currentObj as fabric.IObjectOptions).opacity * PERCENT));
  };

  return (
    <>
      <div className="global-common-bg-color opacity-box">
        <Mosaic theme="outline" size="16" strokeWidth={6} className="global-icon-hover" />
        <Slider
          min={0}
          max={100}
          onChange={setOpacity}
          onAfterChange={(val: number) => {
            canvasRef.handler.commonHandler.setProperty('opacity', val / PERCENT);
          }}
          value={typeof opacity === 'number' ? opacity : 0}
          className="opacity-slider"
        />
        <InputNumber
          min={0}
          max={100}
          style={{ backgroundColor: '#f6f7f9' }}
          size="small"
          bordered={false}
          controls={false}
          value={opacity}
          onChange={setOpacity}
          onPressEnter={() => {
            canvasRef.handler.commonHandler.setProperty('opacity', opacity / PERCENT);
          }}
          className="opacity-input"
          formatter={(value) => `${value}%`}
          parser={(value) => Number(value.replace('%', ''))}
        />
      </div>
    </>
  );
};

export default Opacity;
