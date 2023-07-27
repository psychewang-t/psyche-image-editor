import Opacity from '@/components/right/element/opacity';
import Toolbar from '@/components/right/element/toolbar';
import { useIndexContext } from '@/context/userContext';

import './index.less';

import { IContext } from '@/interface';

const Element = () => {
  const { selectType }: IContext = useIndexContext();

  return (
    <div className="right-element-panel-wrapper">
      <div className="element-panel-body">
        {selectType !== 'activeSelection' && <Opacity />}
        <Toolbar />
      </div>
    </div>
  );
};

export default Element;
