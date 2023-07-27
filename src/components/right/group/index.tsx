import Create from '@/components/right/group/create';
import Align from '@/components/right/group/align';
import Distribute from '@/components/right/group/distribute';
import { useIndexContext } from '@/context/userContext';

import './index.less';

import { IContext } from '@/interface';

const Group = () => {
  const { selectType }: IContext = useIndexContext();

  return (
    <div className="right-group-panel-wrapper">
      <div className="global-right-head-title global-common-title">组合</div>
      <div className="group-panel-body">
        <Create></Create>
        <Align></Align>
        {selectType === 'activeSelection' && <Distribute></Distribute>}

        <div className="global-right-border-line"></div>
      </div>
    </div>
  );
};

export default Group;
