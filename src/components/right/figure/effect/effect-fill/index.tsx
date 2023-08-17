import { PreviewOpen, Down, CloseSmall, Pic, PreviewCloseOne } from '@icon-park/react';
import { Select, Popover, Upload, UploadProps, message } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { useIndexContext } from '@/context/userContext';
import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker';
import { colord } from 'colord';
import { normalIconColor, disabledIconColor } from '@/global';

import { IContext } from '@/interface';
import './index.less';

const Fill = () => {
  const { canvasRef, updateKey, selectKey }: IContext = useIndexContext();
  const PopoverDom = useRef(null);

  const [fillType, setFillType] = useState('color');
  const [fillShow, setFillShow] = useState(true);
  const [fillImageData, setFillImageData] = useState('');
  const [fillImageShowPopover, setFillImageShowPopover] = useState(false);
  const [fillColorValue, setFillColorValue] = useState('#fff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [presetColors, setPresetColors] = useState([]);

  const { isGradient, selectedPoint, getGradientObject } = useColorPicker(fillColorValue, setFillColorValue);

  useEffect(() => {
    getPresetColors();
  }, []);

  useEffect(() => {
    if (showColorPicker || !fillShow) {
      return;
    }

    init();
  }, [updateKey, selectKey]);

  // 根据选择颜色变化设置当前的填充
  useEffect(() => {
    // 放置在初始化颜色的时候重新设置
    if (!showColorPicker) {
      return;
    }

    // 因为color-picker第一次打开的时候会把选中中颜色大写，这时会触发这里，导致渲染
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    const fillValue = currentObj.fill;
    if ((fillValue as fabric.Gradient).type === 'linear' || (fillValue as fabric.Gradient).type === 'radial') {
      let oldFill = canvasRef.handler.commonHandler.fabricGradient2CSSGradient(
        currentObj.fill as fabric.IGradientOptions
      );

      oldFill = oldFill.toLowerCase().replace(/\s+/g, '');
      const newFill = fillColorValue.toLowerCase().replace(/\s+/g, '');
      if (oldFill === newFill) {
        return;
      }
    }

    if (isGradient) {
      // 需要将css的颜色渐变转换为fabric的渐变对象
      const gradientColor = canvasRef.handler.commonHandler.cssGradient2FabricGradient(fillColorValue);
      canvasRef.handler.effectHandler.setTextFill('gradient', gradientColor);
    } else {
      canvasRef.handler.effectHandler.setTextFill('rgba', fillColorValue);
    }

    setFillImageData('');
    setFillShow(true);
  }, [fillColorValue]);

  // 初始化填充信息
  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    let fillValue = currentObj.fill;
    if ((fillValue as fabric.Gradient).type === 'linear' || (fillValue as fabric.Gradient).type === 'radial') {
      setFillType('color');
      fillValue = canvasRef.handler.commonHandler.fabricGradient2CSSGradient(
        currentObj.fill as fabric.IGradientOptions
      );
      setFillColorValue(fillValue as string);
    } else if (typeof fillValue === 'string' && fillValue) {
      setFillType('color');
      setFillColorValue(fillValue as string);
    } else if ((fillValue as fabric.Pattern).source) {
      setFillType('image');
      const { currentSrc } = (fillValue as fabric.Pattern).source as HTMLImageElement;
      const imageData = currentSrc;
      setFillImageData(imageData);
    } else {
      setFillShow(false);
    }
  };

  // 获取画布的预制颜色
  const getPresetColors = async () => {
    setPresetColors(canvasRef.handler.canvasColors);
  };

  // 上传图片的回调
  const draggerProps: UploadProps = {
    accept: '.png, .jpg, .jpeg',
    showUploadList: false,
    beforeUpload(file) {
      redImageFile(file);

      return false;
    }
  };

  // 读取图片内容，并且设置文字填充为图片
  const redImageFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result as string;
      canvasRef.handler.effectHandler.setTextFill('image', base64Data);
      setFillShow(true);
      setFillImageData(base64Data);
    };

    reader.onerror = () => {
      message.error('图片获取失败，请重试！');
    };
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
    <div className="fill-box">
      <div className="fill-head">
        <span className="global-common-third-title">填充</span>
      </div>
      <div className="fill-body global-common-bg-color" ref={PopoverDom}>
        {fillType === 'color' && (
          <Popover
            content={
              <>
                <ColorPicker
                  value={fillColorValue}
                  onChange={(value: string) => {
                    setFillColorValue(value);
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
                          setFillColorValue(newColor);
                        } else {
                          setFillColorValue(item);
                        }
                      }}
                    ></div>
                  ))}
                </div>
              </>
            }
            onOpenChange={(val: boolean) => {
              setShowColorPicker(val);
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
            <div className="color" style={{ background: fillColorValue }}></div>
          </Popover>
        )}
        {fillType === 'image' && (
          <Popover
            content={
              <div className="fill-image-popover-box">
                <div className="fill-image-popover-head global-border-bottom">
                  <span className="global-second-title1">填充设置</span>
                  <CloseSmall
                    onClick={() => {
                      setFillImageShowPopover(false);
                    }}
                    theme="outline"
                    size="24"
                    fill={disabledIconColor}
                    strokeWidth={3}
                  />
                </div>
                <div
                  className="fill-image-popover-body global-border"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    let offsetX = 0;
                    let offsetY = 0;
                    const currentObj = canvasRef.handler.canvas.getActiveObject();
                    if (typeof currentObj.fill !== 'string') {
                      offsetX = currentObj.fill.offsetX;
                      offsetY = currentObj.fill.offsetY;
                    }

                    const startX = e.clientX;
                    const startY = e.clientY;
                    let preX = startX;
                    let preY = startY;

                    document.onmousemove = (event) => {
                      offsetX = event.clientX - preX + offsetX;
                      offsetY = event.clientY - preY + offsetY;

                      preX = event.clientX;
                      preY = event.clientY;

                      canvasRef.handler.effectHandler.setTextFillOffset({ offsetX, offsetY }, currentObj, false);
                    };

                    document.onmouseup = () => {
                      document.onmousemove = null;
                      canvasRef.handler.transactionHandler.save('property');
                      document.onmouseup = null;
                    };

                    e.stopPropagation();
                  }}
                >
                  {fillImageData && <img className="img" src={fillImageData} />}
                </div>
                <Upload.Dragger {...draggerProps}>
                  <div className="upload-box">
                    <div className="upload-text">上传图片</div>
                  </div>
                </Upload.Dragger>
              </div>
            }
            open={fillImageShowPopover}
            trigger="click"
            placement="leftTop"
            getPopupContainer={(trigger) => trigger}
          >
            <Pic
              onClick={() => {
                setFillImageShowPopover(!fillImageShowPopover);
              }}
              theme="outline"
              size="20"
              fill={normalIconColor}
              strokeWidth={3}
            />
          </Popover>
        )}

        <Select
          value={fillType}
          size="small"
          bordered={false}
          style={{ width: 160 }}
          suffixIcon={<Down theme="outline" size="18" fill={normalIconColor} strokeWidth={3} />}
          onChange={(val) => {
            setFillType(val);
          }}
          options={[
            {
              value: 'color',
              label: '颜色填充'
            },
            {
              value: 'image',
              label: '图片填充'
            }
          ]}
        />
        {fillShow && (
          <PreviewOpen
            onClick={() => {
              canvasRef.handler.effectHandler.setTextFill('rgba', '#fff');
              setFillShow(false);
            }}
            theme="outline"
            size="20"
            fill={normalIconColor}
            strokeWidth={3}
          />
        )}
        {!fillShow && (
          <PreviewCloseOne
            onClick={() => {
              setFillShow(true);
              if (fillType === 'color') {
                if (isGradient) {
                  // 需要将css的颜色渐变转换为fabric的渐变对象
                  const gradientColor = canvasRef.handler.commonHandler.cssGradient2FabricGradient(fillColorValue);
                  canvasRef.handler.effectHandler.setTextFill('gradient', gradientColor);
                } else {
                  canvasRef.handler.effectHandler.setTextFill('rgba', fillColorValue);
                }
              } else {
                canvasRef.handler.effectHandler.setTextFill('image', fillImageData);
              }
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

export default Fill;
