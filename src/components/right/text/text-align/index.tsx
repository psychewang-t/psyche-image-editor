import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { AlignTextLeft, AlignTextCenter, AlignTextRight, AlignTextBoth } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor, activeIconColor } from '@/global';

import { IContext } from '@/interface';
import { Theme } from '@icon-park/react/lib/runtime';

const TextStyle = () => {
  const { canvasRef, selectKey }: IContext = useIndexContext();
  const [textAlign, setTextAlign] = useState<number | string>(0);

  useEffect(() => {
    init();
  }, [selectKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj || currentObj.type !== 'textbox') {
      return;
    }

    setTextAlign((currentObj as fabric.Textbox).textAlign);
  };

  const handleSetTextAlign = (align: string) => {
    canvasRef.handler.commonHandler.setProperty('textAlign', align);
    setTextAlign(align);
  };

  const getProps = (align: string) => ({
    className: 'global-icon-hover',
    onClick: () => handleSetTextAlign(align),
    theme: 'outline' as Theme,
    size: '16',
    strokeWidth: 6,
    fill: textAlign === align ? activeIconColor : normalIconColor
  });

  const TEXT_ALIGN_CONFIG = [
    {
      component: <AlignTextLeft {...getProps('left')} />,
      title: '居左'
    },
    {
      component: <AlignTextCenter {...getProps('center')} />,
      title: '居中'
    },
    {
      component: <AlignTextRight {...getProps('right')} />,
      title: '居右'
    },
    {
      component: <AlignTextBoth {...getProps('justify')} />,
      title: '两边对齐'
    }
  ];

  return (
    <div className="text-style-wrapper global-common-bg-color">
      {TEXT_ALIGN_CONFIG.map((e) => (
        <Tooltip title={e.title} key={e.title}>
          {e.component}
        </Tooltip>
      ))}
    </div>
  );
};

export default TextStyle;
