import { useEffect, useState } from 'react';
import { Dropdown, message, Modal, Upload, Input, Button, Tooltip, UploadProps, MenuProps, Spin } from 'antd';
import { useIndexContext } from '@/context/userContext';
import { IContext, IFont } from '@/interface';
import { Check } from '@icon-park/react';
import { fontList } from '@/config/font';
import { setTemplateFontData } from '@/utils/font';

import './index.less';
import { IJsonData } from 'psyche-editor-render/dist/interface';

const File = () => {
  const { canvasRef, updateKey, setTemplateFont }: IContext = useIndexContext();

  const [selectRuler, setSelectRuler] = useState(false);
  const [selectGuideline, setSelectGuideline] = useState(false);

  const [figmaUserToken, setFigmaUserToken] = useState('');
  const [figmaFileId, setFigmaFileId] = useState('');

  const [showImportFileModal, setShowImportFileModal] = useState(false);

  const [loadingPSD, setLoadingPSD] = useState(false);
  const [loadingFigma, setLoadingFigma] = useState(false);
  const [figmaButtonText, setFigmaButtonText] = useState('开始导入');

  const draggerProps: UploadProps = {
    accept: '.psd, .sketch',
    showUploadList: false,
    beforeUpload(file) {
      readFile(file);

      return false;
    }
  };

  useEffect(() => {
    init();
  }, [updateKey]);

  const init = () => {
    const hasRuler = canvasRef.handler.rulerHandler.hasRuler();
    setSelectRuler(hasRuler);

    const hasAlignLines = canvasRef.handler.rulerHandler.hasAlignLines();
    setSelectGuideline(hasAlignLines);
  };

  const readFile = (file: File) => {
    setLoadingPSD(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      let jsonData: IJsonData = null;
      const bufferData = reader.result as ArrayBuffer;
      if (file.name.includes('.psd') || file.type.includes('.adobe.photoshop')) {
        jsonData = canvasRef.handler.parsePSDHandler.parsePSD(bufferData);
      } else if (file.name.includes('.sketch')) {
        jsonData = await canvasRef.handler.parseSketchHandler.parseSketchAsync(bufferData);
      }

      await downloadFont(jsonData);

      canvasRef.handler.renderHandler.loadJson(jsonData);
      setLoadingPSD(false);

      setShowImportFileModal(false);
    };

    reader.onerror = () => {
      message.error('解析失败，请重试！');
    };
  };

  const downloadFont = async (jsonData: IJsonData) => {
    const loadFont: IFont[] = [];
    for (const item of jsonData.objects) {
      if (item.type === 'textbox') {
        const fontData = fontList.find((font) => font.name === item.fontFamily);
        const has = loadFont.find((data) => data.name === item.fontFamily);
        if (fontData && !has) {
          await canvasRef.handler.commonHandler.loadFontAsync(fontData.name, fontData.woffUrl);
          loadFont.push(fontData);
        }
      }
    }

    setTemplateFontData({ canvasRef, setTemplateFont, json: jsonData.objects });
  };

  const onClickMenuItem = (key: string) => {
    if (key === '1') {
      setShowImportFileModal(true);
    }

    if (key === '2') {
      const setValue = !selectRuler;
      if (setValue) {
        canvasRef.handler.rulerHandler.showRuler();
      } else {
        canvasRef.handler.rulerHandler.clearRuler();
      }

      setSelectRuler(setValue);
    }

    if (key === '3') {
      const setValue = !selectGuideline;
      if (!setValue) {
        canvasRef.handler.rulerHandler.clearAlignLines();
      }

      setSelectGuideline(setValue);
    }
  };

  const importFigmaFile = async () => {
    if (!figmaUserToken || !figmaFileId) {
      message.error('缺少token或文件id');
    }

    setLoadingFigma(true);
    setFigmaButtonText('导入数据中');

    const jsonData = await canvasRef.handler.parseFigmaHandler.parseFigmaAsync(figmaFileId, figmaUserToken);
    canvasRef.handler.renderHandler.loadJson(jsonData);

    setLoadingFigma(false);
    setFigmaButtonText('开始导入');
    setShowImportFileModal(false);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      onClick: (e) => {
        onClickMenuItem(e.key);
      },
      label: <span className="global-second-title file-item">导入文件</span>
    },
    {
      key: '2',
      onClick: (e) => {
        onClickMenuItem(e.key);
      },
      label: (
        <span className="menu-item-box">
          <span className="global-second-title file-item" style={{ color: selectRuler ? '#2254f4' : '#33383e' }}>
            显示标尺
          </span>
          {selectRuler && <Check theme="filled" size="20" fill={'#2254f4'} strokeWidth={3} />}
        </span>
      )
    },
    {
      key: '3',
      onClick: (e) => {
        onClickMenuItem(e.key);
      },
      label: (
        <span className="menu-item-box">
          <span className="global-second-title file-item" style={{ color: selectGuideline ? '#2254f4' : '#33383e' }}>
            显示参考线
          </span>
          {selectGuideline && <Check theme="filled" size="20" fill={'#2254f4'} strokeWidth={3} />}
        </span>
      )
    }
  ];

  return (
    <>
      <Dropdown trigger={['click']} menu={{ items }} overlayStyle={{ width: '200px', padding: '10px 0' }}>
        <div className="global-common-title file-title">文件</div>
      </Dropdown>

      <Modal
        title="导入文件"
        open={showImportFileModal}
        footer={null}
        width={700}
        style={{ top: '150px' }}
        onCancel={() => {
          setShowImportFileModal(false);
        }}
      >
        <div className="head-file-import-wrapper">
          {loadingPSD && (
            <div className="spin-box">
              <Spin size="large" />
              <div className="text global-common-title1">正在解析文件...</div>
            </div>
          )}

          <Upload.Dragger {...draggerProps}>
            {!loadingPSD && (
              <>
                <div className="icon-list">
                  <img src="https://cdn.dancf.com/editor/editor-design/prod/svg/icon_psdimport.37e6f23e.svg" alt="" />
                  <img
                    src="https://cdn.dancf.com/editor/editor-design/prod/svg/icon_sketchimport.cd951cf1.svg"
                    alt=""
                  />
                </div>
                <div className="global-common-tips">将文件拖拽到此处，或者选择文件</div>
              </>
            )}
          </Upload.Dragger>
        </div>
        <div className="head-file-import-figma-wrapper">
          <div className="title-box">
            <div className="title global-common-title">导入Figma</div>
          </div>

          <div className="import-figma-box global-common-bg-color">
            <div className="icon-box">
              <img
                src="https://www.figma.cool/_next/static/image/assets/homepage/y.a77132b51685475ccb2128eb3f15d967.svg"
                alt=""
              />
            </div>

            <div className="get-id-box">
              <Input
                placeholder="请填写您个人Token"
                value={figmaUserToken}
                style={{ width: '300px', borderRadius: '4px', marginBottom: '15px' }}
                onChange={(event) => {
                  setFigmaUserToken(event.target.value);
                }}
              />
              <Input
                placeholder="请填写Figma文件ID"
                value={figmaFileId}
                style={{ width: '300px', borderRadius: '4px' }}
                onChange={(event) => {
                  setFigmaFileId(event.target.value);
                }}
              />
            </div>
            <Button
              style={{ width: 140 }}
              loading={loadingFigma}
              type="primary"
              className="import-btn"
              onClick={() => {
                importFigmaFile();
              }}
            >
              {figmaButtonText}
            </Button>
          </div>
          <div className="tips-box">
            <Tooltip
              overlayInnerStyle={{ width: '300px' }}
              title={
                <span>
                  1.登录您的Figma帐户。
                  <br />
                  2.从Figma的左上角菜单进入账户设置。
                  <br />
                  3.查找个人访问令牌部分。
                  <br />
                  4.单击创建新令牌。
                  <br />
                  5.将生成令牌。
                  <br />
                  这将是您复制令牌的唯一机会，因此请确保将其副本保存在安全的地方。
                </span>
              }
            >
              <span className="global-common-tips1 import-tips">如何获取个人Token？</span>
            </Tooltip>
            <Tooltip
              overlayInnerStyle={{ width: '500px' }}
              title={
                <span>
                  1.在Figma中打开需要导入文件。
                  <br />
                  2.在浏览器地址中可以看到www.figma.com/file开头的地址。
                  <br />
                  3.复制file/后面的字符串。
                  <br />
                  4.例如：www.figma.com/file/EI11Dm8bOW0OaXB80180/我是测试文件。
                  <br />
                  5.那么得到的Figma文件ID就是：EI11Dm8bOW0OaXB80180。
                  <br />
                </span>
              }
            >
              <span className="global-common-tips1 import-tips">如何获取Figma的文件ID？</span>
            </Tooltip>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default File;
