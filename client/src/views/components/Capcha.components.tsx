// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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