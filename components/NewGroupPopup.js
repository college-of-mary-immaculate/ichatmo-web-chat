import styles from "./NewPopup.module.scss";
import { useState, useRef, useContext, useEffect } from "react";
import Image from "next/image";
import UserItem from "./UserItem";
import { ChatAppContext } from "../contexts/ChatApp.context";
import Loader from "./Loader";
import useOnClickOutside from "../utils/useOnClickOutside";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useFilePicker } from "use-file-picker";

export default function NewGroupPopup() {
  const {
    toggleNewGroupPopup,
    userInfo,
    setUserSearched,
    userSearchedList,
    setSelectedRoom,
    selectedRoom,
    showChatBox,
    socket,
  } = useContext(ChatAppContext);
  const [selectedUsers, setSelectedUsers] = useState([]);
  // const [usersSearched, setUsersSearched] = useState([]);
  const [inputValues, setInputValues] = useState({
    groupname: "",
    user: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef(null);
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });
  useOnClickOutside(elementRef, () => {
    if (!isLoading) {
      toggleProfilePopup();
    }
  });

  useEffect(() => {
    if (inputValues.user) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(`/api/users/search/${inputValues.user}`, { signal })
        .then((res) => res.json())
        .then((data) => setUserSearched([...data.users]))
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

  const users = userSearchedList.map((user) => {
    if (user.id !== userInfo._id) {
      return (
        <UserItem
          key={user.id}
          fullname={user.fullname}
          username={user.username}
          image={user.image.url}
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
          <RemoveRoundedIcon style={{ fontSize: 24 }} />
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
      admin: userInfo._id,
      image: filesContent[0].content,
      members: [userInfo._id, ...userIds],
    });
    setIsLoading(true);
    fetch("/api/rooms/group", {
      method: "POST",
      body: formBody,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        socket.emit("join-chat", {
          newRoom: data.room,
          oldRoom: selectedRoom,
        });
        setSelectedRoom(data.room);
        setIsLoading(false);
        toggleNewGroupPopup();
        showChatBox(true);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={`${styles["c-popup"]} ${styles["c-popup--fade-in"]}`}>
      {isLoading && (
        <div className={styles["c-popup__loader-bg"]}>
          <div className={styles["c-popup__loader"]}>
            <div className={styles["c-popup__loader-wrap"]}>
              <Loader size={64} />
            </div>
            <p className={styles["c-user-popup__loader-text"]}>
              Creating group...
            </p>
          </div>
        </div>
      )}
      <div
        className={`${styles["c-popup__wrap"]} ${styles["c-popup__wrap--group"]} ${styles["c-popup__wrap--scale-in"]}`}
        ref={elementRef}
      >
        <div className={styles["c-popup__header-wrap"]}>
          <h2 className={styles["c-popup__label"]}>New Group</h2>
          <button
            className={styles["c-popup__close-button"]}
            onClick={() => toggleNewGroupPopup()}
          >
            <CloseRoundedIcon style={{ fontSize: 32 }} />
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
              <AddPhotoAlternateRoundedIcon
                style={{ fontSize: 36 }}
                className={styles["c-popup__img-selector-button-icon"]}
              />
            )}
          </button>
          {errors.length ? (
            <div className={styles["c-popup__image-errors-wrap"]}>
              <p
                className={`${styles["c-popup__error"]} ${styles["c-popup__error--centered"]}`}
              >
                <span className={styles["c-popup__error-icon-wrap"]}>
                  <ErrorRoundedIcon
                    style={{ fontSize: 16 }}
                    className={styles["c-popup__error-icon"]}
                  />
                </span>
                {errors[0].fileSizeToolarge &&
                  "File is too large, please choose a file that is less than 3mb"}
                {errors[0].readerError && "Problem occured while reading file!"}
                {errors[0].maxLimitExceeded && "Too many files"}
              </p>
            </div>
          ) : null}
        </div>
        <div className={styles["c-popup__input-wrap"]}>
          <input
            type="text"
            name="groupname"
            value={inputValues.groupname}
            placeholder="Enter group name"
            className={styles["c-popup__input"]}
            onChange={inputChangeHandler}
          ></input>
          {!inputValues.groupname.length && (
            <div className={styles["c-popup__input-info-wrap"]}>
              <p className={`${styles["c-popup__info-text"]}`}>
                <span className={styles["c-popup__info-icon-wrap"]}>
                  <InfoRoundedIcon
                    style={{ fontSize: 16 }}
                    className={styles["c-popup__info-icon"]}
                  />
                </span>{" "}
                A group name is required
              </p>
            </div>
          )}
        </div>
        <div className={styles["c-popup__input-wrap"]}>
          <div className={styles["c-popup__user-add-wrap"]}>
            {selectedUserPills}
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
          {selectedUsers.length < 2 && (
            <div className={styles["c-popup__input-info-wrap"]}>
              <p className={`${styles["c-popup__info-text"]}`}>
                <span className={styles["c-popup__info-icon-wrap"]}>
                  <InfoRoundedIcon
                    style={{ fontSize: 16 }}
                    className={styles["c-popup__info-icon"]}
                  />
                </span>{" "}
                Group must have atleast 2 participants
              </p>
            </div>
          )}
        </div>
        <ul className={styles["c-popup__users"]}>{users}</ul>
        <div className={styles["c-popup__bottom-wrap"]}>
          <button
            className={`${styles["c-popup__button"]} ${styles["c-popup__button--filled"]}`}
            onClick={() => handleCreate()}
            disabled={
              !(
                inputValues.groupname.length &&
                selectedUsers.length > 1 &&
                filesContent.length
              )
            }
          >
            Create
          </button>
          <button
            className={`${styles["c-popup__button"]} ${styles["c-popup__button--text"]}`}
            onClick={() => toggleNewGroupPopup()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
