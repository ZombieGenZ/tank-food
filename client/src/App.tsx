// import { useCallback, useRef } from "react";
import FormMain from "./views/pages/main.pages";
// import { useWindowScroll } from "@mantine/hooks";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Transition } from "@mantine/core";
import OrderAtStore from "./views/pages/OrderAtStore.pages";
import ResultVerifyAccount from "./views/pages/ResultVerifyAccount.pages";

const App = () => {
  // const [scroll, scrollTo] = useWindowScroll();
  // const isMountedRef = useRef(false);

  // // Sử dụng useCallback để tránh tạo lại hàm mỗi lần render
  // const handleScrollTop = useCallback(() => {
  //   if (!isMountedRef.current) return;
  //   scrollTo({ y: 0 });
  // }, [scrollTo]);

  // // Đánh dấu khi component mount để tránh lỗi khi gọi scrollTo sớm
  // isMountedRef.current = true;

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<FormMain />} />
          <Route path="/orderatstore" element={<OrderAtStore />} />
          <Route path="/resultverifyaccount" element={<ResultVerifyAccount />} />
        </Routes>
      </BrowserRouter>

      {/* Nút cuộn lên trên chỉ hiển thị khi cuộn xuống hơn 500px */}
      {/* <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => (
          <button
            onClick={handleScrollTop}
            style={transitionStyles}
            className="fixed bottom-8 cursor-pointer right-8 p-4 rounded-md bg-orange-500 text-white shadow-lg transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400 border-2 border-orange-400 hover:-translate-y-2 hover:bg-orange-400 hover:shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </Transition> */}
    </div>
  );
};

export default App;
