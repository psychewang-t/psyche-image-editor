import { useEffect, useRef } from 'react';
import EditorRender from 'psyche-editor-render';
import Head from '@/components/head';
import Right from '@/components/right';
import Left from '@/components/left';
import Window from '@/components/common/controller/window';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { ICanvasObject } from 'psyche-editor-render/dist/interface';

import '@/global.less';
import './App.less';

const App = () => {
  const canvasDom = useRef(null);
  const { canvasRef, setCanvasRef, setUpdateKey, setSelectKey, setSelectType, leftTab }: IContext = useIndexContext();

  useEffect(() => {
    if (!canvasDom) {
      return;
    }

    setCanvasRef(canvasDom.current);

    // @ts-ignore
    window._c = canvasDom.current;
  }, [canvasDom, setCanvasRef]);

  const onModified = (target: fabric.Object, key: string, value: string | boolean) => {
    setUpdateKey(`${(target as ICanvasObject).id}-${key}-${value}`);
  };

  const onSelect = (target?: fabric.Object, type?: string) => {
    setSelectType(type);
    setSelectKey(`${(target as ICanvasObject)?.id}`);
  };

  return (
    <div className="App">
      {canvasRef && <Head></Head>}
      {canvasRef && <Right></Right>}
      {canvasRef && <Left></Left>}
      <div className="editor-render-wrapper" style={{ left: leftTab === 'default' ? '70px' : '400px' }}>
        <EditorRender.canvas ref={canvasDom} onModified={onModified} onSelect={onSelect}></EditorRender.canvas>
        {canvasRef && <Window></Window>}
      </div>
    </div>
  );
};

export default App;
