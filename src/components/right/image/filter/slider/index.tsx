import { Slider, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';

interface IParam {
  type: string;
  name: string;
  max: number;
  min: number;
}
const stepDiff = 10;
const minStep = 0.1;

const SliderFilter = ({ type, name, max, min }: IParam) => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (type === 'pixelate') {
      setValue(1);
    }

    const filterValue = canvasRef.handler.filterHandler.getFilterValue(type);
    if (filterValue !== null) {
      setValue(Number(filterValue));
    } else {
      if (type === 'pixelate') {
        setValue(1);
      } else {
        setValue(0);
      }
    }
  }, [updateKey]);

  const setFilterValue = (val: number) => {
    canvasRef.handler.filterHandler.setFilter(type, val);
  };

  return (
    <>
      <span className="global-second-title text">{name}:</span>
      <Slider
        value={value}
        min={min}
        max={max}
        step={max - min > stepDiff ? 1 : minStep}
        style={{ width: '130px' }}
        tooltip={{ formatter: null }}
        onChange={(val: number) => {
          setFilterValue(val);
          setValue(val);
        }}
      />
      <InputNumber
        onPressEnter={(e) => {
          setFilterValue(Number((e.target as HTMLInputElement).value));
          setValue(Number((e.target as HTMLInputElement).value));
        }}
        value={value}
        min={min}
        max={max}
        controls={false}
        style={{ width: '50px' }}
        size="small"
      />
    </>
  );
};

export default SliderFilter;
