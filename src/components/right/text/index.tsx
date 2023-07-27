import Effect from '@/components/right/text/effect';
import FontSpace from '@/components/right/text/font-space';
import LineHeight from '@/components/right/text/line-height';
import TextStyle from '@/components/right/text/text-style';
import TextAlign from '@/components/right/text/text-align';
import FontFamily from '@/components/right/text/font-family';
import FontSize from '@/components/right/text/font-size';

import './index.less';

const Text = () => (
  <div className="right-text-panel-wrapper">
    <div className="global-right-head-title global-common-title">文字</div>
    <div className="text-panel-body">
      <div className="wrapper">
        <FontFamily></FontFamily>
        <FontSize></FontSize>
      </div>
      <div className="wrapper">
        <FontSpace></FontSpace>
        <LineHeight></LineHeight>
      </div>
      <div className="wrapper">
        <TextStyle></TextStyle>
      </div>
      <div className="wrapper">
        <TextAlign></TextAlign>
      </div>
      <div className="global-right-border-line"></div>
      <Effect></Effect>
      <div className="global-right-border-line"></div>
    </div>
  </div>
);

export default Text;
