import React, { ReactNode, useState } from 'react';
import CanvasRef from 'psyche-editor-render';

type Props = {
  children: ReactNode;
};

const IndexContext = React.createContext(null);
IndexContext.displayName = 'IndexContext';

export const IndexContextProvider = ({ children }: Props) => {
  const [canvasRef, setCanvasRef] = useState<CanvasRef>(null);
  const [updateKey, setUpdateKey] = useState('');
  const [selectKey, setSelectKey] = useState('');
  const [selectType, setSelectType] = useState('default');
  const [templateFont, setTemplateFont] = useState([]);

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
        setTemplateFont
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
