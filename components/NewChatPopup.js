import styles from "./NewChatPopup.module.scss";
import { useState, useRef, useContext, useEffect } from "react";
import UserItem from "./UserItem";
import { ChatAppContext } from "../contexts/ChatApp.context";
import useOnClickOutside from "../utils/useOnClickOutside";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function NewChatPopup() {
  const { toggleNewChatPopup, setUserSearched, userSearchedList, userInfo } =
    useContext(ChatAppContext);
  const [inputData, setInputData] = useState("");
  const elementRef = useRef(null);

  useOnClickOutside(elementRef, () => toggleNewChatPopup());

  useEffect(() => {
    if (inputData) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(`/api/users/search/${inputData}`, { signal })
        .then((res) => res.json())
        .then((data) => setUserSearched(data.users))
        .catch((err) => console.log(err));

      return () => {
        if (signal && controller.abort) {
          controller.abort();
        }
      };
    }
  }, [inputData]);

  function inputChangeHandler(event) {
    setInputData(event.target.value);
  }

  function joinRoom() {}

  const users = userSearchedList.map((user) => {
    if (user.id !== userInfo.id) {
      return (
        <UserItem
          key={user._id}
          fullname={user.fullname}
          username={user.username}
          image={user.image}
        />
      );
    }
  });

  return (
    <div className={`${styles["c-popup"]} ${styles["c-popup--fade-in"]}`}>
      <div
        className={`${styles["c-popup__wrap"]} ${styles["c-popup__wrap--scale-in"]}`}
        ref={elementRef}
      >
        <div className={styles["c-popup__header-wrap"]}>
          <h2 className={styles["c-popup__name"]}>New Chat</h2>
          <button
            className={styles["c-popup__close-button"]}
            onClick={() => toggleNewChatPopup()}
          >
            <CloseOutlinedIcon />
          </button>
        </div>

        {/* <p className={styles["c-popup__description"]}>
          Create a new conversation with another user
        </p> */}
        <input
          type="text"
          value={inputData}
          placeholder="Enter name or username"
          className={styles["c-popup__input"]}
          onChange={inputChangeHandler}
        ></input>
        <ul className={styles["c-popup__users"]}>{users}</ul>
        {/* <button className={styles["c-popup__button"]}>Create</button> */}
      </div>
    </div>
  );
}
