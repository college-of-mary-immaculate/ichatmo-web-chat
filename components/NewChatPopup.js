import styles from "./NewPopup.module.scss";
import { useState, useRef, useContext, useEffect } from "react";
import UserItem from "./UserItem";
import { ChatAppContext } from "../contexts/ChatApp.context";
import useOnClickOutside from "../utils/useOnClickOutside";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function NewChatPopup() {
  const {
    toggleNewChatPopup,
    setUserSearched,
    userSearchedList,
    userInfo,
    setSelectedRoom,
    selectedRoom,
    conversationList,
    setConversations,
    socket,
  } = useContext(ChatAppContext);
  const [inputData, setInputData] = useState("");
  const elementRef = useRef(null);

  useOnClickOutside(elementRef, () => toggleNewChatPopup());

  useEffect(() => {
    if (inputData) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(`/api/users/${inputData}`, { signal })
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

  function joinRoom(id) {
    fetch("/api/rooms/private", {
      method: "POST",
      body: JSON.stringify({ userId: userInfo.id, targetId: id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        socket.emit("join-chat", { newRoom: data.room, oldRoom: selectedRoom });
        setSelectedRoom(data.room);
      })
      .catch((err) => console.log(err));

    // socket.emit("join-chat", selectedChat._id);
    toggleNewChatPopup();
  }

  const users = userSearchedList.map((user) => {
    if (user.id !== userInfo.id) {
      return (
        <UserItem
          key={user.id}
          fullname={user.fullname}
          username={user.username}
          image={user.image}
          onclick={() => joinRoom(user.id)}
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
            <CloseRoundedIcon />
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
