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
        setLeftTab
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
