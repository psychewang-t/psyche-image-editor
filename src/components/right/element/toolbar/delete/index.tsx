import { DeleteOne } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';

const Delete = () => {
  const { canvasRef }: IContext = useIndexContext();

  const deleteObject = () => {
    canvasRef.handler.commonHandler.deleteObject();
  };

  return <DeleteOne theme="outline" size="24" fill="#333" onClick={() => deleteObject()} />;
};

export default Delete;
