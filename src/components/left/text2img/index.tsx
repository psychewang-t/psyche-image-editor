import { useEffect, useState } from 'react';
import { text2img } from '@/server';
import { useRequest } from 'ahooks';
import { Input, Button } from 'antd';
import { Square, RectangleOne, Rectangle } from '@icon-park/react';
import { normalIconColor } from '@/global';

import { Theme } from '@icon-park/react/lib/runtime';
import './index.less';

const Text2Img = () => {
  const [dataList, setDataList] = useState([]);
  const [currentSize, setCurrentSize] = useState('square');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [creating, setCreating] = useState(false);

  const { data, loading, run } = useRequest(text2img, {
    manual: true,
    onError: (e: Error) => {
      console.error('文生图失败', e);
    }
  });

  useEffect(() => {
    if (!loading && data) {
      const copy = JSON.parse(JSON.stringify(dataList));

      copy.unshift(data);
      setDataList(copy);
      setCreating(false);
    }
  }, [loading]);

  // 获取文生图的结果
  const getText2Img = async () => {
    const { width, height } = getSize();
    run({
      prompt: textAreaValue,
      width,
      height
    });
  };

  // 获取生成尺寸
  const getSize = () => {
    if (currentSize === 'square') {
      return { width: 512, height: 512 };
    }

    if (currentSize === 'hor') {
      return { width: 768, height: 512 };
    }

    if (currentSize === 'ver') {
      return { width: 512, height: 768 };
    }
  };

  const getProps = () => ({
    theme: 'outline' as Theme,
    size: '40',
    strokeWidth: 3,
    fill: normalIconColor
  });

  const sizeList = [
    {
      name: '方形',
      icon: <Square {...getProps()} />,
      type: 'square'
    },
    {
      name: '横版',
      icon: <RectangleOne {...getProps()} />,
      type: 'hor'
    },
    {
      name: '竖版',
      icon: <Rectangle {...getProps()} />,
      type: 'ver'
    }
  ];

  return (
    <div className="text2img-wrapper">
      <div className="input-wrapper">
        <div className="desc global-common-third-title">描述你想要的图片内容，AI会帮您创建图片。</div>
        <div className="desc global-common-third-title">目前只支持英文。</div>
        <Input.TextArea
          onChange={(e) => {
            setTextAreaValue(e.target.value);
          }}
        />
      </div>

      <div className="size-wrapper">
        <div className="head global-second-title1">长宽比</div>
        <div className="size-list">
          {sizeList.map((item, index) => (
            <div className="item-box" key={index}>
              <div
                className={
                  currentSize === item.type
                    ? 'global-border-color item-border item global-common-bg-color'
                    : 'item global-common-bg-color'
                }
                onClick={() => {
                  setCurrentSize(item.type);
                }}
              >
                {item.icon}
              </div>
              <div className="name global-common-third-title">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="btn-wrapper">
        <Button
          type="primary"
          loading={creating}
          block
          onClick={() => {
            setCreating(true);
            getText2Img();
          }}
        >
          开始生成
        </Button>
      </div>

      <div className="result-list">
        {dataList.map((item, index) => (
          <div className="img-box global-common-bg-color" key={index}>
            <img src={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Text2Img;
