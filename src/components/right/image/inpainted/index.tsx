import { useEffect, useState, useRef } from 'react';
import { BackgroundColor, Back, Next, Refresh, Pencil, DownOne } from '@icon-park/react';
import { normalIconColor, disabledIconColor } from '@/global';
import { useIndexContext } from '@/context/userContext';
import { Modal, Dropdown, MenuProps, Slider, message, Input, Button } from 'antd';
import dom2Image from 'dom-to-image-improved';
import { base64ToUrlAsync, getImgUrl } from '@/utils/file';
import { useRequest } from 'ahooks';
import { inpainted, getAITaskResult } from '@/server';

import { IContext } from '@/interface';
import './index.less';

const defaultPenWidth = 30;
const defaultPanelSize = 500;

const Inpainted = () => {
  const { canvasRef, inpainting, setInpainting }: IContext = useIndexContext();

  const panelBox = useRef(null);
  const imgDom = useRef(null);
  const imgWrapperDom = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [penWidth, setPenWidth] = useState(defaultPenWidth);

  const [isDrag, setIsDrag] = useState(false);
  const [panelWidth, setPanelWidth] = useState(defaultPanelSize);
  const [panelHeight, setPanelHeight] = useState(defaultPanelSize);

  const [textareaValue, setTextareaValue] = useState('');

  const [listData, setListData] = useState([]);
  const [selectIndex, setSelectIndex] = useState(-1);

  const [transaction, setTransaction] = useState([]);

  const {
    data: createTaskData,
    loading: createTaskLoading,
    run: createTaskRun
  } = useRequest(inpainted, {
    manual: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      message.destroy('inpaintedLoading');
      console.error('重绘任务创建失败！', e);
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
      setInpainting(false);
      message.destroy('inpaintedLoading');
      message.error('消除任务结果获取失败！');
      console.error('消除任务结果获取失败！', e);
      taskResultCancel();
    }
  });

  useEffect(() => {
    if (taskResultData?.status === 'succeeded') {
      taskResultCancel();
      message.destroy('inpaintedLoading');
      message.success('重绘成功！');
      setListData(listData.concat(taskResultData?.output));
      setInpainting(false);
    } else if (taskResultData?.status === 'failed') {
      message.destroy('inpaintedLoading');
      message.error('消除任务结果获取失败！');
      taskResultCancel();
      setInpainting(false);
    }
  }, [taskResultData]);

  useEffect(() => {
    if (!createTaskLoading && createTaskData) {
      if (createTaskData?.status === 'starting') {
        taskResultRun(createTaskData.id);
      } else {
        message.destroy('inpaintedLoading');
        message.error('任务创建失败，请重试！');
      }
    }
  }, [createTaskData, createTaskLoading]);

  const initModal = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject() as fabric.Image;
    if (!currentObj) {
      return;
    }

    message.loading({ content: '正在初始化...', duration: 0, key: 'inpaintedInit' });

    const img = new Image();
    img.src = currentObj.getSrc();
    img.onload = () => {
      message.destroy('inpaintedInit');
      setShowModal(true);
      setImgWidth(img.width);
      setImgHeight(img.height);
      setCurrentUrl(currentObj.getSrc());
      refresh();
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
  const drawImage = async () => {
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
    while (dom?.firstChild) {
      dom.removeChild(dom.firstChild);
    }

    setTransaction([]);
  };

  // 开始修复
  const beginInpainted = async () => {
    if (inpainting) {
      message.warning('已有任务在进行中！');

      return;
    }

    if (!textareaValue) {
      message.warning('请输入prompt后重试！');

      return;
    }

    setInpainting(true);
    message.loading({ content: '正在重绘中', duration: 0, key: 'inpaintedLoading' });

    const maskImgBase64 = await drawImage();
    const maskImgUrl = await base64ToUrlAsync(maskImgBase64, 'inpaintedMaskUpload');
    const imageUrl = await getImgUrl(currentUrl, 'inpainted');

    createTaskRun({ prompt: textareaValue, image: imageUrl, mask: maskImgUrl });
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Slider defaultValue={penWidth} min={1} onChange={setPenWidth} />
    }
  ];

  return (
    <div className="image-inpainted-wrapper">
      <div
        className="global-common-title global-common-bg-color btn"
        onClick={() => {
          initModal();
        }}
      >
        <BackgroundColor theme="outline" size="18" fill={normalIconColor} strokeWidth={4} />
        重绘
      </div>

      <Modal
        title="智能重绘"
        okText="应用"
        cancelText="取消"
        open={showModal}
        width={'80vw'}
        getContainer={false}
        onCancel={() => {
          setShowModal(false);
        }}
        onOk={() => {
          const data = listData[selectIndex];
          canvasRef.handler.commonHandler.setProperty({ key: 'src', value: data });
          setShowModal(false);
        }}
        okButtonProps={{ disabled: !(selectIndex > -1) }}
      >
        <div className="modal-wrapper">
          <div className="image-inpainted-left-wrapper">
            <div className="util-box">
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
            <div className="img-box" ref={imgWrapperDom}>
              <img ref={imgDom} src={currentUrl} />
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
          </div>
          <div className="image-inpainted-right-wrapper">
            <div className="textarea-box">
              <Input.TextArea
                placeholder="描述你想要的图片内容，AI会帮您重绘图片，目前只支持英文。"
                value={textareaValue}
                onChange={(e) => {
                  setTextareaValue(e.target.value);
                }}
              ></Input.TextArea>
            </div>
            <div className="btn-box">
              <Button
                style={{ width: '100%' }}
                type="primary"
                size="large"
                onClick={() => {
                  beginInpainted();
                }}
              >
                立即生成
              </Button>
            </div>
            <div className="list-box">
              {listData.map((item, index) => (
                <div
                  className={`list global-common-bg-color global-border-color ${selectIndex === index ? 'active' : ''}`}
                  key={index}
                  onClick={() => {
                    setSelectIndex(index);
                  }}
                >
                  <img src={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inpainted;
