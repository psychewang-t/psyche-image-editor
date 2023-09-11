import axios from 'axios';
import './axios';

const url = 'https://image-editor-demo-1ex4iya7dd3fb3-1257477541.ap-guangzhou.app.tcloudbase.com';

// AI获取任务结果
export async function getAITaskResult(taskId: string) {
  const loopNumber = 20;
  const awaitTime = 3000;
  for (let i = 0; i < loopNumber; i++) {
    await delay(awaitTime);
    const res = await axios.post(`${url}/getAITaskResult`, { taskId });
    if (res?.data?.status === 'succeeded') {
      return res?.data.output;
    }
  }

  return true;
}

// 等待执行函数
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
