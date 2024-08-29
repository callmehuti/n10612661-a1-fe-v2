// packages
import { Routes, Route } from "react-router-dom";

// components
import Register from "./pages/Register";
import Login from "./pages/Login";
import Authentication from "./middleware/Authentication";
import Home from "./pages/Home";
import DownloadTranscode from "./pages/DownloadTranscode";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound";

// style
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />} />
        <Route element={<Authentication />}>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/download-transcode"
            element={<DownloadTranscode />}
          ></Route>
          <Route path="/upload" element={<Upload />}></Route>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}

// :id

export default App;
