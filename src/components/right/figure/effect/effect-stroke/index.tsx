import {
  PreviewOpen,
  Down,
  More,
  CloseSmall,
  EndpointSquare,
  EndpointRound,
  EndpointFlat,
  NodeFlat,
  NodeRound,
  NodeSquare,
  PreviewCloseOne,
  VerticalTidyUp
} from '@icon-park/react';
import { Select, Popover, InputNumber, Segmented } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { useIndexContext } from '@/context/userContext';
import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker';
import { colord } from 'colord';

import { IContext } from '@/interface';
import './index.less';

const Stroke = () => {
  const { canvasRef, updateKey, selectKey }: IContext = useIndexContext();
  const lineDashDefaultValue = 2;
  const strokeMin = 0;
  const strokeMax = 100;

  const PopoverDom = useRef(null);

  const [strokeColorValue, setStrokeColorValue] = useState('#fff');
  const [strokeWidthValue, setStrokeWidthValue] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeStylePopover, setShowStrokeStylePopover] = useState(false);
  const [lineStyle, setLineStyle] = useState('solid');
  const [lineDashLengthValue, SetLineDashLengthValue] = useState(lineDashDefaultValue);
  const [lineDashSpace, setLineDashSpace] = useState(lineDashDefaultValue);
  const [lineDashCap, setLineDashCap] = useState('');
  const [lineDashJoin, setLineDashJoin] = useState('');
  const [strokeShow, setStrokeShow] = useState(true);
  const [presetColors, setPresetColors] = useState([]);

  const { isGradient, selectedPoint, getGradientObject } = useColorPicker(strokeColorValue, setStrokeColorValue);

  useEffect(() => {
    getPresetColors();
  }, []);

  useEffect(() => {
    if (showColorPicker || !strokeShow) {
      return;
    }

    init();
  }, [updateKey, selectKey]);

  useEffect(() => {
    // 放置在初始化颜色的时候重新设置
    if (!showColorPicker) {
      return;
    }

    // 因为color-picker第一次打开的时候会把选中中颜色大写，这时会触发这里，导致渲染
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    const strokeColor = currentObj.stroke;
    // @ts-ignore
    if (strokeColor?.type === 'linear' || strokeColor?.type === 'radial') {
      let oldStroke = canvasRef.handler.commonHandler.fabricGradient2CSSGradient(
        strokeColor as fabric.IGradientOptions
      );
      oldStroke = oldStroke.toLowerCase().replace(/\s+/g, '');
      const newStroke = strokeColorValue.toLowerCase().replace(/\s+/g, '');
      if (oldStroke === newStroke) {
        return;
      }
    }

    if (isGradient) {
      // 需要将css的颜色渐变转换为fabric的渐变对象
      const gradientColor = canvasRef.handler.commonHandler.cssGradient2FabricGradient(strokeColorValue);
      canvasRef.handler.effectHandler.setStroke('gradient', gradientColor);
    } else {
      canvasRef.handler.effectHandler.setStroke('rgba', strokeColorValue);
    }

    setStrokeShow(true);
  }, [strokeColorValue]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    let strokeColor = currentObj.stroke;
    // @ts-ignore
    if (strokeColor?.type === 'linear' || strokeColor?.type === 'radial') {
      strokeColor = canvasRef.handler.commonHandler.fabricGradient2CSSGradient(strokeColor as fabric.IGradientOptions);
    }

    if (strokeColor) {
      setStrokeShow(true);
    } else {
      setStrokeShow(false);
    }

    setStrokeColorValue(strokeColor);
    setStrokeWidthValue(currentObj.strokeWidth);

    if (currentObj.strokeDashArray?.length > 0) {
      setLineStyle('dash');
      SetLineDashLengthValue(currentObj.strokeDashArray[0] || 0);
      setLineDashSpace(currentObj.strokeDashArray[1] || 0);
    } else {
      setLineStyle('solid');
    }

    setLineDashCap(currentObj.strokeLineCap);
    setLineDashJoin(currentObj.strokeLineJoin);
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
        }
      } else {
        setDomChinese(item);
      }
    }
  };

  return (
    <div className="stroke-box">
      <div className="stroke-head">
        <span className="global-common-third-title">描边</span>
      </div>
      <div className="stroke-body global-common-bg-color" ref={PopoverDom}>
        <Popover
          content={
            <>
              <ColorPicker
                value={strokeColorValue}
                onChange={(value: string) => {
                  setStrokeColorValue(value);
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
                      if (isGradient) {
                        const color = colord(item).toRgb();
                        const gradientObject = getGradientObject();
                        const rgb = `RGBA(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
                        gradientObject.colors[selectedPoint].value = rgb;
                        let colorStr = '';
                        gradientObject.colors.forEach((data: { value: string; left: number }) => {
                          colorStr += `${data.value} ${data.left}%,`;
                        });
                        colorStr = colorStr.replace(/,$/gi, '');
                        const newColor = `${gradientObject.gradientType}(${gradientObject.degrees}, ${colorStr})`;
                        setStrokeColorValue(newColor);
                      } else {
                        setStrokeColorValue(item);
                      }
                    }}
                  ></div>
                ))}
              </div>
            </>
          }
          onOpenChange={(val: boolean) => {
            setShowColorPicker(val);
            setShowStrokeStylePopover(false);
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
          <div className="color" style={{ background: strokeColorValue }}></div>
        </Popover>
        <div className="input-box">
          <VerticalTidyUp
            onMouseDown={(e) => {
              const startX = e.clientX;
              document.onmousemove = (event) => {
                let distance = event.clientX - startX + strokeWidthValue;
                if (distance < strokeMin) {
                  distance = strokeMin;
                }

                if (distance > strokeMax) {
                  distance = strokeMax;
                }

                const currentObj = canvasRef.handler.canvas.getActiveObject();
                canvasRef.handler.effectHandler.setStrokeWidth(Math.round(distance), currentObj, false);
                setStrokeWidthValue(Math.round(distance));
              };

              document.onmouseup = () => {
                document.onmousemove = null;
                canvasRef.handler.transactionHandler.save('strokeWidth');
                document.onmouseup = null;
              };
            }}
            theme="outline"
            size="20"
            fill="#636c78"
            strokeWidth={3}
          />
          <InputNumber
            onChange={(val) => {
              setStrokeWidthValue(val);
            }}
            onPressEnter={() => {
              canvasRef.handler.effectHandler.setStrokeWidth(strokeWidthValue);
            }}
            size="small"
            controls={false}
            bordered={false}
            min={strokeMin}
            max={strokeMax}
            value={Math.round(strokeWidthValue)}
          />
        </div>
        <Popover
          content={
            <div className="stroke-popover-box" key={updateKey}>
              <div className="stroke-popover-head global-border-bottom">
                <span className="global-second-title1">描边设置</span>
                <CloseSmall
                  theme="outline"
                  size="24"
                  fill="#636c78"
                  strokeWidth={3}
                  onClick={() => {
                    setShowStrokeStylePopover(false);
                  }}
                />
              </div>
              <div className="stroke-popover-body">
                <div className="line-box">
                  <span className="global-common-third-title">样式</span>
                  <Select
                    value={lineStyle}
                    size="small"
                    bordered={false}
                    style={{ width: 80, backgroundColor: '#f6f7f9' }}
                    suffixIcon={<Down theme="outline" size="18" fill="#636c78" strokeWidth={3} />}
                    onChange={(val) => {
                      setLineStyle(val);
                      if (val === 'dash') {
                        canvasRef.handler.effectHandler.setStrokeDash([lineDashLengthValue, lineDashSpace]);
                      } else {
                        canvasRef.handler.effectHandler.setStrokeDash([]);
                      }
                    }}
                    options={[
                      {
                        value: 'solid',
                        label: '实线'
                      },
                      {
                        value: 'dash',
                        label: '虚线'
                      }
                    ]}
                  />
                </div>
                {lineStyle === 'dash' && (
                  <>
                    <div className="line-box">
                      <span className="global-common-third-title">长度</span>
                      <InputNumber
                        style={{ backgroundColor: '#f6f7f9' }}
                        width={80}
                        size="small"
                        bordered={false}
                        min={0}
                        max={100}
                        value={lineDashLengthValue}
                        onChange={(val) => {
                          canvasRef.handler.effectHandler.setStrokeDash([val, lineDashSpace]);
                          SetLineDashLengthValue(val);
                        }}
                      />
                    </div>
                    <div className="line-box">
                      <span className="global-common-third-title">间隔</span>
                      <InputNumber
                        style={{ backgroundColor: '#f6f7f9' }}
                        width={80}
                        size="small"
                        bordered={false}
                        min={0}
                        max={100}
                        value={lineDashSpace}
                        onChange={(val) => {
                          canvasRef.handler.effectHandler.setStrokeDash([lineDashLengthValue, val]);
                          setLineDashSpace(val);
                        }}
                      />
                    </div>
                    <div className="line-box">
                      <span className="global-common-third-title">风格</span>
                      <Segmented
                        size="small"
                        value={lineDashCap}
                        onChange={(val) => {
                          canvasRef.handler.effectHandler.setStrokeCap(val.toString());
                          setLineDashCap(val.toString());
                        }}
                        options={[
                          {
                            value: 'butt',
                            icon: <EndpointFlat theme="outline" size="20" fill="#636c78" strokeWidth={3} />
                          },
                          {
                            value: 'square',
                            icon: <EndpointSquare theme="outline" size="20" fill="#636c78" strokeWidth={3} />
                          },
                          {
                            value: 'round',
                            icon: <EndpointRound theme="outline" size="20" fill="#636c78" strokeWidth={3} />
                          }
                        ]}
                      />
                    </div>
                  </>
                )}

                <div className="line-box">
                  <span className="global-common-third-title">边角</span>
                  <Segmented
                    size="small"
                    value={lineDashJoin}
                    onChange={(val) => {
                      canvasRef.handler.effectHandler.setStrokeJoin(val.toString());
                      setLineDashJoin(val.toString());
                    }}
                    options={[
                      {
                        value: 'miter',
                        icon: <NodeFlat theme="outline" size="20" fill="#636c78" strokeWidth={3} />
                      },
                      {
                        value: 'round',
                        icon: <NodeRound theme="outline" size="20" fill="#636c78" strokeWidth={3} />
                      },
                      {
                        value: 'bevel',
                        icon: <NodeSquare theme="outline" size="20" fill="#636c78" strokeWidth={3} />
                      }
                    ]}
                  />
                </div>
              </div>
            </div>
          }
          open={showStrokeStylePopover}
          getPopupContainer={(trigger) => trigger}
          trigger="click"
          placement="bottomLeft"
        >
          <More
            theme="outline"
            size="20"
            fill="#636c78"
            strokeWidth={3}
            onClick={() => {
              setShowStrokeStylePopover(!showStrokeStylePopover);
            }}
          />
        </Popover>
        {strokeShow && (
          <PreviewOpen
            onClick={() => {
              canvasRef.handler.effectHandler.setStroke('default', '');
              setStrokeShow(false);
            }}
            theme="outline"
            size="20"
            fill="#636c78"
            strokeWidth={3}
          />
        )}
        {!strokeShow && (
          <PreviewCloseOne
            onClick={() => {
              if (isGradient) {
                // 需要将css的颜色渐变转换为fabric的渐变对象
                const gradientColor = canvasRef.handler.commonHandler.cssGradient2FabricGradient(strokeColorValue);
                canvasRef.handler.effectHandler.setStroke('gradient', gradientColor);
              } else {
                canvasRef.handler.effectHandler.setStroke('rgba', strokeColorValue);
              }

              setStrokeShow(true);
            }}
            theme="outline"
            size="20"
            fill="#636c78"
            strokeWidth={3}
          />
        )}
      </div>
    </div>
  );
};

export default Stroke;
