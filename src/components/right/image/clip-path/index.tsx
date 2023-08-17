import { useIndexContext } from '@/context/userContext';
import { Plus, Down, SettingTwo, CloseSmall } from '@icon-park/react';
import { useEffect, useState } from 'react';
import { Popover, Segmented, Slider, InputNumber } from 'antd';
import { normalIconColor } from '@/global';

import { figureList, imgList } from '@/components/right/image/clip-path/config';

import { IContext } from '@/interface';
import './index.less';

const widthCoff = 1.5;
const half = 2;
const scaleCoff = 3;
const stepCoff = 10;
const minStepCoff = 0.1;

const ClipPath = () => {
  const { canvasRef, updateKey, selectKey }: IContext = useIndexContext();
  const [segmentedValue, setSegmentedValue] = useState<string | number>('图形');
  const [selectUrl, setSelectUrl] = useState<string>('');
  const [openSelectPanel, setOpenSelectPanel] = useState(false);

  const [openSetPanel, setOpenSetPanel] = useState(false);
  const [clipPathAngleValue, setClipPathAngleValue] = useState(0);
  const [clipPathLeftMax, setClipPathLeftMax] = useState(0);
  const [clipPathLeftValue, setClipPathLeftValue] = useState(0);
  const [clipPathTopMax, setClipPathTopMax] = useState(0);
  const [clipPathTopValue, setClipPathTopValue] = useState(0);
  const [clipPathScaleXMax, setClipPathScaleXMax] = useState(1);
  const [clipPathScaleXValue, setClipPathScaleXValue] = useState(0);
  const [clipPathScaleYMax, setClipPathScaleYMax] = useState(1);
  const [clipPathScaleYValue, setClipPathScaleYValue] = useState(0);

  useEffect(() => {
    init();
  }, [updateKey, selectKey]);

  useEffect(() => {
    if (openSetPanel) {
      getClipPathData();
    }
  }, [openSetPanel]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj || !currentObj.clipPath) {
      return;
    }

    if (currentObj.clipPath.type === 'image') {
      setSegmentedValue('图案');
      // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
      setSelectUrl((currentObj.clipPath as any)._element.currentSrc);
    } else {
      setSegmentedValue('图形');
      const figureName = currentObj.clipPath.name;
      const figure = figureList.find((item) => item.type === figureName);
      if (figure) {
        setSelectUrl(figure.url);
      }
    }
  };

  const getClipPathData = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj || !currentObj.clipPath) {
      return;
    }

    setClipPathAngleValue(currentObj.clipPath.angle);

    setClipPathLeftMax(currentObj.getScaledWidth());
    setClipPathLeftValue(currentObj.clipPath.left);

    setClipPathTopMax(currentObj.getScaledHeight());
    setClipPathTopValue(currentObj.clipPath.top);

    setClipPathScaleXMax(currentObj.getScaledWidth() / currentObj.clipPath.width);
    setClipPathScaleXValue(Number(currentObj.clipPath.scaleX.toFixed(1)));

    setClipPathScaleYMax(currentObj.getScaledHeight() / currentObj.clipPath.height);
    setClipPathScaleYValue(Number(currentObj.clipPath.scaleY.toFixed(1)));
  };

  const content = (
    <div className="image-clip-path-content-wrapper">
      <Segmented
        block
        value={segmentedValue}
        options={['图形', '图案']}
        onChange={(val) => {
          setSegmentedValue(val);
        }}
      />
      <div className="item-box">
        {segmentedValue === '图形' &&
          figureList.map((item, index) => (
            <div
              key={index}
              className="item-bg last-style global-common-bg-color"
              onClick={() => {
                if (item.type === 'null') {
                  canvasRef.handler.imageClipPathHandler['delete']();
                  setSelectUrl('');
                } else {
                  canvasRef.handler.imageClipPathHandler.create({
                    type: 'figure',
                    figure: item.type
                  });
                  setSelectUrl(item.url);
                }
              }}
            >
              <img className="figure-image" src={item.url} />
            </div>
          ))}
        {segmentedValue === '图案' &&
          imgList.map((item, index) => (
            <div
              key={index}
              className="item-bg global-common-bg-color"
              onClick={() => {
                if (item.type === 'null') {
                  canvasRef.handler.imageClipPathHandler['delete']();
                  setSelectUrl('');
                } else {
                  canvasRef.handler.imageClipPathHandler.create({
                    type: 'img',
                    url: item.url
                  });
                  setSelectUrl(item.url);
                }
              }}
            >
              <img className="image" src={item.url} />
            </div>
          ))}
      </div>
    </div>
  );

  const setClipPathValueConfig = [
    {
      type: 'angle',
      name: '角度',
      min: 0,
      max: 360,
      value: clipPathAngleValue,
      setValue: (val: number) => {
        setClipPathAngleValue(val);
      },
      afterSetValue: (val: number) => {
        canvasRef.handler.imageClipPathHandler.update('angle', val);
      }
    },
    {
      type: 'left',
      name: '位置x',
      min: segmentedValue === '图形' ? -clipPathLeftMax : -clipPathLeftMax * widthCoff,
      max: segmentedValue === '图形' ? clipPathLeftMax : clipPathLeftMax / half,
      value: clipPathLeftValue,
      setValue: (val: number) => {
        setClipPathLeftValue(val);
      },
      afterSetValue: (val: number) => {
        canvasRef.handler.imageClipPathHandler.update('left', val);
      }
    },
    {
      type: 'top',
      name: '位置y',
      min: segmentedValue === '图形' ? -clipPathTopMax : -clipPathTopMax * widthCoff,
      max: segmentedValue === '图形' ? clipPathTopMax : clipPathTopMax / half,
      value: clipPathTopValue,
      setValue: (val: number) => {
        setClipPathTopValue(val);
      },
      afterSetValue: (val: number) => {
        canvasRef.handler.imageClipPathHandler.update('top', val);
      }
    },
    {
      type: 'scaleX',
      name: '缩放x',
      min: 0.1,
      max: clipPathScaleXMax * scaleCoff,
      value: clipPathScaleXValue,
      setValue: (val: number) => {
        const setValue = Number(val.toFixed(1));
        setClipPathScaleXValue(setValue);
      },
      afterSetValue: (val: number) => {
        const setValue = Number(val.toFixed(1));
        canvasRef.handler.imageClipPathHandler.update('scaleX', setValue);
      }
    },
    {
      type: 'scaleY',
      name: '缩放y',
      min: 0.1,
      max: clipPathScaleYMax * scaleCoff,
      value: clipPathScaleYValue,
      setValue: (val: number) => {
        const setValue = Number(val.toFixed(1));
        setClipPathScaleYValue(setValue);
      },
      afterSetValue: (val: number) => {
        const setValue = Number(val.toFixed(1));
        canvasRef.handler.imageClipPathHandler.update('scaleY', setValue);
      }
    }
  ];

  const setContent = (
    <div className="image-clip-path-set-wrapper">
      <div className="head global-border-bottom">
        <div className="global-second-title1">设置蒙版</div>
        <CloseSmall
          theme="outline"
          size="24"
          fill={normalIconColor}
          strokeWidth={3}
          onClick={() => {
            setOpenSetPanel(false);
          }}
        />
      </div>
      <div className="content">
        {setClipPathValueConfig.map((item, index) => (
          <div className="line" key={index}>
            <span className="global-common-third-title">{item.name}：</span>
            <Slider
              step={item.max - item.min > stepCoff ? 1 : minStepCoff}
              min={item.min}
              max={item.max}
              value={Number(item.value.toFixed(1))}
              onChange={(val: number) => {
                item.setValue(val);
              }}
              onAfterChange={(val: number) => {
                item.afterSetValue(val);
              }}
              tooltip={{ formatter: null }}
              style={{ width: 120 }}
            />
            <InputNumber
              min={item.min}
              max={item.max}
              value={item.value}
              style={{ backgroundColor: '#f6f7f9' }}
              onChange={(val: number) => {
                item.setValue(val);
              }}
              size="small"
              bordered={false}
              controls={false}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="image-clip-path-wrapper">
      <div className="global-common-third-title">蒙版</div>

      <div className="global-common-bg-color clip-path-box">
        <div className="left global-common-bg-color1">
          {!selectUrl && (
            <Plus
              onClick={() => {
                setOpenSelectPanel(true);
              }}
              theme="outline"
              size="30"
              strokeWidth={2}
              fill={normalIconColor}
            />
          )}
          {selectUrl && (
            <Popover
              content={setContent}
              open={openSetPanel}
              placement="left"
              trigger="click"
              getPopupContainer={(trigger) => trigger}
              onOpenChange={setOpenSetPanel}
            >
              <div className="thumb-box">
                <div className="set">
                  <SettingTwo theme="outline" size="20" fill={normalIconColor} strokeWidth={3} />
                </div>
                <img src={selectUrl}></img>
              </div>
            </Popover>
          )}
        </div>
        <Popover
          open={openSelectPanel}
          content={content}
          placement="bottomLeft"
          trigger="click"
          getPopupContainer={(trigger) => trigger}
          onOpenChange={setOpenSelectPanel}
        >
          <div className="right">
            <span className="global-common-title">添加蒙版</span>
            <Down theme="outline" size="16" fill={normalIconColor} strokeWidth={2} />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default ClipPath;
