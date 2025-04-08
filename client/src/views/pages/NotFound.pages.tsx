import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage ? JSON.parse(savedLanguage) : "Tiếng Việt";
  });
  
  useEffect(() => {
    setLanguage(language);
  }, [language]);
  return (
    <section className="bg-white font-arvo py-10">
      <div className="container mx-auto">
        <div className="row">
          <div className="col-span-12">
            <div className="mx-auto col-span-10 text-center">
              <div className="bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] h-[400px] bg-center bg-no-repeat">
                <h1 className="text-center text-[80px]">404</h1>
              </div>

              <div className="mt-[-50px]">
                <h3 className="h2 text-[50px]">
                  {language == "Tiếng Việt" ? "Có vẻ như bạn đã bị mất kết nối" : "Seem like you're lost"}
                </h3>
                <p>{language == "Tiếng Việt" ? "Trang bạn tìm kiếm không tồn tại !" : "A page you're looking for is not available"}</p>
                <a onClick={() => navigate('/')} className="inline-block cursor-pointer text-white py-2 px-5 bg-green-500 mt-5 no-underline hover:bg-green-600 focus:ring focus:ring-green-300">
                  {language == "Tiếng Việt" ? "Về trang chủ" : "Back to home"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;