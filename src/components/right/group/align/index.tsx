import { AlignLeft, AlignRight, AlignHorizontally, AlignTop, AlignVertically, AlignBottom } from '@icon-park/react';
import { Tooltip } from 'antd';
import { useIndexContext } from '@/context/userContext';

import './index.less';

import { IContext } from '@/interface';
import { Theme } from '@icon-park/react/lib/runtime';

const Align = () => {
  const { canvasRef }: IContext = useIndexContext();

  const getProps = (align: string) => ({
    onClick: () => {
      canvasRef.handler.alignHandler.align(align);
    },
    theme: 'outline' as Theme,
    size: '18',
    fill: '#333'
  });

  const ALIGN_CONFIG = [
    {
      component: <AlignLeft {...getProps('left')} />,
      title: '左对齐'
    },
    {
      component: <AlignHorizontally {...getProps('horCenter')} />,
      title: '水平居中对齐'
    },
    {
      component: <AlignRight {...getProps('right')} />,
      title: '右对齐'
    },
    {
      component: <div className="hor-line global-common-bg-color2" key="line"></div>
    },
    {
      component: <AlignTop {...getProps('top')} />,
      title: '顶部对齐'
    },
    {
      component: <AlignVertically {...getProps('verCenter')} />,
      title: '垂直居中对齐'
    },
    {
      component: <AlignBottom {...getProps('bottom')} />,
      title: '底部对齐'
    }
  ];

  return (
    <div className="align-wrapper global-common-bg-color">
      {ALIGN_CONFIG.map((e) => {
        if (e.title) {
          return (
            <Tooltip title={e.title} key={e.title} placement="bottom">
              {e.component}
            </Tooltip>
          );
        }

        return e.component;
      })}
    </div>
  );
};

export default Align;
