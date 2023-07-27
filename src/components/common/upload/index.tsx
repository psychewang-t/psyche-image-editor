import './index.less';
import { Button, Upload, UploadProps } from 'antd';

interface IProps {
  name: string;
  uploadCallback: (url: string, file: File) => void;
}

const UploadImage = ({ name, uploadCallback }: IProps) => {
  const props: UploadProps = {
    name: 'file',
    accept: 'image/*',
    headers: {
      authorization: 'authorization-text'
    },
    showUploadList: false,
    beforeUpload(file) {
      const url = URL.createObjectURL(file);
      uploadCallback(url, file);

      return false;
    }
  };

  return (
    <div className="common-image-upload">
      <Upload {...props}>
        <Button type="default" block>
          {name}
        </Button>
      </Upload>
    </div>
  );
};

export default UploadImage;
