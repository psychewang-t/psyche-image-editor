import { DeleteOne } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor } from '@/global';

import { IContext } from '@/interface';

const Delete = () => {
  const { canvasRef }: IContext = useIndexContext();

  const deleteObject = () => {
    canvasRef.handler.commonHandler.deleteObject();
  };

  return <DeleteOne theme="outline" size="24" fill={normalIconColor} onClick={() => deleteObject()} />;
};

export default Delete;
