import { Tailoring } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';

import { IContext } from '@/interface';
import './index.less';

const Crop = () => {
  const { canvasRef }: IContext = useIndexContext();

  return (
    <div className="image-crop-wrapper">
      <div
        className="global-common-title global-common-bg-color btn"
        onClick={() => {
          const obj = canvasRef.handler.canvas.getActiveObject();
          canvasRef.handler.cropImageHandler.cropStart(obj);
        }}
      >
        <Tailoring theme="outline" size="18" fill="#444950" strokeWidth={4} />
        裁剪
      </div>
    </div>
  );
};

export default Crop;
