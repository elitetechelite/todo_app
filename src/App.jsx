import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Sidebar from "./Components/Sidebar";
import { Register } from "./Pages/Register";
import { Login } from "./Pages/Login";
import Todos from "./Components/Todos";
import Tasks from "./Components/Tasks";
import Budget from "./Components/Budget";
import open_sidebar_icon from "./assets/icons/open_sidebar.png";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  function openSidebar() {
    let sideBar = document.querySelector(".sidebar-dv");
    sideBar.style.width = "100%";
  }

  useEffect(() => {
    if (location.pathname == "") {
      // location.href = "/home/todos";
      navigate("/home/todos");
    }
  }, []);

  return (
    <main>
      <div className="head-section">
        <div className="menue-area">
          <img
            className="side-bar-icons icon"
            onClick={openSidebar}
            src={open_sidebar_icon}
            alt=""
          />
          <span>{searchParams.get("pagename")}</span>
        </div>
      </div>
      <div className="body-section">
        <Sidebar />

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Todos />} />
          <Route path="/home">
            <Route path="todos" element={<Todos />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="budget" element={<Budget />} />
          </Route>
          <Route path="*" element={<h1>404 Page not found ...</h1>} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
