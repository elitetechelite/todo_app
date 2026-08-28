import { useEffect, useState } from "react";
import "./register_login.css";
import register_pic from "../assets/icons/create_account.png";
import login_pic from "../assets/icons/login.png";
import user_pic from "../assets/icons/user.png";
import email_pic from "../assets/icons/email.png";
import password_pic from "../assets/icons/password.png";

export function genrateClientID() {
  let randNo = Math.floor(Math.random() * 901290);
  let chars = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
  let charsArr = chars.split(" ");
  let charsLen = charsArr.length;
  let randChars = () =>
    `${charsArr[Math.floor(Math.random() * (charsLen - 1))]}${charsArr[Math.floor(Math.random() * (charsLen - 1))]}${charsArr[Math.floor(Math.random() * (charsLen - 1))]}`;

  let randID = `client_${randChars()}_${randNo}`;
  return randID;
}
export function generateDateTime() {
  // Date
  let date = new Date();
  let YYYY = `${date.getFullYear()}`;
  let MM = `${date.getMonth()}`;
  let DD = `${date.getDate()}`;

  if (MM.length <= 1) {
    MM = `0${MM}`;
  }
  if (DD.length <= 1) {
    DD = `0${DD}`;
  }

  let C_DATE = `${DD}-${MM}-${YYYY}`;

  // Time
  let HRS = `${date.getHours()}`;
  let MINS = `${date.getMinutes()}`;
  let SECS = `${date.getSeconds()}`;

  if (HRS.length <= 1) {
    // HRS = `0${HRS}`;
  }
  if (MINS.length <= 1) {
    MINS = `0${MINS}`;
  }
  if (SECS.length <= 1) {
    SECS = `0${SECS}`;
  }

  let C_TIME = `${HRS}:${MINS}:${SECS}`;

  return { C_DATE, C_TIME };
}

export function Register() {
  let [clientID, setClientID] = useState(genrateClientID());
  const [clients_data, setClients_Data] = useState(
    JSON.parse(localStorage.getItem("clients_data")) || [],
  );
  const [clients_content, setClients_Content] = useState(
    JSON.parse(localStorage.getItem("clients_content")) || [],
  );
  const [newClientData, setNewClientData] = useState({
    client_id: "",
    client_name: "",
    client_email: "",
    client_password: "",
    client_pic: "",
    client_settings: [],
    client_meta_data: {
      creation_time: "",
      creation_date: "",
    },
  });
  const [newClientContent, setNewClientContent] = useState({
    client_id: "",
    total_todos: 0,
    total_tasks: 0,
    total_budget_items: 0,

    client_data: [
      {
        doc_name: "todos",
        content: [],
      },
      {
        doc_name: "task_list",
        content: [],
      },
      {
        doc_name: "budget",
        content: [],
      },
    ],
  });
  const [clientRegistered, setClientRegistered] = useState(false);

  useEffect(() => {
    localStorage.setItem("clients_data", JSON.stringify(clients_data));
    localStorage.setItem("clients_content", JSON.stringify(clients_content));
    // setClientRegistered(true);
    if (clientRegistered) {
      location.href = "/login";
    }
  }, [clients_content]);

  function handleInputChange(e) {
    let { name, value } = e.target;
    setClientID(genrateClientID());
    setNewClientData({
      ...newClientData,
      [name]: value,
      client_id: clientID, //genrateClientID(),
      client_meta_data: {
        creation_time: generateDateTime().C_TIME,
        creation_date: generateDateTime().C_DATE,
      },
    });
    setNewClientContent({ ...newClientContent, client_id: clientID });
  }

  function handleRegisterFormSubmit(e) {
    e.preventDefault();

    setClients_Data([...clients_data, newClientData]);
    setClients_Content([...clients_content, newClientContent]);

    setNewClientData({
      ...newClientData,
      client_name: "",
      client_email: "",
      client_password: "",
    });

    setClientRegistered(true);
    console.log("Clients Data: ", clients_data);
    console.log("New Client Data: ", newClientData);
  }

  function loginButton(e) {
    e.preventDefault();
    location.href = "/login";
  }
  return (
    <div className="register_dv">
      <form onSubmit={handleRegisterFormSubmit}>
        <h2>Signup</h2>
        <label>
          <span>
            <img src={user_pic} />
            <span>Username</span>
          </span>
          <input
            type="text"
            name="client_name"
            onChange={handleInputChange}
            value={newClientData.client_name}
          />
        </label>
        <label>
          <span>
            {" "}
            <img src={email_pic} /> <span>Email</span>
          </span>
          <input
            type="email"
            name="client_email"
            onChange={handleInputChange}
            value={newClientData.client_email}
          />
        </label>
        <label>
          <span>
            <img src={password_pic} />
            <span>Password</span>
          </span>
          <input
            type="password"
            name="client_password"
            onChange={handleInputChange}
            value={newClientData.client_password}
          />
        </label>
        <div className="btns">
          {/* <input type="submit" value="Submit" /> */}
          <button>
            <img src={register_pic} alt="" />
            Submit
          </button>
          <button onClick={loginButton}>
            <img src={login_pic} alt="" />
            Have an account
          </button>
        </div>
      </form>
    </div>
  );
}
