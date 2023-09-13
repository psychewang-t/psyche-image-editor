import { useState, useRef, useEffect } from 'react';
import { ClearFormat, Back, Next, Refresh, Pencil, DownOne } from '@icon-park/react';
import { normalIconColor, disabledIconColor } from '@/global';
import { base64ToUrlAsync, getImgUrl } from '@/utils/file';
import { Modal, message, Dropdown, MenuProps, Slider } from 'antd';
import { useIndexContext } from '@/context/userContext';
import dom2Image from 'dom-to-image-improved';
import { restore, getAITaskResult } from '@/server';
import { useRequest } from 'ahooks';

import { IContext } from '@/interface';
import './index.less';

const defaultPenWidth = 30;
const defaultPanelSize = 500;

const Cutout = () => {
  const { canvasRef, restoring, setRestoring }: IContext = useIndexContext();

  const panelBox = useRef(null);
  const imgDom = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [penWidth, setPenWidth] = useState(defaultPenWidth);

  const [isDrag, setIsDrag] = useState(false);
  const [panelWidth, setPanelWidth] = useState(defaultPanelSize);
  const [panelHeight, setPanelHeight] = useState(defaultPanelSize);

  const [transaction, setTransaction] = useState([]);

  const [currentObj, setCurrentObj] = useState<fabric.Image>();

  const {
    data: createTaskData,
    loading: createTaskLoading,
    run: createTaskRun
  } = useRequest(restore, {
    manual: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      message.destroy('restoreLoading');
      if (e.response.data.code === 'ETIMEDOUT') {
        const showTime = 5;
        message.info('模型正在启动中，请3～5分钟后重试！', showTime);
      } else {
        message.error('消除失败');
      }

      console.error('消除失败', e);
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
      setRestoring(false);
      message.destroy('restoreLoading');
      message.error('消除任务结果获取失败！');
      console.error('消除任务结果获取失败！', e);
      taskResultCancel();
    }
  });

  useEffect(() => {
    if (taskResultData?.status === 'succeeded') {
      taskResultCancel();

      canvasRef.handler.commonHandler.setProperty({
        key: 'src',
        value: taskResultData?.output,
        obj: currentObj,
        callBack: () => {
          message.destroy('restoreLoading');
          message.success('消除成功！');
          setRestoring(false);
        }
      });
    } else if (taskResultData?.status === 'failed') {
      message.destroy('restoreLoading');
      message.error('消除任务结果获取失败！');
      taskResultCancel();
      setRestoring(false);
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

  const initModal = () => {
    if (restoring) {
      message.warning('已有任务在进行中！');

      return;
    }

    refresh();

    const obj = canvasRef.handler.canvas.getActiveObject() as fabric.Image;
    if (!obj) {
      return;
    }

    setCurrentObj(obj);
    message.loading({ content: '正在初始化...', duration: 0, key: 'restoreInit' });

    const img = new Image();
    img.src = obj.getSrc();
    img.onload = () => {
      message.destroy('restoreInit');
      setShowModal(true);
      setImgWidth(img.width);
      setImgHeight(img.height);
      setCurrentUrl(obj.getSrc());
    };
  };

  // 画点
  const draw = (x: number, y: number) => {
    const dom = panelBox.current as HTMLElement;
    const div = document.createElement('div');
    const half = 2;
    div.style.background = '#fff';
    div.style.width = `${penWidth}px`;
    div.style.height = `${penWidth}px`;
    div.style.display = 'inline-block';
    div.style.position = 'absolute';
    div.style.borderRadius = '50%';
    div.style.left = `${x - dom.getBoundingClientRect().left - penWidth / half}px`;
    div.style.top = `${y - dom.getBoundingClientRect().top - penWidth / half}px`;
    dom.appendChild(div);
  };

  // 创建出画点的图片
  const drawImage = () => {
    const node = panelBox.current;

    return new Promise<string>((resolve) => {
      dom2Image
        .toPng(node, {
          bgcolor: '#000',
          style: { opacity: 1 },
          canvas: {
            sx: 0,
            sy: 0,
            sw: panelWidth,
            sh: panelHeight,
            dx: 0,
            dy: 0,
            dw: imgWidth,
            dh: imgHeight,
            width: imgWidth,
            height: imgHeight
          }
        })
        .then((base64: string) => {
          resolve(base64);
        });
    });
  };

  // 上一步绘图
  const backDraw = () => {
    const dom = panelBox.current as HTMLElement;
    if (dom.lastChild) {
      const oldDom = dom.removeChild(dom.lastChild);
      setTransaction(transaction.concat([oldDom]));
    }
  };

  // 下一步绘图
  const nextDraw = () => {
    const dom = panelBox.current as HTMLElement;
    if (transaction.length > 0) {
      const copy = [...transaction];
      const addDom = copy.pop();
      dom.appendChild(addDom);
      setTransaction(copy);
    }
  };

  // 重新画图
  const refresh = () => {
    const dom = panelBox.current as HTMLElement;
    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }

    setTransaction([]);
  };

  // 开始修复
  const beginRestore = async () => {
    setRestoring(true);
    message.loading({ content: '正在消除中', duration: 0, key: 'restoreLoading' });
    setShowModal(false);
    const maskImgBase64 = await drawImage();
    const maskImgUrl = await base64ToUrlAsync(maskImgBase64, 'restoreMaskUpload');
    const imgUrl = await getImgUrl(currentUrl, 'restore');
    createTaskRun({ image: imgUrl, mask: maskImgUrl });
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Slider defaultValue={penWidth} min={1} onChange={setPenWidth} />
    }
  ];

  return (
    <div className="image-restore-wrapper">
      <div
        className="global-common-title global-common-bg-color btn"
        onClick={() => {
          initModal();
        }}
      >
        <ClearFormat theme="outline" size="18" fill={normalIconColor} strokeWidth={4} />
        消除
      </div>

      <Modal
        title={
          <div className="image-restore-modal-title">
            <div className="left-title">消除</div>
            <div className="control-wrapper">
              <div
                className={`item-wrapper ${
                  (panelBox?.current as HTMLElement)?.hasChildNodes()
                    ? 'global-second-title1'
                    : 'global-second-title1-disable'
                }`}
                onClick={() => {
                  backDraw();
                }}
              >
                <Back
                  theme="outline"
                  size="18"
                  fill={(panelBox?.current as HTMLElement)?.hasChildNodes() ? normalIconColor : disabledIconColor}
                  strokeWidth={4}
                />
                上一步
              </div>
              <div
                className={`item-wrapper ${
                  transaction.length > 0 ? 'global-second-title1' : 'global-second-title1-disable'
                }`}
                onClick={() => {
                  nextDraw();
                }}
              >
                <Next
                  theme="outline"
                  size="18"
                  fill={transaction.length > 0 ? normalIconColor : disabledIconColor}
                  strokeWidth={4}
                />
                下一步
              </div>
              <div
                className={`item-wrapper ${
                  (panelBox?.current as HTMLElement)?.hasChildNodes()
                    ? 'global-second-title1'
                    : 'global-second-title1-disable'
                }`}
                onClick={() => {
                  refresh();
                }}
              >
                <Refresh
                  theme="outline"
                  size="18"
                  fill={(panelBox?.current as HTMLElement)?.hasChildNodes() ? normalIconColor : disabledIconColor}
                  strokeWidth={4}
                />
                重做
              </div>
              <Dropdown menu={{ items }} overlayStyle={{ width: 200 }}>
                <div className="item-wrapper pen-wrapper global-second-title1">
                  <Pencil theme="outline" size="18" fill={normalIconColor} strokeWidth={4} />
                  画笔大小
                  <DownOne theme="filled" size="18" fill={normalIconColor} strokeWidth={4} />
                </div>
              </Dropdown>
            </div>
          </div>
        }
        onCancel={() => {
          setShowModal(false);
        }}
        open={showModal}
        getContainer={false}
        wrapClassName="image-restore-modal-wrapper"
        width={700}
        okText={'确认'}
        cancelText={'取消'}
        onOk={() => {
          beginRestore();
        }}
        forceRender={true}
      >
        <div className="image-wrapper">
          <img ref={imgDom} className={imgWidth >= imgHeight ? 'width' : 'height'} src={currentUrl} />
          <div
            className="panel"
            onMouseEnter={() => {
              setPanelWidth(imgDom.current.width);
              setPanelHeight(imgDom.current.height);
            }}
          >
            <div
              className="panel-box"
              style={{ width: `${panelWidth}px`, height: `${panelHeight}px` }}
              ref={panelBox}
              onMouseDown={() => {
                setIsDrag(true);
              }}
              onMouseMove={(e) => {
                e.stopPropagation();
                if (!isDrag) {
                  return;
                }

                draw(e.clientX, e.clientY);
              }}
              onMouseUp={() => {
                setIsDrag(false);
              }}
              onMouseLeave={() => {
                setIsDrag(false);
              }}
            ></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cutout;
