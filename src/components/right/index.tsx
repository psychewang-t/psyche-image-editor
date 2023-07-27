import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import CanvasPanel from '@/components/right/canvas';
import ImagePanel from '@/components/right/image';
import TextPanel from '@/components/right/text';
import FigurePanel from '@/components/right/figure';
import ElementPanel from '@/components/right/element';
import GroupPanel from '@/components/right/group';

import './index.less';

const Right = () => {
  const { selectKey, selectType }: IContext = useIndexContext();

  return (
    <div className="right-wrapper global-common-bg-color1">
      {selectType === 'default' && <CanvasPanel></CanvasPanel>}
      {selectType === 'image' && selectKey && <ImagePanel></ImagePanel>}
      {selectType === 'textbox' && selectKey && <TextPanel></TextPanel>}
      {(selectType === 'figure' || selectType === 'rect') && selectKey && <FigurePanel></FigurePanel>}
      {(selectType === 'activeSelection' || selectType === 'group') && selectKey && <GroupPanel></GroupPanel>}
      {selectType !== 'default' && selectKey && <ElementPanel></ElementPanel>}
    </div>
  );
};

export default Right;
