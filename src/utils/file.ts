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
  cutoutUpload: 'cutout/upload',
  // 修复图片的遮罩上传的图片
  restoreMaskUpload: 'restore/mask/upload',
  // 修复图片的上传图片
  restoreUpload: 'restore/upload',
  // 重绘图片的遮罩上传的图片
  inpaintedMaskUpload: 'inpainted/mask/upload',
  // 重绘图片的上传图片
  inpaintedUpload: 'inpainted/upload'
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

// 通过url判断图片的类型
const getImgTypeFromUrl = (url: string) => {
  const extension = url.match(/\.([^.?#]+)(?:[?#]|$)/);

  if (extension) {
    const extensionRes = extension[1].toLowerCase();

    if (extensionRes === 'jpg') {
      return 'jpg';
    }

    if (extensionRes === 'jpeg') {
      return 'jpeg';
    }

    if (extensionRes === 'png') {
      return 'png';
    }

    if (extensionRes === 'gif') {
      return 'gif';
    }

    if (extensionRes === 'bmp') {
      return 'bmp';
    }
  }

  return 'Unknown';
};

// 通过base64判断图片的类型
const getImageTypeFromBase64 = (base64: string) => {
  const defaultPosition = 30;
  const header = base64.substring(0, defaultPosition);

  if (header.includes('data:image/jpeg')) {
    return 'jpeg';
  }

  if (header.includes('data:image/png')) {
    return 'png';
  }

  if (header.includes('data:image/gif')) {
    return 'gif';
  }

  if (header.includes('data:image/bmp')) {
    return 'bmp';
  }

  return 'Unknown';
};

// 判断图片是否有空的像素点
// const hasTransparentPixels = (imgUrl: string) => {
//   const img = new Image();
//   img.crossOrigin = 'Anonymous';
//   img.src = imgUrl;

//   return new Promise<boolean>((resolve) => {
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);

//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       let hasTransparent = false;
//       const judge = 4;
//       const position = 3;
//       const colorDefault = 255;
//       for (let i = 0; i < data.length; i += judge) {
//         if (data[i + position] < colorDefault) {
//           hasTransparent = true;
//           break;
//         }
//       }

//       resolve(hasTransparent);
//     };

//     img.onerror = () => {
//       console.error('Error loading image');
//     };
//   });
// };

// png图片转为jpg
const convertPngToJpg = (pngUrl: string, quality: number = 1) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous'; // 如果图片跨域，需要设置这个属性
  img.src = pngUrl;

  return new Promise<string>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white'; // 设置背景颜色为白色，因为 JPG 不支持透明度
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      console.error('Error loading image');
    };
  });
};

// file转arrBuffer
export const fileToArrayBuffer = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });

// 获取当前URL的类型
const getUrlType = (data: string) => {
  if (isURLString(data)) {
    return getImgTypeFromUrl(data);
  }

  if (isBase64String(data)) {
    return getImageTypeFromBase64(data);
  }
};

// 给定的图片数据转为url，图片类型是jpg
export const getImgUrl = async (data: string, type: string) => {
  const imgType = getUrlType(data);
  if (imgType === 'png') {
    // png图片需要转为jpg
    const newImgBase64 = await convertPngToJpg(data);
    const newImgUrl = await base64ToUrlAsync(newImgBase64, `${type}Upload`);

    return newImgUrl;
  }

  if (isURLString(data)) {
    return data;
  }

  if (isBase64String(data)) {
    const objUrl = await base64ToUrlAsync(data, `${type}Upload`);

    return objUrl;
  }
};
