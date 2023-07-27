import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import UploadImage from '@/components/common/upload';

import './index.less';

const Replace = () => {
  const { canvasRef }: IContext = useIndexContext();

  return (
    <div className="replace-image-wrapper">
      <UploadImage
        name="替换图片"
        uploadCallback={(url) => {
          canvasRef.handler.renderHandler.replaceImg(url);
        }}
      ></UploadImage>
    </div>
  );
};

export default Replace;
