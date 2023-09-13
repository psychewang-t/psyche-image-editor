import { InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';

import './index.less';

const FontSize = () => {
  const { canvasRef, selectKey, updateKey }: IContext = useIndexContext();

  const [fontSize, setFontSize] = useState(0);

  useEffect(() => {
    init();
  }, [selectKey, updateKey]);

  const init = () => {
    const current = canvasRef.handler.canvas.getActiveObject();
    if (!current) {
      return;
    }

    setFontSize((current as fabric.Textbox).fontSize);
  };

  return (
    <div className="font-size-wrapper global-common-bg-color">
      <InputNumber
        min={1}
        bordered={false}
        controls={false}
        precision={0}
        value={fontSize}
        onChange={setFontSize}
        onPressEnter={() => {
          canvasRef.handler.commonHandler.setProperty({ key: 'fontSize', value: fontSize });
        }}
      ></InputNumber>
    </div>
  );
};

export default FontSize;
