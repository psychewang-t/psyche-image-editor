import { FlipHorizontally, FlipVertically } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { Dropdown, MenuProps } from 'antd';
import { useState } from 'react';
import { normalIconColor } from '@/global';

const FlipBtn = () => {
  const { canvasRef }: IContext = useIndexContext();
  const [open, setOpen] = useState(false);

  const onClick = (key: string) => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    const val = !currentObj[key as keyof fabric.Object];
    canvasRef.handler.commonHandler.setProperty({ key: key as keyof fabric.Object, value: val });
  };

  const items: MenuProps['items'] = [
    {
      key: 'flipX',
      label: (
        <div
          className="flip-dropdown-item"
          onClick={() => {
            onClick('flipX');
          }}
        >
          <FlipHorizontally fill={normalIconColor} />
          <span>水平翻转</span>
        </div>
      )
    },
    {
      key: 'flipY',
      label: (
        <div
          className="flip-dropdown-item"
          onClick={() => {
            onClick('flipY');
          }}
        >
          <FlipVertically fill={normalIconColor} />
          <span>垂直翻转</span>
        </div>
      )
    }
  ];

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  return (
    <Dropdown menu={{ items }} placement="bottom" trigger={['click']} onOpenChange={handleOpenChange} open={open}>
      <FlipHorizontally fill={normalIconColor} />
    </Dropdown>
  );
};

export default FlipBtn;
