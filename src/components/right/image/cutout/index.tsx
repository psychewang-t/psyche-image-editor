import { useEffect, useState } from 'react';
import { Intersection } from '@icon-park/react';
import { normalIconColor } from '@/global';
import { useRequest } from 'ahooks';
import { cutout, getAITaskResult } from '@/server';
import { useIndexContext } from '@/context/userContext';
import { isBase64String, isURLString, base64ToUrlAsync } from '@/utils/file';
import { message } from 'antd';

import { IContext } from '@/interface';
import './index.less';

const Cutout = () => {
  const { canvasRef, cutting, setCutting }: IContext = useIndexContext();

  const [currentObj, setCurrentObj] = useState<fabric.Image>();

  const {
    data: createTaskData,
    loading: createTaskLoading,
    run: createTaskRun
  } = useRequest(cutout, {
    manual: true,
    onError: (e: Error) => {
      message.destroy();
      console.error('扣图任务创建失败！', e);
    }
  });

  const {
    data: taskResultData,
    run: taskResultRun,
    cancel: taskResultCancel
  } = useRequest(getAITaskResult, {
    pollingInterval: 3000,
    manual: true,
    pollingErrorRetryCount: 1,
    onError: (e: Error) => {
      setCutting(false);
      message.destroy();
      message.error('扣图任务结果获取失败！');
      console.error('扣图任务结果获取失败！', e);
    }
  });

  useEffect(() => {
    if (taskResultData?.status === 'succeeded') {
      taskResultCancel();
      message.destroy();
      message.success('抠图成功！');
      canvasRef.handler.commonHandler.setProperty('src', taskResultData?.output, currentObj);
      setCutting(false);
    }
  }, [taskResultData]);

  useEffect(() => {
    if (!createTaskLoading && createTaskData) {
      if (createTaskData?.status === 'starting') {
        taskResultRun(createTaskData.id);
      } else {
        message.destroy();
        message.error('任务创建失败，请重试！');
      }
    }
  }, [createTaskData, createTaskLoading]);

  const beginCutout = async () => {
    if (cutting) {
      message.warning('已有任务在进行中！');

      return;
    }

    setCutting(true);
    message.loading('正在抠图中', 0);

    const obj = canvasRef.handler.canvas.getActiveObject() as fabric.Image;
    if (!obj) {
      return;
    }

    setCurrentObj(obj);
    const src = obj.getSrc();

    // 判断url类型
    if (isURLString(src)) {
      createTaskRun({
        image: src
      });
    }

    if (isBase64String(src)) {
      const imgUrl = await base64ToUrlAsync(src, 'cutoutUpload');
      if (!imgUrl) {
        message.destroy();
        message.error('图片上传失败失败');
      }

      createTaskRun({
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
