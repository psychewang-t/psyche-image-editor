import { useEffect, useState } from 'react';
import { InputNumber, Tooltip } from 'antd';
import { AutoLineWidth } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor } from '@/global';

import { IContext } from '@/interface';
import './index.less';

const FontSpace = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const min = -500;
  const max = 1000;

  const [spaceValue, setSpaceValue] = useState(0);

  useEffect(() => {
    init();
  }, [updateKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj || currentObj.type !== 'textbox') {
      return;
    }

    setSpaceValue(Math.round((currentObj as fabric.Textbox).charSpacing));
  };

  return (
    <div className="font-space-wrapper global-common-bg-color">
      <Tooltip title="字间距">
        <AutoLineWidth
          theme="outline"
          size="20"
          fill={normalIconColor}
          strokeWidth={3}
          onMouseDown={(e) => {
            const startX = e.clientX;
            document.onmousemove = (event) => {
              let distance = event.clientX - startX + spaceValue;
              if (distance < min) {
                distance = min;
              }

              if (distance > max) {
                distance = max;
              }

              const currentObj = canvasRef.handler.canvas.getActiveObject();
              canvasRef.handler.commonHandler.setProperty('charSpacing', distance, currentObj, false);
              setSpaceValue(Math.round(distance));
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
        step={1}
        style={{ width: '100%' }}
        value={spaceValue}
        onChange={(val) => {
          setSpaceValue(Math.round(val));
          const currentObj = canvasRef.handler.canvas.getActiveObject();
          canvasRef.handler.commonHandler.setProperty('charSpacing', val, currentObj, false);
        }}
        onBlur={() => {
          canvasRef.handler.transactionHandler.save('property');
        }}
      />
    </div>
  );
};

export default FontSpace;
