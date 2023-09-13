import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { TextBold, TextItalic, TextUnderline, Strikethrough } from '@icon-park/react';
import { useIndexContext } from '@/context/userContext';
import { normalIconColor, activeIconColor } from '@/global';

import { IContext } from '@/interface';
import './index.less';

const TextStyle = () => {
  const { canvasRef, updateKey }: IContext = useIndexContext();
  const [fontWeight, setFontWeight] = useState<number | string>(0);
  const [fontStyle, setFontStyle] = useState<string>('normal');
  const [underline, setUnderline] = useState<boolean>(false);
  const [linethrough, setLinethrough] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, [updateKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj || currentObj.type !== 'textbox') {
      return;
    }

    setFontWeight((currentObj as fabric.Textbox).fontWeight);
    setFontStyle((currentObj as fabric.Textbox).fontStyle);
    setUnderline((currentObj as fabric.Textbox).underline);
    setLinethrough((currentObj as fabric.Textbox).linethrough);
  };

  return (
    <div className="text-style-wrapper global-common-bg-color">
      <Tooltip title="加粗">
        <TextBold
          theme="outline"
          size="16"
          strokeWidth={6}
          className="global-icon-hover"
          fill={fontWeight === 'bold' ? activeIconColor : normalIconColor}
          onClick={() => {
            if (fontWeight === 'bold') {
              setFontWeight('normal');
              canvasRef.handler.commonHandler.setProperty({ key: 'fontWeight', value: 'normal' });
            } else {
              setFontWeight('bold');
              canvasRef.handler.commonHandler.setProperty({ key: 'fontWeight', value: 'bold' });
            }
          }}
        />
      </Tooltip>
      <Tooltip title="斜体">
        <TextItalic
          theme="outline"
          size="16"
          strokeWidth={6}
          className="global-icon-hover"
          fill={fontStyle === 'italic' ? activeIconColor : normalIconColor}
          onClick={() => {
            if (fontStyle === 'italic') {
              setFontStyle('normal');
              canvasRef.handler.commonHandler.setProperty({ key: 'fontStyle', value: 'normal' });
            } else {
              setFontStyle('italic');
              canvasRef.handler.commonHandler.setProperty({ key: 'fontStyle', value: 'italic' });
            }
          }}
        />
      </Tooltip>
      <Tooltip title="下划线">
        <TextUnderline
          theme="outline"
          size="16"
          strokeWidth={6}
          className="global-icon-hover"
          fill={underline ? activeIconColor : normalIconColor}
          onClick={() => {
            canvasRef.handler.commonHandler.setProperty({ key: 'underline', value: !underline });
            setUnderline(!underline);
          }}
        />
      </Tooltip>
      <Tooltip title="删除线">
        <Strikethrough
          theme="outline"
          size="16"
          strokeWidth={6}
          className="global-icon-hover"
          fill={linethrough ? activeIconColor : normalIconColor}
          onClick={() => {
            canvasRef.handler.commonHandler.setProperty({ key: 'linethrough', value: !linethrough });
            setLinethrough(!linethrough);
          }}
        />
      </Tooltip>
    </div>
  );
};

export default TextStyle;
