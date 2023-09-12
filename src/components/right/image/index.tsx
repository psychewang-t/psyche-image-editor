import Filter from '@/components/right/image/filter';
import Crop from '@/components/right/image/crop';
import Effect from '@/components/right/image/effect';
import BorderRadius from '@/components/right/image/border-radius';
import ClipPath from '@/components/right/image/clip-path';
import Replace from '@/components/right/image/replace';
import Cutout from '@/components/right/image/cutout';
import Restore from '@/components/right/image/restore';
import Inpainted from '@/components/right/image/inpainted';
import { useIndexContext } from '@/context/userContext';
import Opacity from '@/components/right/element/opacity';
import Toolbar from '@/components/right/element/toolbar';

import './index.less';
import { IContext } from '@/interface';

const hiddenZIndex = -100;

const Image = () => {
  const { selectKey, selectType }: IContext = useIndexContext();

  return (
    <div
      className="right-image-panel-wrapper"
      style={{ zIndex: selectType === 'image' && selectKey ? 1 : hiddenZIndex }}
    >
      <div className="global-right-head-title global-common-title">图片</div>
      <div className="image-panel-body">
        <div className="line-box">
          <Replace></Replace>
        </div>
        <div className="line-box">
          <Filter></Filter>
          <Crop></Crop>
        </div>
        <div className="line-box">
          <Cutout></Cutout>
          <Restore></Restore>
        </div>
        <div className="line-box">
          <Inpainted></Inpainted>
        </div>
        <div className="global-right-border-line"></div>
        <Effect></Effect>
        <div className="global-right-border-line"></div>
        <ClipPath></ClipPath>
        <BorderRadius></BorderRadius>
        <div className="global-right-border-line"></div>
        <Opacity />
        <Toolbar />
      </div>
    </div>
  );
};

export default Image;
