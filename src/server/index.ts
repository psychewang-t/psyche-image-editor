import axios from 'axios';
import './axios';

const url = 'https://image-editor-demo-1ex4iya7dd3fb3-1257477541.ap-guangzhou.app.tcloudbase.com';

// 获取AI任务结果
export async function getAITaskResult(taskId: string) {
  const axiosData = await axios.post(`${url}/getAITaskResult`, { taskId });

  return axiosData.data;
}

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

// 修复接口
export async function restore(data: { image: string; mask: string }) {
  const axiosData = await axios.post(`${url}/restore`, data);

  return axiosData.data;
}

// 重绘接口
export async function inpainted(data: { prompt: string; image: string; mask: string }) {
  const axiosData = await axios.post(`${url}/inpainted`, data);

  return axiosData.data;
}
