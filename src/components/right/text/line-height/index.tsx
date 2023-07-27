import { useEffect, useState } from 'react';
import { InputNumber, Tooltip } from 'antd';
import { AutoLineHeight } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';

import './index.less';

const LineHeight = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const min = 0.1;
  const max = 20;

  const [heightValue, setHeightValue] = useState(0);

  useEffect(() => {
    init();
  }, [updateKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj || currentObj.type !== 'textbox') {
      return;
    }

    setHeightValue(Number((currentObj as fabric.Textbox).lineHeight.toFixed(1)));
  };

  return (
    <div className="line-height-wrapper global-common-bg-color">
      <Tooltip title="行高">
        <AutoLineHeight
          theme="outline"
          size="20"
          fill="#636c78"
          strokeWidth={3}
          onMouseDown={(e) => {
            const startX = e.clientX;
            document.onmousemove = (event) => {
              const pro = 10;
              let distance = (event.clientX - startX) / pro + heightValue;
              if (distance < min) {
                distance = min;
              }

              if (distance > max) {
                distance = max;
              }

              const currentObj = canvasRef.handler.canvas.getActiveObject();
              canvasRef.handler.commonHandler.setProperty('lineHeight', distance, currentObj, false);
              setHeightValue(Number(distance.toFixed(1)));
            };

            document.onmouseup = () => {
              document.onmousemove = null;
              canvasRef.handler.transactionHandler.save('property');
            };
          }}
        />
      </Tooltip>
      <InputNumber
        size="small"
        bordered={false}
        controls={false}
        min={min}
        max={max}
        step={0.1}
        style={{ width: '100%' }}
        value={heightValue}
        onChange={(val) => {
          setHeightValue(Number(val.toFixed(1)));
          const currentObj = canvasRef.handler.canvas.getActiveObject();
          canvasRef.handler.commonHandler.setProperty('lineHeight', val, currentObj, false);
        }}
        onBlur={() => {
          canvasRef.handler.transactionHandler.save('property');
        }}
      />
    </div>
  );
};

export default LineHeight;
