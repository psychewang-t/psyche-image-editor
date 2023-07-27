import CanvasRef from 'psyche-editor-render';

export interface IFont {
  name: string;
  thumbUrl: string;
  alias: string;
  ttfUrl: string;
  woffUrl: string;
}
export interface IContext {
  canvasRef?: CanvasRef;
  setCanvasRef?: React.Dispatch<React.SetStateAction<CanvasRef>>;
  updateKey?: string;
  setUpdateKey?: React.Dispatch<React.SetStateAction<string>>;
  selectKey?: string;
  setSelectKey?: React.Dispatch<React.SetStateAction<string>>;
  selectType?: string;
  setSelectType?: React.Dispatch<React.SetStateAction<string>>;
  templateFont?: IFont[];
  setTemplateFont?: React.Dispatch<React.SetStateAction<IFont[]>>;
}
