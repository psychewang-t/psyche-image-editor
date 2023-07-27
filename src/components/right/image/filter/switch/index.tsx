import { Switch } from 'antd';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { useState, useEffect } from 'react';

interface IParam {
  type: string;
  name: string;
}

const SwitchFilter = ({ type, name }: IParam) => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const [value, setValue] = useState(false);

  useEffect(() => {
    const filterValue = canvasRef.handler.filterHandler.getFilterValue(type);
    if (filterValue !== null && typeof filterValue === 'boolean') {
      setValue(filterValue);
    } else {
      setValue(false);
    }
  }, [updateKey]);

  return (
    <>
      <span className="global-second-title">{name}:</span>
      <Switch
        checked={value}
        onChange={(val) => {
          setValue(val);
          canvasRef.handler.filterHandler.setFilter(type, val);
        }}
      />
    </>
  );
};

export default SwitchFilter;
