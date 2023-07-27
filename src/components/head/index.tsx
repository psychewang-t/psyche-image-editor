import File from '@/components/head/file';
import CanDo from '@/components/head/canDo';
import Download from '@/components/head/download';
import Figure from '@/components/head/figure';

import './index.less';

const Head = () => (
  <div className="head-wrapper global-common-bg-color1">
    <div className="left">
      <File></File>
    </div>
    <div className="center">
      <CanDo></CanDo>
      <Figure></Figure>
    </div>
    <div className="right">
      <Download></Download>
    </div>
  </div>
);

export default Head;
