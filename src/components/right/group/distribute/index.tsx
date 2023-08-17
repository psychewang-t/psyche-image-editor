import { useEffect, useState } from 'react';
import { DistributeHorizontally, DistributeVertically } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor } from '@/global';

import { IContext } from '@/interface';
import './index.less';

const Distribute = () => {
  const { canvasRef, selectKey }: IContext = useIndexContext();

  const [show, setShow] = useState(false);

  useEffect(() => {
    init();
  }, [selectKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject() as fabric.ActiveSelection;
    if (!currentObj) {
      return;
    }

    const type = canvasRef.handler.commonHandler.getObjectType(currentObj);
    const constant = 2;
    if (type === 'activeSelection' && currentObj.getObjects().length > constant) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div className="distribute-wrapper">
      <div
        className={`item global-common-bg-color ${show ? '' : 'global-not-allowed'}`}
        onClick={() => {
          canvasRef.handler.alignHandler.distributeHor();
        }}
      >
        <DistributeHorizontally theme="outline" size="18" fill={normalIconColor} />
        <div className="name">水平分布</div>
      </div>
      <div
        className={`item global-common-bg-color ${show ? '' : 'global-not-allowed'}`}
        onClick={() => {
          canvasRef.handler.alignHandler.distributeVer();
        }}
      >
        <DistributeVertically theme="outline" size="18" fill={normalIconColor} />
        <div className="name">垂直分布</div>
      </div>
    </div>
  );
};

export default Distribute;
