import Fill from '@/components/right/figure/effect/effect-fill';
import Stroke from '@/components/right/figure/effect/effect-stroke';
import Shadow from '@/components/right/figure/effect/effect-shadow';

import './index.less';

const Effect = () => (
  <div className="right-figure-effect-wrapper">
    <div className="head">
      <span className="global-second-title1">效果</span>
    </div>
    <div className="body">
      <Fill></Fill>
      <Stroke></Stroke>
      <Shadow></Shadow>
    </div>
  </div>
);

export default Effect;
