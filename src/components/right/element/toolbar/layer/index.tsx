import { Layers, ArrowUp, ArrowDown } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { Dropdown, Slider, MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { SliderMarks } from 'antd/lib/slider';
import { normalIconColor } from '@/global';

const LayerBtn = () => {
  const { canvasRef, selectKey }: IContext = useIndexContext();
  const [open, setOpen] = useState(false);
  const [layerCount, setLayerCount] = useState<number>(0);
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);
  const [marks, setMarks] = useState<SliderMarks>({});

  useEffect(() => {
    init();
  }, [selectKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    const layerList = canvasRef.handler.layerHandler.getEffectiveLayers();
    handleSetMarks(layerList.length);
    const currentLayer = canvasRef.handler.layerHandler.getLayer();

    setCurrentLayerIndex(currentLayer);
    setLayerCount(layerList.length);
  };

  const handleSetMarks = (count: number) => {
    const marksConfig: SliderMarks = {};
    while (count > 0) {
      marksConfig[count] = <div className="layer-slider-scale"></div>;
      count -= 1;
    }

    setMarks(marksConfig);
  };

  const handleLayerChange = (value: number) => {
    const res = canvasRef.handler.layerHandler.updateLayerOrderByTargetIndex(value - 1);
    if (res) {
      setCurrentLayerIndex(value);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'layer',
      label: (
        <div className="layer-dropdown-item">
          <ArrowDown fill={normalIconColor} onClick={() => handleLayerChange(currentLayerIndex - 1)} />
          <Slider
            className="slider"
            min={1}
            step={1}
            max={layerCount}
            value={currentLayerIndex}
            onChange={handleLayerChange}
            marks={marks}
          />
          <ArrowUp fill={normalIconColor} onClick={() => handleLayerChange(currentLayerIndex + 1)} />
        </div>
      )
    }
  ];

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  return (
    <Dropdown
      menu={{ items }}
      placement="bottom"
      trigger={['click']}
      onOpenChange={handleOpenChange}
      open={open}
      overlayClassName="layer-dropdwon-wrapper"
    >
      <Layers fill={normalIconColor} />
    </Dropdown>
  );
};

export default LayerBtn;
