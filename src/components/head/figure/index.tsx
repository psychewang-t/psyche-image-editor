// import { useEffect } from 'react';
import {
  Square,
  Down,
  RightTwo,
  Star,
  PentagonOne,
  Round,
  Triangle,
  OvalOne,
  Rectangle,
  Trapezoid,
  DiamondThree,
  BlockSix
} from '@icon-park/react';
import { Dropdown, MenuProps } from 'antd';
import { Theme } from '@icon-park/react/lib/runtime';
import { useIndexContext } from '@/context/userContext';
import { IContext } from '@/interface';
import { normalIconColor } from '@/global';

import './index.less';

const Figure = () => {
  const { canvasRef }: IContext = useIndexContext();

  // useEffect(() => {}, []);

  const getProps = () => ({
    theme: 'outline' as Theme,
    size: '24',
    strokeWidth: 3,
    fill: normalIconColor
  });

  const items: MenuProps['items'] = [
    {
      key: 'arrow',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('arrow');
          }}
        >
          <RightTwo {...getProps()} />
          <div className="name">箭头</div>
        </div>
      )
    },
    {
      key: 'pentagram',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('pentagram');
          }}
        >
          <Star {...getProps()} />
          <div className="name">多角星</div>
        </div>
      )
    },
    {
      key: 'polygon',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('polygon');
          }}
        >
          <PentagonOne {...getProps()} />
          <div className="name">多边形</div>
        </div>
      )
    },
    {
      key: 'circle',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('circle');
          }}
        >
          <Round {...getProps()} />
          <div className="name">圆形</div>
        </div>
      )
    },
    {
      key: 'triangle',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('triangle');
          }}
        >
          <Triangle {...getProps()} />
          <div className="name">三角形</div>
        </div>
      )
    },
    {
      key: 'ellipse',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('ellipse');
          }}
        >
          <OvalOne {...getProps()} />
          <div className="name">椭圆</div>
        </div>
      )
    },
    {
      key: 'rect',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('rect');
          }}
        >
          <Rectangle {...getProps()} />
          <div className="name">矩形</div>
        </div>
      )
    },
    {
      key: 'trapezoid',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('trapezoid');
          }}
        >
          <Trapezoid {...getProps()} />
          <div className="name">梯形</div>
        </div>
      )
    },
    {
      key: 'rhombus',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('rhombus');
          }}
        >
          <DiamondThree {...getProps()} />
          <div className="name">菱形</div>
        </div>
      )
    },
    {
      key: 'line',
      label: (
        <div
          className="figure-menu-item"
          onClick={() => {
            canvasRef.handler.figureHandler.create('line');
          }}
        >
          <BlockSix {...getProps()} />
          <div className="name">线段</div>
        </div>
      )
    }
  ];

  return (
    <div className="figure-wrapper">
      <Dropdown menu={{ items }} trigger={['click']}>
        <div className="icon-wrapper">
          <Square theme="outline" size="24" fill={normalIconColor} strokeWidth={3} />
          <Down theme="outline" size="18" fill={normalIconColor} strokeWidth={3} />
        </div>
      </Dropdown>
    </div>
  );
};

export default Figure;
