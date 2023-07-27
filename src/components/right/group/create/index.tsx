import { useEffect, useState } from 'react';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { Button } from 'antd';

import './index.less';

const Create = () => {
  const { canvasRef, selectKey, updateKey }: IContext = useIndexContext();

  const [text, setText] = useState('成组');

  useEffect(() => {
    init();
  }, [selectKey, updateKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    const type = canvasRef.handler.commonHandler.getObjectType(currentObj);
    if (type === 'group') {
      setText('拆分组');
    } else {
      setText('成组');
    }
  };

  return (
    <div className="create-group-wrapper">
      <Button
        type="default"
        block
        onClick={() => {
          if (text === '成组') {
            canvasRef.handler.groupHandler.toGroup();
          } else {
            canvasRef.handler.groupHandler.unGroup();
          }
        }}
      >
        {text}
      </Button>
    </div>
  );
};

export default Create;
