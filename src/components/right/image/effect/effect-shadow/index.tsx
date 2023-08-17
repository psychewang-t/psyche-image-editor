import { PreviewOpen, More, CloseSmall, PreviewCloseOne, SunOne } from '@icon-park/react';
import { Popover, InputNumber } from 'antd';
import { useEffect, useState, useRef } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor, disabledIconColor } from '@/global';

import { IContext } from '@/interface';
import './index.less';

const Shadow = () => {
  const { canvasRef, updateKey, selectKey }: IContext = useIndexContext();
  const defaultBlur = 10;
  const defaultOffsetY = 10;
  const blurMin = 1;
  const blurMax = 100;

  const PopoverDom = useRef(null);

  const [shadowColorValue, setShadowColorValue] = useState('#fff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [shadowShow, setShadowShow] = useState(true);
  const [shadowBlur, setShadowBlur] = useState(defaultBlur);
  const [showShadowPopover, setShowShadowPopover] = useState(false);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(defaultOffsetY);
  const [presetColors, setPresetColors] = useState([]);

  useEffect(() => {
    getPresetColors();
  }, []);

  useEffect(() => {
    if (showColorPicker) {
      return;
    }

    init();
  }, [updateKey, selectKey]);

  useEffect(() => {
    // 防止在初始化颜色的时候重新设置
    if (!showColorPicker) {
      return;
    }

    canvasRef.handler.effectHandler.setShadow({
      color: shadowColorValue,
      blur: shadowBlur,
      offsetX: shadowOffsetX,
      offsetY: shadowOffsetY
    });

    setShadowShow(true);
  }, [shadowColorValue]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    if (!currentObj.shadow) {
      setShadowShow(false);

      return;
    }

    setShadowShow(true);

    if (typeof currentObj.shadow !== 'string') {
      setShadowColorValue(currentObj.shadow.color);
      setShadowBlur(currentObj.shadow.blur);
      setShadowOffsetX(currentObj.shadow.offsetX);
      setShadowOffsetY(currentObj.shadow.offsetY);
    }
  };

  // 获取画布的预制颜色
  const getPresetColors = async () => {
    setPresetColors(canvasRef.handler.canvasColors);
  };

  // 设置按钮的中文
  const setDomChinese = (dom: Element) => {
    if (dom.children.length === 0) {
      return;
    }

    for (const item of dom.children) {
      if (item.children.length === 0) {
        if (item.innerHTML === 'Solid') {
          item.innerHTML = '纯色';
        }

        if (item.innerHTML === 'Gradient') {
          item.innerHTML = '渐变';
          // 阴影情况下不需要渐变
          (item as HTMLDivElement).style.display = 'none';
        }
      } else {
        setDomChinese(item);
      }
    }
  };

  return (
    <div className="shadow-box">
      <div className="shadow-head">
        <span className="global-common-third-title">阴影</span>
      </div>
      <div className="shadow-body global-common-bg-color" ref={PopoverDom}>
        <Popover
          content={
            <>
              <ColorPicker
                value={shadowColorValue}
                onChange={(value: string) => {
                  setShadowColorValue(value);
                }}
                hidePresets={true}
                hideAdvancedSliders={true}
                hideColorGuide={true}
              ></ColorPicker>
              <div className="color-box">
                {presetColors.map((item, index) => (
                  <div
                    className="color-item global-border"
                    key={index}
                    style={{ background: item }}
                    onClick={() => {
                      setShadowColorValue(item);
                    }}
                  ></div>
                ))}
              </div>
            </>
          }
          onOpenChange={async (val: boolean) => {
            setShowColorPicker(val);
            setShowShadowPopover(false);
            const time = 100;
            setTimeout(() => {
              if (val && PopoverDom?.current) {
                setDomChinese(PopoverDom.current);
              }
            }, time);
          }}
          trigger="click"
          placement="leftTop"
          getPopupContainer={(trigger) => trigger}
        >
          <div className="color" style={{ background: shadowColorValue }}></div>
        </Popover>
        <div className="input-box">
          <SunOne
            onMouseDown={(e) => {
              const startX = e.clientX;
              document.onmousemove = (event) => {
                let distance = event.clientX - startX + shadowBlur;
                if (distance < blurMin) {
                  distance = blurMin;
                }

                if (distance > blurMax) {
                  distance = blurMax;
                }

                const currentObj = canvasRef.handler.canvas.getActiveObject();
                canvasRef.handler.effectHandler.setShadow(
                  {
                    color: shadowColorValue,
                    blur: Math.round(distance),
                    offsetX: shadowOffsetX,
                    offsetY: shadowOffsetY
                  },
                  currentObj,
                  false
                );
                setShadowBlur(Math.round(distance));
              };

              document.onmouseup = () => {
                document.onmousemove = null;
                canvasRef.handler.transactionHandler.save('shadow');
                document.onmouseup = null;
              };
            }}
            theme="outline"
            size="20"
            fill={normalIconColor}
            strokeWidth={3}
          />
          <InputNumber
            onChange={(val) => {
              setShadowBlur(val);
            }}
            onPressEnter={() => {
              canvasRef.handler.effectHandler.setShadow({
                color: shadowColorValue,
                blur: shadowBlur,
                offsetX: shadowOffsetX,
                offsetY: shadowOffsetY
              });
            }}
            size="small"
            bordered={false}
            controls={false}
            min={blurMin}
            max={blurMax}
            value={shadowBlur}
          />
        </div>
        <Popover
          content={
            <div className="shadow-popover-box">
              <div className="shadow-popover-head global-border-bottom">
                <span className="global-second-title1">阴影设置</span>
                <CloseSmall
                  onClick={() => {
                    setShowShadowPopover(false);
                  }}
                  theme="outline"
                  size="24"
                  fill={disabledIconColor}
                  strokeWidth={3}
                />
              </div>
              <div className="shadow-popover-body">
                <div className="line-box">
                  <span className="global-common-third-title">位置-x</span>
                  <InputNumber
                    style={{ backgroundColor: '#f6f7f9' }}
                    width={80}
                    size="small"
                    bordered={false}
                    min={-100}
                    max={100}
                    value={Math.round(shadowOffsetX)}
                    onChange={(val) => {
                      canvasRef.handler.effectHandler.setShadow({
                        color: shadowColorValue,
                        blur: shadowBlur,
                        offsetX: val,
                        offsetY: shadowOffsetY
                      });
                      setShadowOffsetX(val);
                    }}
                  />
                </div>
                <div className="line-box">
                  <span className="global-common-third-title">位置-y</span>
                  <InputNumber
                    style={{ backgroundColor: '#f6f7f9' }}
                    width={80}
                    size="small"
                    bordered={false}
                    min={-100}
                    max={100}
                    value={Math.round(shadowOffsetY)}
                    onChange={(val) => {
                      canvasRef.handler.effectHandler.setShadow({
                        color: shadowColorValue,
                        blur: shadowBlur,
                        offsetX: shadowOffsetX,
                        offsetY: val
                      });
                      setShadowOffsetY(val);
                    }}
                  />
                </div>
              </div>
            </div>
          }
          open={showShadowPopover}
          getPopupContainer={(trigger) => trigger}
          trigger="click"
          placement="bottomLeft"
        >
          <More
            onClick={() => {
              setShowShadowPopover(!showShadowPopover);
            }}
            theme="outline"
            size="20"
            fill={normalIconColor}
            strokeWidth={3}
          />
        </Popover>
        {shadowShow && (
          <PreviewOpen
            onClick={() => {
              canvasRef.handler.effectHandler.setShadow({});
              setShadowShow(false);
            }}
            theme="outline"
            size="20"
            fill={normalIconColor}
            strokeWidth={3}
          />
        )}
        {!shadowShow && (
          <PreviewCloseOne
            onClick={() => {
              canvasRef.handler.effectHandler.setShadow({
                color: shadowColorValue,
                blur: shadowBlur,
                offsetX: shadowOffsetX,
                offsetY: shadowOffsetY
              });
              setShadowShow(true);
            }}
            theme="outline"
            size="20"
            fill={normalIconColor}
            strokeWidth={3}
          />
        )}
      </div>
    </div>
  );
};

export default Shadow;
