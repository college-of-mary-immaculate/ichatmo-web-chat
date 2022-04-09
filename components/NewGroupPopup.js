import styles from "./NewPopup.module.scss";
import { useState, useRef, useContext, useEffect } from "react";
import Image from "next/image";
import UserItem from "./UserItem";
import { ChatAppContext } from "../contexts/ChatApp.context";
import useOnClickOutside from "../utils/useOnClickOutside";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { useFilePicker } from "use-file-picker";

export default function NewGroupPopup() {
  const {
    toggleNewGroupPopup,
    userInfo,
    setSelectedRoom,
    selectedRoom,
    socket,
  } = useContext(ChatAppContext);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersSearched, setUsersSearched] = useState([]);
  const [inputValues, setInputValues] = useState({
    groupname: "",
    user: "",
  });
  const elementRef = useRef(null);
  const [openFileSelector, { filesContent }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });
  useOnClickOutside(elementRef, () => toggleNewGroupPopup());

  useEffect(() => {
    if (inputValues.user) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(`/api/users/${inputValues.user}`, { signal })
        .then((res) => res.json())
        .then((data) => setUsersSearched([...data.users]))
        .catch((err) => console.log(err));

      return () => {
        if (signal && controller.abort) {
          controller.abort();
        }
      };
    }
  }, [inputValues.user]);

  function inputChangeHandler(event) {
    const { name, value } = event.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const users = usersSearched.map((user) => {
    if (user.id !== userInfo.id) {
      return (
        <UserItem
          key={user.id}
          fullname={user.fullname}
          username={user.username}
          image={user.image}
          onclick={() => addUser(user)}
        />
      );
    }
  });

  const selectedUserPills = selectedUsers.map((user) => {
    return (
      <span key={user.id} className={styles["c-popup__added-user-pill"]}>
        {user.username}
        <button
          className={styles["c-popup__user-remove-button"]}
          onClick={() => removeAddedUser(user.id)}
        >
          <RemoveOutlinedIcon />
        </button>
      </span>
    );
  });

  function addUser(user) {
    setInputValues((prev) => ({ ...prev, user: "" }));
    const { id, username } = user;
    if (!selectedUsers.some((item) => item.id == id)) {
      setSelectedUsers((prev) => [...prev, { id, username }]);
    }
  }

  function removeAddedUser(userId) {
    setSelectedUsers((prev) => [...prev.filter((user) => user.id !== userId)]);
  }

  function handleCreate() {
    const userIds = selectedUsers.map((user) => user.id);
    const formBody = JSON.stringify({
      name: inputValues.groupname,
      admin: userInfo.id,
      image: filesContent[0].content,
      members: [userInfo.id, ...userIds],
    });
    fetch("/api/rooms/group", {
      method: "POST",
      body: formBody,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        socket.emit("join-chat", { newRoom: data.room, oldRoom: selectedRoom });
        setSelectedRoom(data.room);
        toggleNewGroupPopup();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={`${styles["c-popup"]} ${styles["c-popup--fade-in"]}`}>
      <div
        className={`${styles["c-popup__wrap"]} ${styles["c-popup__wrap--group"]} ${styles["c-popup__wrap--scale-in"]}`}
        ref={elementRef}
      >
        <div className={styles["c-popup__header-wrap"]}>
          <h2 className={styles["c-popup__name"]}>New Group</h2>
          <button
            className={styles["c-popup__close-button"]}
            onClick={() => toggleNewGroupPopup()}
          >
            <CloseOutlinedIcon />
          </button>
        </div>
        <div className={styles["c-popup__img-selector-wrap"]}>
          <button
            className={styles["c-popup__img-selector-button"]}
            onClick={() => openFileSelector()}
          >
            {filesContent.length ? (
              <Image
                className={styles["c-popup__selected-image"]}
                src={filesContent[0].content}
                alt={filesContent[0].name}
                layout="fill"
              />
            ) : (
              //   <img
              //     className={styles["c-popup__selected-image"]}
              //     alt={filesContent[0].name}
              //     src={filesContent[0].content}
              //   />
              <AddPhotoAlternateOutlinedIcon
                className={styles["c-popup__img-selector-button-icon"]}
              />
            )}
          </button>
        </div>
        <input
          type="text"
          name="groupname"
          value={inputValues.groupname}
          placeholder="Enter group name"
          className={styles["c-popup__input"]}
          onChange={inputChangeHandler}
        ></input>
        <div className={styles["c-popup__user-add-wrap"]}>
          {selectedUserPills}
          {/* <span className={styles["c-popup__added-user"]}>
            username
            <button className={styles["c-popup__user-remove-button"]}>
              <RemoveOutlinedIcon />
            </button>
          </span> */}
          <input
            type="text"
            value={inputValues.user}
            name={"user"}
            autoComplete="off"
            placeholder="Enter name or username"
            className={`${styles["c-popup__input"]} ${styles["c-popup__input--inline"]}`}
            onChange={inputChangeHandler}
          ></input>
        </div>
        <ul className={styles["c-popup__users"]}>{users}</ul>
        <button
          className={styles["c-popup__create-button"]}
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
}
