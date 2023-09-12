import CanvasPanel from '@/components/right/canvas';
import ImagePanel from '@/components/right/image';
import TextPanel from '@/components/right/text';
import FigurePanel from '@/components/right/figure';
import GroupPanel from '@/components/right/group';

import './index.less';

const Right = () => (
  <div className="right-wrapper global-common-bg-color1">
    <CanvasPanel></CanvasPanel>
    <ImagePanel></ImagePanel>
    <TextPanel></TextPanel>
    <FigurePanel></FigurePanel>
    <GroupPanel></GroupPanel>
  </div>
);

export default Right;
