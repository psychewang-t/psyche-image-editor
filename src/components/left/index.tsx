import { CircleFour } from '@icon-park/react';
import { normalIconColor, activeIconColor } from '@/global';
import { useIndexContext } from '@/context/userContext';
import Text2Img from '@/components/left/text2img';

import { IContext } from '@/interface';
import './index.less';

const Left = () => {
  const { leftTab, setLeftTab }: IContext = useIndexContext();

  return (
    <div className="left-wrapper  global-common-bg-color1">
      <div className="tab-list global-border-right">
        <div
          className="tab global-common-third-title"
          onClick={() => {
            if (leftTab === 'text2img') {
              setLeftTab('default');
            } else {
              setLeftTab('text2img');
            }
          }}
        >
          <CircleFour
            theme="filled"
            size="30"
            fill={leftTab === 'text2img' ? activeIconColor : normalIconColor}
            strokeWidth={2}
          />
          <span style={{ color: leftTab === 'text2img' ? activeIconColor : '' }}>文生图</span>
        </div>
      </div>
      <div className="drawer-wrapper" style={{ width: leftTab === 'default' ? '0' : '330px' }}>
        {leftTab === 'text2img' && <Text2Img></Text2Img>}
      </div>
    </div>
  );
};

export default Left;
