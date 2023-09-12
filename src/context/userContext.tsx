import React, { ReactNode, useState } from 'react';
import editorRenderCanvas from 'psyche-editor-render/dist/Canvas';

type Props = {
  children: ReactNode;
};

const IndexContext = React.createContext(null);
IndexContext.displayName = 'IndexContext';

export const IndexContextProvider = ({ children }: Props) => {
  const [canvasRef, setCanvasRef] = useState<editorRenderCanvas>(null);
  const [updateKey, setUpdateKey] = useState('');
  const [selectKey, setSelectKey] = useState('');
  const [selectType, setSelectType] = useState('default');
  const [templateFont, setTemplateFont] = useState([]);
  const [leftTab, setLeftTab] = useState('default');

  // 正在执行抠图中
  const [cutting, setCutting] = useState(false);
  // 正在执行消除
  const [restoring, setRestoring] = useState(false);
  // 正在执行重绘
  const [inpainting, setInpainting] = useState(false);

  return (
    <IndexContext.Provider
      value={{
        canvasRef,
        setCanvasRef,
        updateKey,
        setUpdateKey,
        selectKey,
        setSelectKey,
        selectType,
        setSelectType,
        templateFont,
        setTemplateFont,
        leftTab,
        setLeftTab,
        cutting,
        setCutting,
        restoring,
        setRestoring,
        inpainting,
        setInpainting
      }}
    >
      {children}
    </IndexContext.Provider>
  );
};

export const useIndexContext = () => {
  const context = React.useContext(IndexContext);
  if (!context) {
    throw new Error('useIndexContext不存在');
  }

  return context;
};
