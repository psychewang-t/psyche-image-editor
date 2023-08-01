import editorRenderCanvas from 'psyche-editor-render/dist/Canvas';

export interface IFont {
  name: string;
  thumbUrl: string;
  alias: string;
  ttfUrl: string;
  woffUrl: string;
}
export interface IContext {
  canvasRef?: editorRenderCanvas;
  setCanvasRef?: React.Dispatch<React.SetStateAction<editorRenderCanvas>>;
  updateKey?: string;
  setUpdateKey?: React.Dispatch<React.SetStateAction<string>>;
  selectKey?: string;
  setSelectKey?: React.Dispatch<React.SetStateAction<string>>;
  selectType?: string;
  setSelectType?: React.Dispatch<React.SetStateAction<string>>;
  templateFont?: IFont[];
  setTemplateFont?: React.Dispatch<React.SetStateAction<IFont[]>>;
}
