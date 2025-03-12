import FormMain from "./views/pages/main.pages";
import { useWindowScroll } from '@mantine/hooks';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [scroll, scrollTo] = useWindowScroll();
  console.log(scroll.y)

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<FormMain />} />
        </Routes>
      </BrowserRouter>
      <button onClick={() => scrollTo({ y: 0})}
              className="fixed bottom-5 right-5">Trở về đầu trang</button>
    </div>
  );
};

export default App
