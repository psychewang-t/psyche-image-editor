import Create from '@/components/right/group/create';
import Align from '@/components/right/group/align';
import Distribute from '@/components/right/group/distribute';
import { useIndexContext } from '@/context/userContext';
import Opacity from '@/components/right/element/opacity';
import Toolbar from '@/components/right/element/toolbar';

import './index.less';

import { IContext } from '@/interface';

const hiddenZIndex = -100;

const Group = () => {
  const { selectKey, selectType }: IContext = useIndexContext();

  return (
    <div
      className="right-group-panel-wrapper"
      style={{
        zIndex: (selectType === 'activeSelection' || selectType === 'group') && selectKey ? 1 : hiddenZIndex
      }}
    >
      <div className="global-right-head-title global-common-title">组合</div>
      <div className="group-panel-body">
        <Create></Create>
        <Align></Align>
        {selectType === 'activeSelection' && <Distribute></Distribute>}

        <div className="global-right-border-line"></div>

        {selectType !== 'activeSelection' && <Opacity />}
        <Toolbar />
      </div>
    </div>
  );
};

export default Group;
