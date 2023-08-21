import axios from 'axios';
import './axios';

const url = 'https://image-editor-demo-1ex4iya7dd3fb3-1257477541.ap-guangzhou.app.tcloudbase.com';

// 文生图接口
interface IText2ImgData {
  prompt: string;
  width: number;
  height: number;
}
export async function text2img(data: IText2ImgData) {
  const axiosData = await axios.post(`${url}/text2img`, data);

  return axiosData.data;
}

// 抠图接口
export async function cutout(data: { image: string }) {
  const axiosData = await axios.post(`${url}/cutout`, data);

  return axiosData.data;
}
