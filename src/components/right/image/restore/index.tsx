import { ClearFormat } from '@icon-park/react';
import { normalIconColor } from '@/global';

import './index.less';

const Cutout = () => (
  <div className="image-restore-wrapper">
    <div
      className="global-common-title global-common-bg-color btn"
      onClick={() => {
        console.log('123');
      }}
    >
      <ClearFormat theme="outline" size="18" fill={normalIconColor} strokeWidth={4} />
      消除
    </div>
  </div>
);

export default Cutout;
