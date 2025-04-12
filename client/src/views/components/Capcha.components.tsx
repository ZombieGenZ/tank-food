import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

const TurnstileCaptcha: React.FC<TurnstileCaptchaProps> = ({ siteKey, onVerify }) => {
  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onVerify} // Gọi hàm callback khi CAPTCHA được xác minh thành công
      options={{
        theme: 'dark', // Tùy chọn theme: 'light', 'dark', hoặc 'auto'
        size: 'normal', // Kích thước: 'normal' hoặc 'compact'
      }}
    />
  );
};

export default TurnstileCaptcha;