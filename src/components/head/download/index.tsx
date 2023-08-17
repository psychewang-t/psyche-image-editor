import { useState } from 'react';
import { CloseSmall } from '@icon-park/react';
import { Dropdown, Button, Select, MenuProps } from 'antd';
import FileSaver from 'file-saver';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { disabledIconColor } from '@/global';

import './index.less';

const Download = () => {
  const { canvasRef }: IContext = useIndexContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const [resImgType, setResImgType] = useState('png');
  const [resImgSize, setResImgSize] = useState(1);
  const [resImgQuality, setResImgQuality] = useState(1);

  const downloadImg = async () => {
    const data = await canvasRef.handler.exportHandler.exportImageAsync({
      format: resImgType,
      quality: resImgQuality,
      multiplier: resImgSize
    });
    FileSaver.saveAs(data, `下载图片.${resImgType}`);
  };

  const items: MenuProps['items'] = [
    {
      key: 'download',
      label: (
        <div className="download-wrapper">
          <div className="head global-big-title">
            <span>下载作品</span>
            <CloseSmall
              theme="filled"
              size="24"
              fill={disabledIconColor}
              strokeWidth={3}
              onClick={() => {
                setShowDropdown(false);
              }}
            />
          </div>
          <div className="body">
            <div className="global-common-title title">作品类型</div>
            <div className="line">
              <Select
                value={resImgType}
                style={{ width: '60%' }}
                onChange={(value) => {
                  setResImgType(value);
                }}
              >
                <Select.Option value="png">PNG</Select.Option>
                <Select.Option value="jpeg">JPG</Select.Option>
              </Select>
              <Select
                value={resImgSize}
                style={{ width: '35%' }}
                onChange={(value) => {
                  setResImgSize(value);
                }}
              >
                <Select.Option value={0.5}>0.5倍尺寸</Select.Option>
                <Select.Option value={1}>原图尺寸</Select.Option>
                <Select.Option value={1.5}>1.5倍尺寸</Select.Option>
                <Select.Option value={2}>2倍尺寸</Select.Option>
                <Select.Option value={3}>3倍尺寸</Select.Option>
              </Select>
            </div>
            <Select
              value={resImgQuality}
              style={{ width: '100%' }}
              onChange={(value) => {
                setResImgQuality(value);
              }}
            >
              <Select.Option value={1}>100%(无压缩)</Select.Option>
              <Select.Option value={0.8}>80%</Select.Option>
              <Select.Option value={0.7}>70%</Select.Option>
              <Select.Option value={0.5}>50%(普通压缩)</Select.Option>
              <Select.Option value={0.2}>20%</Select.Option>
            </Select>
          </div>
          <Button
            type="primary"
            className="download-btn dropdown-btn global-common-btn-color"
            onClick={() => {
              downloadImg();
            }}
          >
            下载
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <Dropdown open={showDropdown} trigger={['click']} menu={{ items }} overlayClassName="download-dropdown-wrapper">
        <Button
          type="primary"
          className="download-btn global-common-btn-color"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          下载
        </Button>
      </Dropdown>
    </>
  );
};

export default Download;
