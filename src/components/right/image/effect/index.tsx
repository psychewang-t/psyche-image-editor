import { useEffect, useState } from 'react';
import { Popover } from 'antd';
import { useIndexContext } from '@/context/userContext';
import Stroke from '@/components/right/image/effect/effect-stroke';
import Shadow from '@/components/right/image/effect/effect-shadow';

import { IContext } from '@/interface';
import './index.less';

const Effect = () => {
  const { canvasRef }: IContext = useIndexContext();

  const [effectList, setEffectList] = useState([]);

  useEffect(() => {
    setEffectList(canvasRef.handler.effectHandler.getImagePresets());
  }, []);

  return (
    <div className="right-image-effect-wrapper">
      <div className="head">
        <span className="global-second-title1">效果</span>
        <Popover
          placement="bottomLeft"
          title="预设效果"
          zIndex={1100}
          trigger="click"
          getPopupContainer={(trigger) => trigger}
          content={
            <div className="effect-show-box">
              {effectList.map((item, index) => (
                <div
                  key={index}
                  className="item global-common-bg-color"
                  onClick={() => {
                    canvasRef.handler.effectHandler.setPresets(item);
                  }}
                >
                  <img src={item.thumbUrl} />
                </div>
              ))}
            </div>
          }
        >
          <span className="can-click global-second-title1">预设效果</span>
        </Popover>
      </div>
      <div className="body">
        <Stroke></Stroke>
        <Shadow></Shadow>
      </div>
    </div>
  );
};

export default Effect;
