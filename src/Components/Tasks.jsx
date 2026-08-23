import { useEffect, useState } from "react";
import { loginCheck } from "../Pages/Login";
import close_icon from "../assets/icons/close_sidebar.png";
import { genrateClientID, generateDateTime } from "../Pages/Register";
import "./card_routes.css";
import delete_icon from "../assets/icons/delete.png";

function openInputsCard() {
  let item_actns_pop = document.querySelector(".item_actns_pop");
  item_actns_pop.style.display = "none";
  let add_item_pop = document.querySelector(".add_item_pop");
  add_item_pop.style.display = "flex";
  openPopUp();
}
function openPopUp() {
  let pop_ups = document.querySelector(".pop_ups");
  pop_ups.style.display = "flex";
}
function closePopUp() {
  let pop_ups = document.querySelector(".pop_ups");
  pop_ups.style.display = "none";
}

export default function Tasks() {
  const [task_obj, setTask_Obj] = useState({
    task_id: "",
    task_name: "",
    task_cost: "",
    task_status: "",
    task_meta_data: {
      creation_time: "",
      creation_date: "",
    },
  });
  const [clients_content, setClients_Content] = useState(
    JSON.parse(localStorage.getItem("clients_content")) || [],
  );
  const [personal_content, setPersonal_Content] = useState({
    total_tasks: "",
    tasks: {},
  });
  const [client_data, setClient_Data] = useState("");
  const [logged_in_user_dets, setLogged_In_User_Dets] = useState(
    JSON.parse(localStorage.getItem("login_meta_data")),
  );
  const [task_avail, setTasks_Avail] = useState(
    clients_content.map(
      (client) =>
        client.client_id == logged_in_user_dets.loggedin_client &&
        client.client_data[1].content,
    ),
  );
  const [active_task_data, setActive_Task_Data] = useState({
    task_doc_index: "",
    task_doc_id: "",
    task_doc_name: "",
    task_doc_do_date: "",
  });
  const [task_save_flag, setTask_Save_Flag] = useState("add_task");

  function handleSearch(e) {
    console.log("SEARCH RESULTS2: ", e.target.value);
  }

  function changeItemStatus(e) {
    let index = e.target.className.split(" ")[1].split("_")[0];

    clients_content.forEach((client) => {
      if (client.client_id == my_client_id) {
        setPersonal_Content(client);
        setClient_Data(client.client_data);
      } else {
        // console.log("No Client Data ");
      }
    });
    setClient_Data([
      ...client_data,
      client_data[1].content[index].task_status == "pending"
        ? (client_data[1].content[index].task_status = "completed")
        : (client_data[1].content[index].task_status = "pending"),
    ]);
    setPersonal_Content({ ...personal_content, client_data: client_data });
    localStorage.setItem("clients_content", JSON.stringify(clients_content));
  }

  let my_client_id = "";
  let logged_user = JSON.parse(localStorage.getItem("login_meta_data")) || "";

  useEffect(() => {
    clients_content.forEach((client) => {
      if (client.client_id == my_client_id) {
        setPersonal_Content(client);
        setClient_Data(client.client_data);
      } else {
      }
    });

    if (logged_user !== "") {
      my_client_id = logged_user.loggedin_client;
    } else {
      console.log("Noo client id found LS");
    }
    loginCheck();
  }, []);

  //handle todo creation

  function handleNameTextInp(e) {
    let { name, value } = e.target;
    setTask_Obj({
      ...task_obj,
      task_id: `task_${genrateClientID()}`,
      [name]: value,
      task_status: "pending",
      task_meta_data: {
        creation_time: generateDateTime().C_TIME,
        creation_date: generateDateTime().C_DATE,
      },
    });
  }
  function handleTaskCreation() {
    if (task_obj.task_name !== "") {
      if (task_save_flag == "add_task") {
        clients_content.forEach((client) => {
          if (client.client_id == my_client_id) {
            setPersonal_Content(client);
            setClient_Data(client.client_data);
          } else {
            console.log("No Client Data ");
          }
        });

        setClient_Data([...client_data, client_data[1].content.push(task_obj)]);
        setPersonal_Content({ ...personal_content, client_data: client_data });
        localStorage.setItem(
          "clients_content",
          JSON.stringify(clients_content),
        );

        console.log("PERSONAL C: ", personal_content);
        console.log("All Clients: ", clients_content);
      } else if (task_save_flag == "edit_task") {
        let { task_doc_index } = active_task_data;
        let Task_name = task_obj.task_name;
        let Task_cost = task_obj.task_cost;

        clients_content.forEach((client) => {
          if (client.client_id == my_client_id) {
            setPersonal_Content(client);
            setClient_Data(client.client_data);
          } else {
            // console.log("No Client Data ");
          }
        });
        console.log("NAMMM: ", Task_name, "IDEXXX: ", task_doc_index);
        setClient_Data([
          ...client_data,
          ((client_data[1].content[task_doc_index].task_name = Task_name),
          (client_data[1].content[task_doc_index].task_cost = Task_cost)),
        ]);

        setPersonal_Content({ ...personal_content, client_data: client_data });

        localStorage.setItem(
          "clients_content",
          JSON.stringify(clients_content),
        );
      } else if (task_save_flag == "delete_task") {
        console.log("Save Task Flage = Deleting Task: ", task_save_flag);
      } else {
        console.log("Save Task Flage = Unknow");
      }

      closePopUp();
    } else {
      console.log("The field cannot be empty!");
    }
  }

  function addTaskBtn() {
    setTask_Save_Flag("add_task");
    openInputsCard();
    console.log("Adding task");
  }
  function clrInputs() {
    setTask_Obj({ ...task_obj, task_name: "", task_cost: "" });
  }

  // Handle Edit Task
  function handleEditTask() {
    setTask_Save_Flag("edit_task");
    // console.log("FLAG: ", task_save_flag);
    // console.log(
    //   ` todo index: ${active_task_data.task_doc_index} id: ${active_task_data.task_doc_id}`,
    // );
    setTask_Obj({
      ...task_obj,
      task_name: active_task_data.task_doc_name,
      task_cost: active_task_data.task_doc_cost,
    });
    openInputsCard();
  }
  function handleDeleteTask() {
    setTask_Save_Flag("delete_task");
    let { task_doc_index } = active_task_data;
    clients_content.forEach((client) => {
      if (client.client_id == my_client_id) {
        setPersonal_Content(client);
        setClient_Data(client.client_data);
      } else {
        // console.log("No Client Data ");
      }
    });
    setClient_Data([
      ...client_data,
      client_data[1].content.splice(task_doc_index, 1),
    ]);
    setPersonal_Content({ ...personal_content, client_data: client_data });
    localStorage.setItem("clients_content", JSON.stringify(clients_content));

    closePopUp();
  }
  function deleteTaskBtn(e) {
    handleDeleteTask();
  }

  function openPopUp() {
    let pop_ups = document.querySelector(".pop_ups");
    pop_ups.style.display = "flex";
  }
  function closePopUp() {
    let pop_ups = document.querySelector(".pop_ups");
    pop_ups.style.display = "none";
    clrInputs();
  }

  // Handle Long Press

  let pressTimer;
  function handleLongPressForCard(e) {
    pressTimer = setTimeout(() => {
      let add_item_pop = document.querySelector(".add_item_pop");
      add_item_pop.style.display = "none";
      let item_actns_pop = document.querySelector(".item_actns_pop");
      item_actns_pop.style.display = "flex";

      let TaskName = e.target.className.split(" ");
      setActive_Task_Data({
        ...active_task_data,
        task_doc_index: e.target.className.split(" ")[1].split("_")[0],
        task_doc_id: e.target.className.split(" ")[1],
        task_doc_name: TaskName.slice(2, TaskName.length - 1).join(" "),
        task_doc_cost: e.target.className.split(" ")[3],
      });

      openPopUp();
    }, 250);
  }
  function handleDoublickForCard(event) {
    handleLongPressForCard(event);
  }
  function handleLeavePressForCard() {
    clearTimeout(pressTimer);
  }

  return (
    <div className="tasks-dv">
      <div className="first">
        <div className="search-input">
          <input type="text" onChange={handleSearch} placeholder="Task" />
        </div>
        <button onClick={addTaskBtn}>Add Task</button>
      </div>
      <div className="second">
        <div className="todo-cards">
          {task_avail[0].length != 0 ? (
            task_avail[0].map((task, i) => (
              <div
                key={`${i}_${task.task_id}`}
                className={`card ${i}_${task.task_id} ${task.task_name} ${task.task_cost}`}
                onMouseDown={handleLongPressForCard}
                onDoubleClick={handleDoublickForCard}
                onMouseLeave={handleLeavePressForCard}
                onMouseUp={handleLeavePressForCard}
              >
                <div
                  className={`data ${i}_${task.task_id} ${task.task_name} ${task.task_cost}`}
                >
                  <span
                    className={`task_name_sp ${i}_${task.task_id} ${task.task_name} ${task.task_cost}`}
                  >
                    {task.task_name}
                  </span>
                  <span
                    className={`task_c_date_sp ${i}_${task.task_id} ${task.task_name} ${task.task_cost}`}
                  >
                    {task.task_meta_data.creation_date}
                  </span>
                </div>
                <div
                  className={`actns ${i}_${task.task_id} ${task.task_name} ${task.task_cost}`}
                >
                  <img
                    className={`delete_img ${i}_${task.task_id} ${task.task_name} ${task.task_cost}`}
                    onClick={deleteTaskBtn}
                    src={delete_icon}
                    alt=""
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="no_content">
              <span>There are no Tasks Yet </span>
              <span>
                Press <b onClick={addTaskBtn}>Add Task</b> to add new Task{" "}
              </span>
            </div>
          )}

          {/* <div className="card">
            <div className="data">
              <span>Task 1</span>
              <span>Created on:08-06-2026</span>
            </div>
            <div className="actns">
              <img onClick={deleteTaskBtn} src={delete_icon} alt="" />
            </div>
          </div> */}
        </div>
      </div>
      <div className="pop_ups">
        <div className="add_item_pop">
          <div className="head">
            <img src={close_icon} alt="" onClick={closePopUp} />
          </div>
          <input
            type="text"
            name="task_name"
            value={task_obj.task_name}
            onChange={handleNameTextInp}
            placeholder="Task Name"
          />
          {/* <input
            type="text"
            name="task_cost"
            value={task_obj.task_cost}
            onChange={handleNameTextInp}
            placeholder="Task Cost"
          /> */}
          <button onClick={handleTaskCreation}>
            {task_save_flag == "add_task" ? "Save" : "Update"}
          </button>
        </div>
        <div className="item_actns_pop">
          <div className="head">
            <img src={close_icon} alt="" onClick={closePopUp} />
          </div>
          <button onClick={handleEditTask}>Edit Task</button>
          <button onClick={handleDeleteTask}>Delete Task</button>
        </div>
      </div>
    </div>
  );
}
