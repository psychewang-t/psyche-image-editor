import crypto from 'crypto-js';
import tcb from '@cloudbase/js-sdk';

// base64转为file
export const base64ToFileAsync = (base64String: string, fileName: string, mimeType: string) =>
  new Promise<File>((resolve) => {
    fetch(base64String)
      .then((res) => res.blob())
      .then((blob) => {
        // 创建一个新的File对象
        const file = new File([blob], fileName, { type: mimeType });

        // 现在你可以使用这个File对象了
        resolve(file);
      });
  });

// 判断字符串是不是base64
export const isBase64String = (str: string) => str.startsWith('data:image/');

// 判断字符串是不是url
export const isURLString = (str: string) => {
  const urlRegex = /^(?:https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\w.-]*)*\/?$/;

  return urlRegex.test(str);
};

// 获取base64图片的类型
export const getBase64ImageType = (base64String: string) => {
  const matches = base64String.match(/^data:image\/([a-zA-Z+]+);base64,/);
  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
};

// 上传的图片路径规划
const uploadFilePath: { [key: string]: string } = {
  // 抠图上传的图片
  cutoutUpload: 'cutout/upload'
};

// 上传图片
export const base64ToUrlAsync = async (base64String: string, uploadType: string) => {
  const type = getBase64ImageType(base64String) || 'png';
  const message = crypto.enc.Base64.parse(base64String);
  const hash = crypto.MD5(message).toString();
  const fileName = `${hash}.${type}`;
  const mimeType = `image/${type}`;
  const file = await base64ToFileAsync(base64String, fileName, mimeType);

  const loginRes = await login();

  if (!loginRes) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = (await uploadFile(`${uploadFilePath[uploadType]}/${fileName}`, file)) as any;

  if (res?.download_url) {
    return res.download_url;
  }

  return false;
};

// 匿名登录腾讯云
const login = async () => {
  const app = tcb.init({
    env: 'image-editor-demo-1ex4iya7dd3fb3',
    region: 'ap-guangzhou'
  });
  const auth = app.auth({
    persistence: 'local'
  });
  await auth.anonymousAuthProvider().signIn();
  // 匿名登录成功后，登录状态isAnonymous字段值为true
  const loginState = await auth.getLoginState();

  return loginState.isAnonymousAuth;
};

// 腾讯云存储文件
const uploadFile = async (path: string, file: File) =>
  new Promise<tcb.storage.ICloudbaseUploadFileResult>((resolve) => {
    const app = tcb.init({
      env: 'image-editor-demo-1ex4iya7dd3fb3',
      region: 'ap-guangzhou'
    });

    app
      .uploadFile({
        cloudPath: path,
        filePath: file as unknown as string
      })
      .then((res) => {
        // 返回文件 ID
        resolve(res);
      });
  });
