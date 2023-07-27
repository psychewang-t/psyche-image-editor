import Effect from '@/components/right/figure/effect';
import BorderRadius from '@/components/right/figure/border-radius';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';

import './index.less';

const Figure = () => {
  const { selectType }: IContext = useIndexContext();

  return (
    <div className="right-figure-panel-wrapper">
      <div className="global-right-head-title global-common-title">图形</div>
      <div className="figure-panel-body">
        <Effect></Effect>
        {selectType === 'rect' && <BorderRadius></BorderRadius>}
        <div className="global-right-border-line"></div>
      </div>
    </div>
  );
};

export default Figure;
