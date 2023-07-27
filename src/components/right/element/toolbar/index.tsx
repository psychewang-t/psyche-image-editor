import { Tooltip } from 'antd';
import Copy from './copy';
import Flip from './flip';
import Layer from './layer';
import Delete from './delete';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';

import './index.less';

const Toolbar = () => {
  const { selectType }: IContext = useIndexContext();

  return (
    <div className="toolbar-style-wrapper global-common-bg-color">
      <Tooltip title="复制">
        <div className="global-icon-hover">
          <Copy />
        </div>
      </Tooltip>
      {selectType !== 'activeSelection' && (
        <Tooltip title="图层顺序">
          <div className="global-icon-hover">
            <Layer />
          </div>
        </Tooltip>
      )}
      <Tooltip title="翻转">
        <div className="global-icon-hover">
          <Flip />
        </div>
      </Tooltip>
      <Tooltip title="删除">
        <div className="global-icon-hover">
          <Delete />
        </div>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
