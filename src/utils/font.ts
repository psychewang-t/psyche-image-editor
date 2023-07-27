import { fontList } from '@/config/font';

import { IContext, IFont } from '@/interface';
import { IInitFabricObj } from 'psyche-editor-render/dist/interface';

interface IParam {
  canvasRef: IContext['canvasRef'];
  setTemplateFont: IContext['setTemplateFont'];
  json?: IInitFabricObj[];
}

// 设置当前模版中的字体
export const setTemplateFontData = (param: IParam) => {
  const data = param.json || param.canvasRef.canvas.getObjects();

  const fontArr: IFont[] = [];
  for (const item of data) {
    const fontItem = item as fabric.Textbox;
    if (fontItem.type === 'textbox') {
      const fontData = fontList.find((font) => font.name === fontItem.fontFamily);
      const has = fontArr.find((font) => font.name === fontItem.fontFamily);
      if (fontData && !has) {
        fontArr.push(fontData);
      }
    }
  }

  param.setTemplateFont(fontArr);
};
