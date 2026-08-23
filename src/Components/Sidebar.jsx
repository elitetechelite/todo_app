import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import close_sidebar_icon from "../assets/icons/close_sidebar.png";
import todos_icon from "../assets/icons/todos.png";
import budget_icon from "../assets/icons/budget.png";
import tasks_icon from "../assets/icons/tasks.png";
import "./comp_tyles/sidebar.css";
import { useState } from "react";

export default function Sidebar() {
  const [card, setCard] = useState("todos");
  // const [cardLocation, setCardLocation]=useState
  const navigate = useNavigate();
  function closeSideBarDv() {
    let sidebar_dv = document.querySelector(".sidebar-dv");
    sidebar_dv.style.width = "0%";
  }

  function changeCardFunc(e) {
    // console.log(e.target);
    closeSideBarDv();
  }

  function handleLogOut() {
    navigate("/login");
  }

  return (
    // <BrowserRouter>
    <div className="sidebar-dv">
      <div className="sidebar">
        <div className="head">
          <img
            className="icon"
            onClick={closeSideBarDv}
            src={close_sidebar_icon}
            alt=""
          />
        </div>
        <div className="bdy">
          {/* <BrowserRouter> */}
          <div className="tabs">
            <nav>
              <Link to="/home/todos?pagename=Todos">
                <div className="tab" value="todos" onClick={changeCardFunc}>
                  <img src={todos_icon} alt="" />
                  <span value="KK">Todos</span>
                </div>
              </Link>
              <Link to="/home/tasks?pagename=tasks">
                <div className="tab" value="tasks" onClick={changeCardFunc}>
                  <img src={tasks_icon} alt="" />
                  <span>Task List</span>
                </div>
              </Link>
              <Link to="/home/budget?pagename=budget">
                <div className="tab" value="budget" onClick={changeCardFunc}>
                  <img src={budget_icon} alt="" />
                  <span>Budget</span>
                </div>
              </Link>
            </nav>
          </div>
          <button className="logout-btn" onClick={handleLogOut}>Logout</button>
          {/* </BrowserRouter> */}
        </div>
      </div>
      <div className="sidebar_empty" onClick={closeSideBarDv}></div>
    </div>
    // </BrowserRouter>
  );
}
