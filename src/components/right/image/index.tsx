import Filter from '@/components/right/image/filter';
import Crop from '@/components/right/image/crop';
import Effect from '@/components/right/image/effect';
import BorderRadius from '@/components/right/image/border-radius';
import ClipPath from '@/components/right/image/clip-path';
import Replace from '@/components/right/image/replace';

import './index.less';

const Image = () => (
  <div className="right-image-panel-wrapper">
    <div className="global-right-head-title global-common-title">图片</div>
    <div className="image-panel-body">
      <div className="line-box">
        <Replace></Replace>
      </div>
      <div className="line-box">
        <Filter></Filter>
        <Crop></Crop>
      </div>
      <div className="global-right-border-line"></div>
      <Effect></Effect>
      <div className="global-right-border-line"></div>
      <ClipPath></ClipPath>
      <BorderRadius></BorderRadius>
      <div className="global-right-border-line"></div>
    </div>
  </div>
);

export default Image;
