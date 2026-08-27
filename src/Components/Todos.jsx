import { useEffect, useState } from "react";
import "./card_routes.css";
import { loginCheck } from "../Pages/Login";
import close_icon from "../assets/icons/close_sidebar.png";
import status_completed from "../assets/icons/tick.png";
import { genrateClientID, generateDateTime } from "../Pages/Register";

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

export default function Todos() {
  // Hooks
  const [todo_obj, setTodo_Obj] = useState({
    todo_id: "",
    todo_name: "",
    todo_do_date: "",
    todo_status: "",
    todo_meta_data: {
      creation_time: "",
      creation_date: "",
    },
  });
  const [clients_content, setClients_Content] = useState(
    JSON.parse(localStorage.getItem("clients_content")) || [],
  );
  const [personal_content, setPersonal_Content] = useState({
    total_todos: "",
    todos: {},
  });
  const [client_data, setClient_Data] = useState("");
  const [logged_in_user_dets, setLogged_In_User_Dets] = useState(
    JSON.parse(localStorage.getItem("login_meta_data")),
  );
  const [todos_avail, setTodos_Avail] = useState(
    clients_content.map(
      (client) =>
        client.client_id == logged_in_user_dets.loggedin_client &&
        client.client_data[0].content,
    ),
  );
  const [active_todo_data, setActive_Todo_Data] = useState({
    todo_doc_index: "",
    todo_doc_id: "",
    todo_doc_name: "",
    todo_doc_do_date: "",
  });
  const [todo_save_flag, setTodo_Save_Flag] = useState("add_todo");

  // Functionality

  function changeTodoStatus(e) {
    let index = e.target.className.split(" ")[1].split("_")[0];
    console.log("Button clicked");

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
      client_data[0].content[index].todo_status == "pending"
        ? (client_data[0].content[index].todo_status = "completed")
        : (client_data[0].content[index].todo_status = "pending"),
    ]);
    setPersonal_Content({ ...personal_content, client_data: client_data });
    localStorage.setItem("clients_content", JSON.stringify(clients_content));
  }

  let my_client_id = "";
  let logged_user = JSON.parse(localStorage.getItem("login_meta_data")) || "";
  function getData() {
    let user_data = { todos: [], total_todos: 0 };
    // let user_total_todos = 0;
    clients_content.forEach((client) => {
      if (client.client_id == my_client_id) {
        console.log(client);
        user_data.total_todos = client.total_todos;
        // setPersonal_Content({ ...personal_content, total_todos: 10 });
        client.client_data.forEach((data) => {
          if (data.doc_name == "todos") {
            user_data.todos = data;
            // setPersonal_Content({ ...personal_content, todos: data });
          }
        });
        console.log(personal_content);
      } else {
        console.log("No Client Data ");
      }
      return user_data;
    });
  }
  useEffect(() => {
    clients_content.forEach((client) => {
      if (client.client_id == my_client_id) {
        setPersonal_Content(client);
        setClient_Data(client.client_data);
        // user_data.total_todos = client.total_todos;
        // setPersonal_Content({ ...personal_content, total_todos: 10 });
        client.client_data.forEach((data) => {
          if (data.doc_name == "todos") {
            // user_data.todos = data;
            // setPersonal_Content({ ...personal_content, todos: data });
          }
        });
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
    setTodo_Obj({
      ...todo_obj,
      todo_id: `todo_${genrateClientID()}`,
      [name]: value,
      todo_status: "pending",
      todo_meta_data: {
        creation_time: generateDateTime().C_TIME,
        creation_date: generateDateTime().C_DATE,
      },
    });
  }
  function handleTodoCreation() {
    if (todo_obj.todo_name !== "" && todo_obj.todo_do_date !== "") {
      if (todo_save_flag == "add_todo") {
        clients_content.forEach((client) => {
          if (client.client_id == my_client_id) {
            setPersonal_Content(client);
            setClient_Data(client.client_data);
          } else {
            // console.log("No Client Data ");
          }
        });
        clients_content.forEach((client,i) => {
          if (client.client_id == my_client_id) {
            console.log("CLient DataCo: ", personal_content);
            
          } else {
            console.log("CLient DataCo: NULLL");
            
          }
        })
        // setClients_Content(()=>{})


        setClient_Data([
          ...client_data,
          client_data[0]?.content.push(todo_obj),
        ]);
        setPersonal_Content({ ...personal_content, client_data: client_data });
        localStorage.setItem(
          "clients_content",
          JSON.stringify(clients_content),
        );

        // const updatedClientData = [...client_data];
        // if (updatedClientData[0]) {
        //   updatedClientData[0] = {
        //     ...updatedClientData[0],
        //     content: [...(updatedClientData[0].concat || []), todo_obj],
        //   };

        //   const updatedPersonalContent = {
        //     ...personal_content,
        //     client_data: updatedClientData,
        //   };

        //   setClient_Data(updatedClientData);
        //   setPersonal_Content(updatedPersonalContent);

        //   localStorage.setItem(
        //     "clients_content",
        //     JSON.stringify(updatedPersonalContent),
        //   );
        // } else {
        //   console.log("Noooooooooo");
        // }

        // console.log("PERSONAL C: ", personal_content);
        // console.log("All Clients: ", clients_content);
      } else if (todo_save_flag == "edit_todo") {
        let { todo_doc_index } = active_todo_data;
        let Todo_name = todo_obj.todo_name;
        let Todo_date = todo_obj.todo_do_date;

        clients_content.forEach((client) => {
          if (client.client_id == my_client_id) {
            setPersonal_Content(client);
            setClient_Data(client.client_data);
          } else {
            // console.log("No Client Data ");
          }
        });
        // console.log("NAMMM: ", Todo_name, "IDEXXX: ", todo_doc_index);
        setClient_Data([
          ...client_data,
          ((client_data[0].content[todo_doc_index].todo_name = Todo_name),
          (client_data[0].content[todo_doc_index].todo_do_date = Todo_date)),
        ]);

        setPersonal_Content({ ...personal_content, client_data: client_data });

        localStorage.setItem(
          "clients_content",
          JSON.stringify(clients_content),
        );
      } else if (todo_save_flag == "delete_todo") {
        console.log("Save Todo Flage = Deleting Todo: ", todo_save_flag);
      } else {
        console.log("Save Flage = Unknow");
      }

      closePopUp();
    } else {
      console.log("There is an empty field");
    }
  }

  // Handle long press Pop up

  let pressTimer;
  function handleLongPressForCard(e) {
    pressTimer = setTimeout(() => {
      let add_item_pop = document.querySelector(".add_item_pop");
      add_item_pop.style.display = "none";
      let item_actns_pop = document.querySelector(".item_actns_pop");
      item_actns_pop.style.display = "flex";

      let TodoName = e.target.className.split(" ");
      let TodoDate = e.target.className.split(" ");
      setActive_Todo_Data({
        ...active_todo_data,
        todo_doc_index: e.target.className.split(" ")[1].split("_")[0],
        todo_doc_id: e.target.className.split(" ")[1],
        todo_doc_name: TodoName.slice(2, TodoName.length - 1).join(" "),
        todo_doc_do_date: TodoDate[TodoDate.length - 1],
      });
      openPopUp();
      // clearTimeout(pressTimer);
    }, 250);

    // console.log("Todo_Index: ", active_todo_data.todo_doc_index);
    // console.log(
    //   "Todo_doc_id: ",
    //   active_todo_data.todo_doc_id.slice(
    //     2,
    //     active_todo_data.todo_doc_id.length,
    //   ),
    // );
  }
  function handleDoublickForCard(event) {
    handleLongPressForCard(event);
  }
  function handleLeavePressForCard() {
    clearTimeout(pressTimer);
    // console.log("Relesead soon");
  }

  // Add Todo Buttonn
  function addTodoBtn() {
    setTodo_Save_Flag("add_todo");
    openInputsCard();
    console.log("Adding item");
  }

  function clrInputs() {
    setTodo_Obj({ ...todo_obj, todo_name: "", todo_do_date: "" });
  }
  function closePopUp() {
    let pop_ups = document.querySelector(".pop_ups");
    pop_ups.style.display = "none";
    clrInputs();
  }

  // Handle Edit Todo
  function handleEditTodo() {
    setTodo_Save_Flag("edit_todo");
    console.log("FLAG: ", todo_save_flag);
    console.log(
      ` todo index: ${active_todo_data.todo_doc_index} id: ${active_todo_data.todo_doc_id}`,
    );
    setTodo_Obj({
      ...todo_obj,
      todo_name: active_todo_data.todo_doc_name,
      todo_do_date: active_todo_data.todo_doc_do_date,
    });
    openInputsCard();
  }
  function handleDeleteTodo() {
    setTodo_Save_Flag("delete_todo");
    let { todo_doc_index } = active_todo_data;
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
      client_data[0].content.splice(todo_doc_index, 1),
    ]);
    setPersonal_Content({ ...personal_content, client_data: client_data });
    localStorage.setItem("clients_content", JSON.stringify(clients_content));

    closePopUp();
  }
  let aA = 1;

  return (
    <div className="todos-dv">
      <div className="first">
        <div className="search-input">
          <input type="text" placeholder="Todo" />
        </div>
        <button onClick={addTodoBtn}>Add Todo {/* {todo_save_flag} */}</button>
      </div>
      <div className="second">
        <div className="todo-cards">
          {todos_avail?.[0]?.length > 0 ? (
            todos_avail[0].map((todo, i) => (
              <div
                key={`${i}_${todo.todo_id}`}
                className={`card ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                onMouseDown={handleLongPressForCard}
                onDoubleClick={handleDoublickForCard}
                onMouseLeave={handleLeavePressForCard}
                onMouseUp={handleLeavePressForCard}
              >
                <div
                  className={`data ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                >
                  <span
                    className={`todo_name_sp ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                  >
                    {todo.todo_name}{" "}
                  </span>
                  <span
                    className={`todo_date_sp ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                  >
                    Do Date:{todo.todo_do_date}
                  </span>
                </div>
                <div
                  className={`actns ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                >
                  <span
                    className={`todo_status_sp ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                    id="todo_status_sp"
                  >
                    {todo.todo_status}
                  </span>
                  {/* <button
                    className={`todo_statusBTN ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                    onClick={changeTodoStatus}
                  >
                  </button> */}
                  <img
                    className={`todo_statusIMG ${i}_${todo.todo_id} ${todo.todo_name} ${todo.todo_do_date}`}
                    onClick={changeTodoStatus}
                    src={
                      todo.todo_status !== "completed" ? null : status_completed
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="no_content">
              <span>There are no todos yet </span>
              <span>
                Press <b onClick={addTodoBtn}>Add Todo</b> to add new todo{" "}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="pop_ups">
        <div className="add_item_pop">
          <div className="head">
            <img src={close_icon} alt="" onClick={closePopUp} />
          </div>
          <input
            type="text"
            placeholder="Todo Name"
            name="todo_name"
            value={todo_obj.todo_name}
            onChange={handleNameTextInp}
          />
          <input
            type="date"
            placeholder="Todo Cost"
            name="todo_do_date"
            value={todo_obj.todo_do_date}
            onChange={handleNameTextInp}
          />
          <button onClick={handleTodoCreation}>
            {todo_save_flag == "add_todo" ? "Save" : "Update"}
          </button>
        </div>
        <div className="item_actns_pop">
          <div className="head">
            <img src={close_icon} alt="" onClick={closePopUp} />
          </div>
          <button onClick={handleEditTodo}>Edit Todo</button>
          <button onClick={handleDeleteTodo}>Delete Todo</button>
        </div>
      </div>
    </div>
  );
}
