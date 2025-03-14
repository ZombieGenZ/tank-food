import FormMain from "./views/pages/main.pages";
import { useWindowScroll } from '@mantine/hooks';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Transition } from '@mantine/core';

const App = () => {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<FormMain />} />
        </Routes>
      </BrowserRouter>
      <Transition transition="slide-up" mounted={scroll.y > 100}>
          {(transitionStyles) => (
            <button 
            onClick={() => scrollTo({ y: 0 })}
            style={transitionStyles}
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Trở về đầu trang</span>
          </button>
          )}
        </Transition>
    </div>
  );
};

export default App;
