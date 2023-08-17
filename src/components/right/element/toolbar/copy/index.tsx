import { Copy } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor } from '@/global';

import { IContext } from '@/interface';

const CopyBtn = () => {
  const { canvasRef }: IContext = useIndexContext();

  const handleCopy = () => {
    canvasRef.handler.eventHandler.copy(true);
  };

  return <Copy theme="outline" size="24" fill={normalIconColor} onClick={() => handleCopy()} />;
};

export default CopyBtn;
