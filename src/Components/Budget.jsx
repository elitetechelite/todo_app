import { useEffect, useState } from "react";
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
function closePopUp() {
  let pop_ups = document.querySelector(".pop_ups");
  pop_ups.style.display = "none";
}

export default function Budget() {
  const [item_bought_status, setItem_Bought_Status] = useState("pending");
  const [item_obj, setItem_Obj] = useState({
    item_id: "",
    item_name: "",
    item_cost: "",
    item_status: "",
    item_meta_data: {
      creation_time: "",
      creation_date: "",
    },
  });
  const [clients_content, setClients_Content] = useState(
    JSON.parse(localStorage.getItem("clients_content")) || [],
  );
  const [personal_content, setPersonal_Content] = useState({
    total_items: "",
    items: {},
  });
  const [client_data, setClient_Data] = useState("");
  const [logged_in_user_dets, setLogged_In_User_Dets] = useState(
    JSON.parse(localStorage.getItem("login_meta_data")),
  );
  const [items_avail, setTodos_Avail] = useState(
    clients_content.map(
      (client) =>
        client.client_id == logged_in_user_dets.loggedin_client &&
        client.client_data[2].content,
    ),
  );
  const [active_item_data, setActive_Item_Data] = useState({
    item_doc_index: "",
    item_doc_id: "",
    item_doc_name: "",
    item_doc_do_date: "",
  });
  const [item_save_flag, setItem_Save_Flag] = useState("add_item");
  const [item_count, setItem_Count] = useState({
    total_items: 0,
    total_amout: 0,
  });

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

    clients_content.forEach((client, i) => {
      if (client.client_id == logged_user.loggedin_client) {
        setClients_Content([
          ...clients_content,
          clients_content[i].client_data[2].content[index].item_status ==
          "pending"
            ? (clients_content[i].client_data[2].content[index].item_status =
                "completed")
            : (clients_content[i].client_data[2].content[index].item_status =
                "pending"),
        ]);
        if (
          clients_content[i].client_data[2].content[index].item_status ==
          "completed"
        ) {
          setItem_Count({
            ...item_count,
            total_amout: (item_count.total_amout -=
              clients_content[i].client_data[2].content[index].item_cost),
          });
        } else if (
          clients_content[i].client_data[2].content[index].item_status ==
          "pending"
        ) {
          setItem_Count({
            ...item_count,
            total_amout: (item_count.total_amout += Number(
              clients_content[i].client_data[2].content[index].item_cost,
            )),
          });
        }
        console.log("CLient DataCo: ", personal_content);
      } else {
        console.log("CLient DataCo: NULLL");
        console.log("CID-1: ", client.client_id);
        console.log("CID-2: ", logged_user.loggedin_client);
      }
    });

    // setClient_Data([
    //   ...client_data,
    //   client_data[2].content[index].item_status == "pending"
    //     ? (client_data[2].content[index].item_status = "completed")
    //     : (client_data[2].content[index].item_status = "pending"),
    // ]);
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
    ItemCountFunc();
  }, []);

  //handle todo creation

  function handleNameTextInp(e) {
    let { name, value } = e.target;
    setItem_Obj({
      ...item_obj,
      item_id: `item_${genrateClientID()}`,
      [name]: value,
      item_status: "pending",
      item_meta_data: {
        creation_time: generateDateTime().C_TIME,
        creation_date: generateDateTime().C_DATE,
      },
    });
  }
  function handleItemCreation() {
    if (item_obj.item_name !== "" && item_obj.item_cost !== "") {
      if (item_save_flag == "add_item") {
        clients_content.forEach((client) => {
          if (client.client_id == my_client_id) {
            setPersonal_Content(client);
            setClient_Data(client.client_data);
          } else {
            console.log("No Client Data ");
          }
        });

        clients_content.forEach((client, i) => {
          if (client.client_id == logged_user.loggedin_client) {
            setClients_Content([
              ...clients_content,
              clients_content[i].client_data[2].content.push(item_obj),
            ]);
            console.log("CLient DataCo: ", personal_content);
          } else {
            console.log("CLient DataCo: NULLL");
            console.log("CID-1: ", client.client_id);
            console.log("CID-2: ", logged_user.loggedin_client);
          }
        });

        // setClient_Data([...client_data, client_data[2].content.push(item_obj)]);
        setPersonal_Content({ ...personal_content, client_data: client_data });
        localStorage.setItem(
          "clients_content",
          JSON.stringify(clients_content),
        );

        console.log("PERSONAL C: ", personal_content);
        console.log("All Clients: ", clients_content);
      } else if (item_save_flag == "edit_item") {
        let { item_doc_index } = active_item_data;
        let Item_name = item_obj.item_name;
        let Item_cost = item_obj.item_cost;

        clients_content.forEach((client) => {
          if (client.client_id == my_client_id) {
            setPersonal_Content(client);
            setClient_Data(client.client_data);
          } else {
            // console.log("No Client Data ");
          }
        });

        clients_content.forEach((client, i) => {
          if (client.client_id == logged_user.loggedin_client) {
            setClients_Content([
              ...clients_content,
              (clients_content[i].client_data[2].content[
                item_doc_index
              ].item_name = Item_name),
              (clients_content[i].client_data[2].content[
                item_doc_index
              ].item_cost = Item_cost),
            ]);
            console.log("CLient DataCo: ", personal_content);
          } else {
            console.log("CLient DataCo: NULLL BUDGET");
            console.log("CID-1: ", client.client_id);
            console.log("CID-2: ", logged_user.loggedin_client);
          }
        });

        console.log("NAMMM: ", Item_name, "IDEXXX: ", item_doc_index);
        // setClient_Data([
        //   ...client_data,
        //   ((client_data[2].content[item_doc_index].item_name = Item_name),
        //   (client_data[2].content[item_doc_index].item_cost = Item_cost)),
        // ]);

        setPersonal_Content({ ...personal_content, client_data: client_data });

        localStorage.setItem(
          "clients_content",
          JSON.stringify(clients_content),
        );
      } else if (item_save_flag == "delete_item") {
        console.log("Save Todo Flage = Deleting Todo: ", item_save_flag);
      } else {
        console.log("Save Flage = Unknow");
      }
      ItemCountFunc();
      closePopUp();
    } else {
      console.log("There should'nt be empty fields");
    }
  }

  function addItemBtn() {
    setItem_Save_Flag("add_item");
    openInputsCard();
    console.log("Adding item");
  }
  function clrInputs() {
    setItem_Obj({ ...item_obj, item_name: "", item_cost: "" });
  }

  // Handle Edit Item
  function handleEditItem() {
    setItem_Save_Flag("edit_item");
    // console.log("FLAG: ", item_save_flag);
    // console.log(
    //   ` todo index: ${active_item_data.item_doc_index} id: ${active_item_data.item_doc_id}`,
    // );
    setItem_Obj({
      ...item_obj,
      item_name: active_item_data.item_doc_name,
      item_cost: active_item_data.item_doc_cost,
    });
    openInputsCard();
  }
  function handleDeleteItem() {
    setItem_Save_Flag("delete_item");
    let { item_doc_index } = active_item_data;
    clients_content.forEach((client) => {
      if (client.client_id == my_client_id) {
        setPersonal_Content(client);
        setClient_Data(client.client_data);
      } else {
        // console.log("No Client Data ");
      }
    });

    clients_content.forEach((client, i) => {
      if (client.client_id == logged_user.loggedin_client) {
        setClients_Content([
          ...clients_content,
          clients_content[i].client_data[2].content.splice(item_doc_index, 1),
        ]);
        console.log("CLient DataCo: ", personal_content);
      } else {
        console.log("CLient DataCo: NULLL");
        console.log("CID-1: ", client.client_id);
        console.log("CID-2: ", logged_user.loggedin_client);
      }
    });

    // setClient_Data([
    //   ...client_data,
    //   client_data[2].content.splice(item_doc_index, 1),
    // ]);
    setPersonal_Content({ ...personal_content, client_data: client_data });
    localStorage.setItem("clients_content", JSON.stringify(clients_content));
    ItemCountFunc();
    closePopUp();
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

      let ItemName = e.target.className.split(" ");
      let ItemCost = e.target.className.split(" ");
      // console.log("ITEM COSTT: ", ItemCost[ItemCost.length - 1]);
      setActive_Item_Data({
        ...active_item_data,
        item_doc_index: e.target.className.split(" ")[1].split("_")[0],
        item_doc_id: e.target.className.split(" ")[1],
        item_doc_name: ItemName.slice(2, ItemName.length - 1).join(" "),
        item_doc_cost: ItemCost[ItemCost.length - 1],
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
  function ItemCountFunc() {
    let Total_Amount = 0;
    let Total_Items = 0;
    items_avail[0].map((item, i) => {
      Total_Items = i;
      if (item.item_status == "pending") {
        Total_Amount += Number(item.item_cost);
        setItem_Count({
          ...item_count,
          total_items: Total_Items + 1,
          total_amout: Total_Amount, //(item_count.total_amout += Number(item.item_cost)),
        });
      }
    });
  }

  return (
    <div className="budget-dv">
      <div className="first">
        <div className="search-input">
          <input type="text" placeholder="Item" />
        </div>
        <button onClick={addItemBtn}>+ Add Item</button>
      </div>
      <div className="second">
        <div className="head">
          <div className="analysis">
            <span id="total_item_sp">{item_count.total_items}</span>
            <span>
              Total Exp:{" "}
              <span id="total_expendture_sp">UGX {item_count.total_amout}</span>
            </span>
          </div>
        </div>
        <div className="todo-cards">
          {items_avail?.[0]?.length > 0 ? (
            items_avail[0].map((item, i) => (
              <div
                key={`${i}_${item.item_id}`}
                className={`card ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                onMouseDown={handleLongPressForCard}
                onDoubleClick={handleDoublickForCard}
                onMouseLeave={handleLeavePressForCard}
                onMouseUp={handleLeavePressForCard}
              >
                <div
                  className={`data ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                >
                  <span
                    className={`item_name_sp ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                  >
                    {item.item_name}
                  </span>
                  <span
                    className={`item_price_sp ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                  >
                    UGX {item.item_cost}
                  </span>
                </div>
                <div
                  className={`actns ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                >
                  <span
                    id="item_status_sp"
                    className={`item_status_sp ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                    style={{
                      background:
                        item.item_status == "completed"
                          ? "#03b27872"
                          : "#4003b272",
                    }}
                  >
                    {item.item_status == "completed"
                      ? "Bought"
                      : item.item_status}
                  </span>
                  {/* <button
                    onClick={changeItemStatus}
                    className={`item_statusBTN ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                  ></button> */}
                  <img
                    src={
                      item.item_status !== "completed" ? null : status_completed
                    }
                    onClick={changeItemStatus}
                    className={`item_statusBTN ${i}_${item.item_id} ${item.item_name} ${item.item_cost}`}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="no_content">
              <span>There are no items yet </span>
              <span>
                Press <b onClick={addItemBtn}>Add Item</b> to add new item{" "}
              </span>
            </div>
          )}
          {/* <div
            className="card"
            onMouseDown={handleLongPressForCard}
            onMouseLeave={handleLeavePressForCard}
            onMouseUp={handleLeavePressForCard}
          >
            <div className="data">
              <span>Item 1</span>
              <span>UGX 10,000</span>
            </div>
            <div className="actns">
              <span id="item_status_sp">{item_bought_status}</span>
              <button onClick={changeItemStatus}></button>
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
            name="item_name"
            value={item_obj.item_name}
            onChange={handleNameTextInp}
            placeholder="Item Name"
          />
          <input
            type="number"
            name="item_cost"
            value={item_obj.item_cost}
            onChange={handleNameTextInp}
            placeholder="Item Cost"
          />
          <button onClick={handleItemCreation}>
            {item_save_flag === "add_item" ? "Save" : "Update"}
          </button>
        </div>
        <div className="item_actns_pop">
          <div className="head">
            <img src={close_icon} alt="" onClick={closePopUp} />
          </div>
          <button onClick={handleEditItem}>Edit Item</button>
          <button onClick={handleDeleteItem}>Delete Item</button>
        </div>
      </div>
    </div>
  );
}
