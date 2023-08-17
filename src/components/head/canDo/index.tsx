import { useEffect, useState } from 'react';
import { Return, GoOn } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { normalIconColor, disabledIconColor } from '@/global';

import './index.less';

const CanDo = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();

  const [hasUndo, setHasUndo] = useState(false);
  const [hasRedo, setHasRedo] = useState(false);

  useEffect(() => {
    const currentHasUndo = canvasRef.handler.transactionHandler.hasUndo();
    const currentHasRedo = canvasRef.handler.transactionHandler.hasRedo();

    if (currentHasUndo) {
      setHasUndo(true);
    } else {
      setHasUndo(false);
    }

    if (currentHasRedo) {
      setHasRedo(true);
    } else {
      setHasRedo(false);
    }
  }, [updateKey]);

  return (
    <div className="can-do-wrapper">
      <Return
        theme="outline"
        size="24"
        onClick={() => {
          canvasRef.handler.transactionHandler.undo();
        }}
        fill={hasUndo ? normalIconColor : disabledIconColor}
      />
      <GoOn
        theme="outline"
        size="24"
        onClick={() => {
          canvasRef.handler.transactionHandler.redo();
        }}
        fill={hasRedo ? normalIconColor : disabledIconColor}
      />
    </div>
  );
};

export default CanDo;
