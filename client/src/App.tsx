import FormMain from "./views/pages/main.pages"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<FormMain />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App
