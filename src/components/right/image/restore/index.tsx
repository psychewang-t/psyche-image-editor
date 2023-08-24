import { useState, useRef, useEffect } from 'react';
import { ClearFormat, Back, Next, Refresh, Pencil, DownOne } from '@icon-park/react';
import { normalIconColor, disabledIconColor } from '@/global';
import {
  isBase64String,
  isURLString,
  base64ToUrlAsync,
  getImgTypeFromUrl,
  hasTransparentPixels,
  convertPngToJpg,
  getImageTypeFromBase64
} from '@/utils/file';
import { Modal, message, Dropdown, MenuProps, Slider } from 'antd';
import { useIndexContext } from '@/context/userContext';
import dom2Image from 'dom-to-image-improved';
import { restore } from '@/server';
import { useRequest } from 'ahooks';

import { IContext } from '@/interface';
import './index.less';

const defaultPenWidth = 30;
const defaultPanelSize = 500;

const Cutout = () => {
  const { canvasRef }: IContext = useIndexContext();

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

  const { data, loading, run } = useRequest(restore, {
    manual: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      message.destroy();
      if (e.response.data.code === 'ETIMEDOUT') {
        const showTime = 5;
        message.info('模型正在启动中，请3～5分钟后重试！', showTime);
      } else {
        message.error('消除失败');
      }

      console.error('消除失败', e);
    }
  });

  useEffect(() => {
    if (!loading && data) {
      canvasRef.handler.commonHandler.setProperty('src', data);
      message.destroy();
    }
  }, [loading]);

  const initModal = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject() as fabric.Image;
    if (!currentObj) {
      return;
    }

    message.loading('正在初始化...');

    const img = new Image();
    img.src = currentObj.getSrc();
    img.onload = () => {
      message.destroy();
      setShowModal(true);
      setImgWidth(img.width);
      setImgHeight(img.height);
      setCurrentUrl(currentObj.getSrc());
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
    message.loading('正在消除中', 0);
    setShowModal(false);
    const maskImgBase64 = await drawImage();
    const maskImgUrl = await base64ToUrlAsync(maskImgBase64, 'restoreMaskUpload');

    const imgType = getCurrentUlrType();
    if (imgType === 'png') {
      // png图片需要判断是否有空的像素，有的话需要转为jpg
      const hasNullPixels = await hasTransparentPixels(currentUrl);
      if (hasNullPixels) {
        const newImgBase64 = await convertPngToJpg(currentUrl);
        const newImgUrl = await base64ToUrlAsync(newImgBase64, 'restoreUpload');
        run({ image: newImgUrl, mask: maskImgUrl });
      } else {
        if (isURLString(currentUrl)) {
          run({ image: currentUrl, mask: maskImgUrl });
        }

        if (isBase64String(currentUrl)) {
          const objUrl = await base64ToUrlAsync(currentUrl, 'restoreUpload');
          run({ image: objUrl, mask: maskImgUrl });
        }
      }
    } else {
      if (isURLString(currentUrl)) {
        run({ image: currentUrl, mask: maskImgUrl });
      }

      if (isBase64String(currentUrl)) {
        const objUrl = await base64ToUrlAsync(currentUrl, 'restoreUpload');
        run({ image: objUrl, mask: maskImgUrl });
      }
    }
  };

  // 获取当前URL的类型
  const getCurrentUlrType = () => {
    if (isURLString(currentUrl)) {
      return getImgTypeFromUrl(currentUrl);
    }

    if (isBase64String(currentUrl)) {
      return getImageTypeFromBase64(currentUrl);
    }
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
        destroyOnClose={true}
        forceRender={true}
      >
        <div className="image-wrapper">
          <img ref={imgDom} className={imgWidth > imgHeight ? 'width' : 'height'} src={currentUrl} />
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
