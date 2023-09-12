import Effect from '@/components/right/figure/effect';
import BorderRadius from '@/components/right/figure/border-radius';
import { useIndexContext } from '@/context/userContext';
import Opacity from '@/components/right/element/opacity';
import Toolbar from '@/components/right/element/toolbar';
import { IContext } from '@/interface';

import './index.less';

const hiddenZIndex = -100;

const Figure = () => {
  const { selectKey, selectType }: IContext = useIndexContext();

  return (
    <div
      className="right-figure-panel-wrapper"
      style={{ zIndex: (selectType === 'figure' || selectType === 'rect') && selectKey ? 1 : hiddenZIndex }}
    >
      <div className="global-right-head-title global-common-title">图形</div>
      <div className="figure-panel-body">
        <Effect></Effect>
        {selectType === 'rect' && <BorderRadius></BorderRadius>}
        <div className="global-right-border-line"></div>

        <Opacity />
        <Toolbar />
      </div>
    </div>
  );
};

export default Figure;
