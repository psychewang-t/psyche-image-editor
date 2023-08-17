import { ColorFilter } from '@icon-park/react';
import { Popover, Switch, Radio, Button, Slider, InputNumber } from 'antd';
import { useIndexContext } from '@/context/userContext';
import SliderDom from '@/components/right/image/filter/slider';
import SwitchDom from '@/components/right/image/filter/switch';
import { normalIconColor } from '@/global';

import { IContext } from '@/interface';
import './index.less';
import { useEffect, useState } from 'react';

const ImageFilter = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const [gammaValue, setGammaValue] = useState([1, 1, 1]);
  const [showGrayscale, setShowGrayscale] = useState(false);
  const [grayscaleValue, setGrayscaleValue] = useState('average');

  useEffect(() => {
    const filterGammaValue = canvasRef.handler.filterHandler.getFilterValue('gamma');
    if (filterGammaValue !== null && typeof filterGammaValue === 'object') {
      setGammaValue(filterGammaValue);
    } else {
      setGammaValue([1, 1, 1]);
    }

    const filterGrayscaleValue = canvasRef.handler.filterHandler.getFilterValue('grayscale');
    if (filterGrayscaleValue) {
      setShowGrayscale(true);
      setGrayscaleValue(filterGrayscaleValue.toString());
    } else {
      setShowGrayscale(false);
      setGrayscaleValue('average');
    }
  }, [updateKey]);

  return (
    <div className="image-filter-wrapper">
      <Popover
        content={
          <div className="filter-box">
            <div className="filter-line">
              <SliderDom type="brightness" name="亮度" min={-1} max={1}></SliderDom>
            </div>
            <div className="filter-line">
              <SliderDom type="contrast" name="对比度" min={-1} max={1}></SliderDom>
            </div>
            <div className="filter-line">
              <SliderDom type="saturation" name="饱和度" min={-1} max={1}></SliderDom>
            </div>
            <div className="filter-line">
              <SliderDom type="hueRotation" name="色调" min={-1} max={1}></SliderDom>
            </div>
            <div className="filter-line">
              <SliderDom type="noise" name="噪音" min={0} max={1000}></SliderDom>
            </div>
            <div className="filter-line">
              <SliderDom type="pixelate" name="像素化" min={1} max={100}></SliderDom>
            </div>
            <div className="filter-line">
              <SliderDom type="blur" name="模糊" min={0} max={1}></SliderDom>
            </div>
            <div className="filter-line">
              <span className="global-second-title text">伽马-r:</span>
              <Slider
                value={gammaValue[0]}
                min={0}
                max={2.5}
                step={0.1}
                style={{ width: '130px' }}
                tooltip={{ formatter: null }}
                onChange={(val: number) => {
                  const setVal = [val, gammaValue[1], gammaValue[2]];
                  canvasRef.handler.filterHandler.setFilter('gamma', setVal);
                  setGammaValue(setVal);
                }}
              />
              <InputNumber
                onPressEnter={(e) => {
                  const setVal = [Number((e.target as HTMLInputElement).value), gammaValue[1], gammaValue[2]];
                  canvasRef.handler.filterHandler.setFilter('gamma', setVal);
                  setGammaValue(setVal);
                }}
                value={gammaValue[0]}
                min={0}
                max={2.5}
                controls={false}
                style={{ width: '50px' }}
                size="small"
              />
            </div>
            <div className="filter-line">
              <span className="global-second-title text">伽马-g:</span>
              <Slider
                value={gammaValue[1]}
                min={0}
                max={2.5}
                step={0.1}
                style={{ width: '130px' }}
                tooltip={{ formatter: null }}
                onChange={(val: number) => {
                  const setVal = [gammaValue[0], val, gammaValue[2]];
                  canvasRef.handler.filterHandler.setFilter('gamma', setVal);
                  setGammaValue(setVal);
                }}
              />
              <InputNumber
                onPressEnter={(e) => {
                  const setVal = [gammaValue[0], Number((e.target as HTMLInputElement).value), gammaValue[2]];
                  canvasRef.handler.filterHandler.setFilter('gamma', setVal);
                  setGammaValue(setVal);
                }}
                value={gammaValue[1]}
                min={0}
                max={2.5}
                controls={false}
                style={{ width: '50px' }}
                size="small"
              />
            </div>
            <div className="filter-line">
              <span className="global-second-title text">伽马-b:</span>
              <Slider
                value={gammaValue[2]}
                min={0}
                max={2.5}
                step={0.1}
                style={{ width: '130px' }}
                tooltip={{ formatter: null }}
                onChange={(val: number) => {
                  const setVal = [gammaValue[0], gammaValue[1], val];
                  canvasRef.handler.filterHandler.setFilter('gamma', setVal);
                  setGammaValue(setVal);
                }}
              />
              <InputNumber
                onPressEnter={(e) => {
                  const setVal = [gammaValue[0], gammaValue[1], Number((e.target as HTMLInputElement).value)];
                  canvasRef.handler.filterHandler.setFilter('gamma', setVal);
                  setGammaValue(setVal);
                }}
                value={gammaValue[2]}
                min={0}
                max={2.5}
                controls={false}
                style={{ width: '50px' }}
                size="small"
              />
            </div>
            <div className="filter-line">
              <span className="global-second-title">灰度:</span>
              <Radio.Group
                value={grayscaleValue}
                onChange={(e) => {
                  setShowGrayscale(true);
                  canvasRef.handler.filterHandler.setFilter('grayscale', e.target.value);
                  setGrayscaleValue(e.target.value);
                }}
              >
                <Radio value="average">平衡</Radio>
                <Radio value="lightness">高亮</Radio>
              </Radio.Group>
              <Switch
                checked={showGrayscale}
                onChange={(val) => {
                  setShowGrayscale(val);
                  canvasRef.handler.filterHandler.setFilter('grayscale', val);
                }}
              />
            </div>
            <div className="filter-line">
              <div className="item">
                <SwitchDom name="反转" type="invert"></SwitchDom>
              </div>
              <div className="item">
                <SwitchDom name="棕褐" type="sepia"></SwitchDom>
              </div>
            </div>
            <div className="filter-line">
              <div className="item">
                <SwitchDom name="锐化" type="sharpen"></SwitchDom>
              </div>
              <div className="item">
                <SwitchDom name="浮雕" type="emboss"></SwitchDom>
              </div>
            </div>
            <div className="filter-line">
              <div className="item">
                <SwitchDom name="色彩" type="technicolor"></SwitchDom>
              </div>
              <div className="item">
                <SwitchDom name="宝丽来" type="polaroid"></SwitchDom>
              </div>
            </div>
            <div className="filter-line">
              <div className="item">
                <SwitchDom name="柯达" type="kodachrome"></SwitchDom>
              </div>
              <div className="item">
                <SwitchDom name="黑白" type="blackWhite"></SwitchDom>
              </div>
            </div>
            <div className="btn-box">
              <Button
                style={{ width: '150px', borderRadius: '8px' }}
                onClick={() => {
                  canvasRef.handler.filterHandler.removeFilter();
                }}
              >
                还原图片
              </Button>
            </div>
          </div>
        }
        trigger="click"
        placement="leftTop"
        destroyTooltipOnHide={true}
        getPopupContainer={(dom) => dom}
      >
        <div className="global-common-title global-common-bg-color btn">
          <ColorFilter theme="outline" size="18" fill={normalIconColor} strokeWidth={4} />
          滤镜
        </div>
      </Popover>
    </div>
  );
};

export default ImageFilter;
