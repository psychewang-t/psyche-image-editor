import { useEffect, useState } from 'react';
import { useIndexContext } from '@/context/userContext';
import { Down, LoadingThree, ExpressionlessFace } from '@icon-park/react';
import { Popover, Input, message } from 'antd';
import { setTemplateFontData } from '@/utils/font';
import { normalIconColor } from '@/global';

import { fontList } from '@/config/font';

import { IContext, IFont } from '@/interface';
import './index.less';

const FontFamily = () => {
  const { canvasRef, updateKey, selectKey, templateFont, setTemplateFont }: IContext = useIndexContext();

  const [search, setSearch] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [currentThumb, setCurrentThumb] = useState('');
  const [showFontList, setShowFontList] = useState<IFont[]>();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (showContent) {
      // 如果一次性显示所有的文字Popover会显示的很慢，因此先显示一部分
      const copyFont = JSON.parse(JSON.stringify(fontList));
      const end = 30;
      const font = copyFont.splice(0, end);
      setShowFontList(font);
      const time = 500;
      setTimeout(() => {
        setShowFontList(fontList);
      }, time);
    }
  }, [showContent]);

  useEffect(() => {
    init();
  }, [selectKey, updateKey]);

  const init = () => {
    const currentObj = canvasRef.handler.canvas.getActiveObject();
    if (!currentObj) {
      return;
    }

    const objFontFamily = (currentObj as fabric.Textbox).fontFamily;
    const fontData = fontList.find((item) => item.name === objFontFamily);
    if (fontData) {
      setCurrentThumb(fontData.thumbUrl);
    } else {
      setCurrentThumb('');
    }
  };

  const onSearch = (val: string) => {
    setSearch(true);
    const data = fontList.filter((item) => item.alias.indexOf(val) > -1);
    setSearchData(data);
  };

  const selectFont = async (font: IFont) => {
    const loadFont = await canvasRef.handler.commonHandler.loadFontAsync(font.name, font.woffUrl);
    if (loadFont) {
      canvasRef.handler.commonHandler.setProperty({ key: 'fontFamily', value: font.name });
      setLoadingIndex(-1);

      setTemplateFontData({ canvasRef, setTemplateFont });
    } else {
      message.error('字体加载失败！');
      setLoadingIndex(-1);
    }
  };

  const content = (
    <div className="font-family-content">
      <div className="search-box">
        <Input.Search
          placeholder="搜索字体"
          onSearch={onSearch}
          style={{ width: '100%' }}
          onChange={(e) => {
            if (!e.target.value) {
              setSearch(false);
            }
          }}
          enterButton
        />
      </div>
      <div className="list-box">
        {!search && templateFont?.length > 0 && (
          <>
            <div className="system-font global-common-third-title">模版字体</div>
            {templateFont.map((item, index) => (
              <div
                className="item global-icon-hover"
                key={index}
                onClick={() => {
                  selectFont(item);
                }}
              >
                <img src={item.thumbUrl} />
              </div>
            ))}
          </>
        )}
        <div className="system-font global-common-third-title">系统字体</div>
        {!search &&
          showFontList?.length > 0 &&
          showFontList.map((item, index) => (
            <div
              className="item global-icon-hover"
              key={index}
              onClick={() => {
                setLoadingIndex(index);
                selectFont(item);
              }}
            >
              <img src={item.thumbUrl} />
              {loadingIndex === index && (
                <LoadingThree theme="outline" size="18" fill={normalIconColor} strokeWidth={3} />
              )}
            </div>
          ))}

        {search &&
          searchData?.length > 0 &&
          searchData.map((item, index) => (
            <div
              className="item global-icon-hover"
              key={index}
              onClick={() => {
                setLoadingIndex(index);
                selectFont(item);
              }}
            >
              <img src={item.thumbUrl} />
              {loadingIndex === index && (
                <LoadingThree theme="outline" size="18" fill={normalIconColor} strokeWidth={3} />
              )}
            </div>
          ))}
        {search && searchData?.length === 0 && (
          <div className="search-data-null">
            <ExpressionlessFace theme="outline" size="30" fill={normalIconColor} strokeWidth={3} />
            <div className="text global-common-tips">未查到字体</div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      placement="bottom"
      trigger="click"
      getPopupContainer={(trigger) => trigger}
      onOpenChange={setShowContent}
    >
      <div className="font-family-wrapper global-common-bg-color">
        <div className="font-family-box">
          <div className="img-box">
            {currentThumb && <img src={currentThumb} />}
            {!currentThumb && <span>默认字体</span>}
          </div>
          <Down theme="outline" size="18" fill={normalIconColor} strokeWidth={3} />
        </div>
      </div>
    </Popover>
  );
};

export default FontFamily;
