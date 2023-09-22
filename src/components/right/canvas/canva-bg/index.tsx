import { Popover, Segmented } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker';
import UploadImage from '@/components/common/upload';

import './index.less';

const CanvasBg = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();
  const PopoverDom = useRef(null);

  const [currentType, setCurrentType] = useState('color');
  const [colorValue, setColorValue] = useState('#fff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { isGradient } = useColorPicker(colorValue, setColorValue);

  useEffect(() => {
    if (showColorPicker) {
      return;
    }

    initWorkareaColor();
  }, [updateKey]);

  useEffect(() => {
    // 防止在初始化颜色的时候重新设置
    if (!showColorPicker) {
      return;
    }

    if (isGradient) {
      // 需要将css的颜色渐变转换为fabric的渐变对象
      const gradientColor = canvasRef.handler.commonHandler.cssGradient2FabricGradient(colorValue);
      canvasRef.handler.workareaHandler.setBgColor('gradient', gradientColor);
    } else {
      canvasRef.handler.workareaHandler.setBgColor('rgba', colorValue);
    }
  }, [colorValue]);

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

  // 获取画布背景色
  const initWorkareaColor = () => {
    const workarea = canvasRef.handler.commonHandler.findById('workarea');
    if (!workarea) {
      return;
    }

    let fillValue = workarea.fill;
    if ((fillValue as fabric.Gradient).type === 'linear' || (fillValue as fabric.Gradient).type === 'radial') {
      setCurrentType('color');
      fillValue = canvasRef.handler.commonHandler.fabricGradient2CSSGradient(fillValue as fabric.IGradientOptions);
      setColorValue(fillValue as string);
    } else if (typeof fillValue === 'string' && fillValue) {
      setCurrentType('color');
      setColorValue(fillValue as string);
    } else if ((fillValue as fabric.Pattern).source) {
      setCurrentType('image');
    }
  };

  return (
    <div className="canvas-bg-wrapper">
      <div className="bg-head-wrapper">
        <span className="global-common-third-title">画布背景</span>
      </div>
      <div className="bg-body-wrapper">
        <Segmented
          block
          value={currentType}
          options={[
            {
              label: <div>颜色</div>,
              value: 'color'
            },
            {
              label: <div>图片</div>,
              value: 'image'
            }
          ]}
          onChange={(val) => {
            setCurrentType(val.toString());
          }}
        />
      </div>
      {currentType === 'color' && (
        <div className="bg-footer-color-box global-common-bg-color" ref={PopoverDom}>
          <Popover
            content={
              <ColorPicker
                value={colorValue}
                onChange={(value: string) => {
                  setColorValue(value);
                }}
                hidePresets={true}
                hideAdvancedSliders={true}
                hideColorGuide={true}
              />
            }
            trigger="click"
            placement="leftTop"
            onOpenChange={(val: boolean) => {
              setShowColorPicker(val);
              const time = 100;
              setTimeout(() => {
                if (val && PopoverDom?.current) {
                  setDomChinese(PopoverDom.current);
                }
              }, time);
            }}
            getPopupContainer={(trigger) => trigger}
          >
            <div className="color-item" style={{ background: colorValue }}></div>
          </Popover>
        </div>
      )}
      {currentType === 'image' && (
        <div className="upload-image">
          <UploadImage
            name="上传背景图"
            uploadCallback={(url) => {
              canvasRef.handler.workareaHandler.setBgColor('image', url);
            }}
          ></UploadImage>
        </div>
      )}
    </div>
  );
};

export default CanvasBg;
