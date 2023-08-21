import { useEffect } from 'react';
import { Intersection } from '@icon-park/react';
import { normalIconColor } from '@/global';
import { useRequest } from 'ahooks';
import { cutout } from '@/server';
import { useIndexContext } from '@/context/userContext';
import { isBase64String, isURLString, base64ToUrlAsync } from '@/utils/file';
import { message } from 'antd';

import { IContext } from '@/interface';
import './index.less';

const Cutout = () => {
  const { canvasRef }: IContext = useIndexContext();

  const { data, loading, run } = useRequest(cutout, {
    manual: true,
    onError: (e: Error) => {
      message.error('扣图失败');
      console.error('扣图失败', e);
    }
  });

  useEffect(() => {
    if (!loading && data) {
      canvasRef.handler.commonHandler.setProperty('src', data);
      message.destroy();
    }
  }, [loading]);

  const beginCutout = async () => {
    message.loading('正在抠图中', 0);
    const currentObj = canvasRef.handler.canvas.getActiveObject() as fabric.Image;
    if (!currentObj) {
      return;
    }

    const src = currentObj.getSrc();

    // 判断url类型
    if (isURLString(src)) {
      run({
        image: src
      });
    }

    if (isBase64String(src)) {
      const imgUrl = await base64ToUrlAsync(src, 'cutoutUpload');
      if (!imgUrl) {
        message.destroy();
        message.error('图片上传失败失败');
      }

      run({
        image: imgUrl
      });
    }
  };

  return (
    <div className="image-cutout-wrapper">
      <div
        className="global-common-title global-common-bg-color btn"
        onClick={() => {
          beginCutout();
        }}
      >
        <Intersection theme="outline" size="18" fill={normalIconColor} strokeWidth={4} />
        抠图
      </div>
    </div>
  );
};

export default Cutout;
