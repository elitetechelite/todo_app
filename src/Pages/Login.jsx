import { useEffect, useState } from "react";
import "./register_login.css";
import { generateDateTime, genrateClientID } from "./Register";
import register_pic from "../assets/icons/create_account.png";
import login_pic from "../assets/icons/login.png";
import email_pic from "../assets/icons/email.png";
import password_pic from "../assets/icons/password.png";

export function loginCheck() {
  let loginMetaData = JSON.parse(localStorage.getItem("login_meta_data")) || {};
  if (loginMetaData != {}) {
    if (!loginMetaData.loggedIn) {
      location.href = "/login";
    } else {
      console.log("Logged in");
    }
  } else {
    console.log("No Login Metat Data");
  }
}
export function Login() {
  let [loggedin, setLoggedin] = useState(false);
  let [loginUserObj, setLoginUserObj] = useState({
    client_email: "",
    client_password: "",
  });
  const [clients_data, setClients_Data] = useState(
    JSON.parse(localStorage.getItem("clients_data")) || [],
  );
  const [client_id, setClient_Id] = useState("");
  const [form_err_msg, setForm_Err_Msg] = useState("");

  useEffect(() => {
    if (loggedin) {
      let metaData = {
        loggedin_client: client_id,
        loggedIn: true,
        login_id: `login_${genrateClientID()}`,
        login_date: generateDateTime().C_DATE,
        loggin_time: generateDateTime().C_TIME,
      };
      localStorage.setItem("login_meta_data", JSON.stringify(metaData));
      console.log("Logged In successfully...");
      location.href = "/home/todos";
    }
  }, [loggedin]);

  function handleInputChange(e) {
    setForm_Err_Msg("");
    let { name, value } = e.target;
    setLoginUserObj({ ...loginUserObj, [name]: value });
  }
  function handleLoginSubmit(e) {
    e.preventDefault();
    let message = "Client Not Found";
    if (!(clients_data.length == 0)) {
      clients_data.forEach((client) => {
        if (
          client.client_email == loginUserObj.client_email &&
          client.client_password == loginUserObj.client_password
        ) {
          message = "Client Found";
          console.log(message);
          //   break
          setClient_Id(client.client_id);
          setLoggedin(true);
          return message;
        } else if (
          loginUserObj.client_email !== "" &&
          loginUserObj.client_password !== ""
        ) {
          if (
            client.client_email == loginUserObj.client_email &&
            client.client_password != loginUserObj.client_password
          ) {
            setForm_Err_Msg("Wrong password");
          } else if (
            client.client_password == loginUserObj.client_password &&
            client.client_email != loginUserObj.client_email
          ) {
            setForm_Err_Msg("Wrong Email");
          } else if (
            client.client_password != loginUserObj.client_password &&
            client.client_email != loginUserObj.client_email
          ) {
            setForm_Err_Msg("Enter correct details");
          }
        } else {
          if (loginUserObj.client_email == "") {
            setForm_Err_Msg("Enter email");
          } else if (loginUserObj.client_password == "") {
            setForm_Err_Msg("Enter password");
          } else {
            setForm_Err_Msg("Please enter correct details");
          }
        }
      });
    } else {
      console.log("Failed to log in due to wrong details");
      console.log("There are no clients in der system");
    }
  }
  function registerButton(e) {
    e.preventDefault();
    location.href = "/register";
  }
  return (
    <div className="register_dv">
      <form onSubmit={handleLoginSubmit}>
        <h2>Login</h2>
        <label>
          <span>
            <img src={email_pic} alt="" />
            <span>Email</span>
          </span>
          <input
            type="text"
            name="client_email"
            onChange={handleInputChange}
            value={loginUserObj.client_email}
          />
        </label>
        <label>
          <span>
            <img src={password_pic} alt="" />
            <span>Password</span>
          </span>
          <input
            type="text"
            name="client_password"
            onChange={handleInputChange}
            value={loginUserObj.client_password}
          />
        </label>
        <div className="err_msg">
          <span>{form_err_msg}</span>
        </div>
        <div className="btns">
          <button>
            <img src={login_pic} alt="" />
            Submit
          </button>
          {/* <input type="submit" value="Submit" /> */}
          <button onClick={registerButton}>
            <img src={register_pic} alt="" />
            Create Account !
          </button>
        </div>
      </form>
    </div>
  );
}
