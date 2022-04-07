import Image from "next/image";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ChatTop from "./ChatTop";
import Chat from "./Chat";
import Loader from "./Loader";
import { useState, useEffect, useRef, useContext } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";
import styles from "./Chatbox.module.scss";

export default function ChatBox() {
  let {
    socket,
    selectedRoom,
    chatList,
    setChats,
    userInfo,
    emptyChats,
    roomHeader,
    setRoomHeader,
  } = useContext(ChatAppContext);
  const [inputData, setInputData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const textBoxRef = useRef(null);
  const messagesEnd = useRef(null);
  const chatListBox = useRef(null);
  useEffect(() => textBoxRef.current.focus(), []);
  useEffect(() => socketHandler(), [selectedRoom]);
  useEffect(() => scrollToEnd(), [chatList]);
  useEffect(() => fetchChats(), [selectedRoom]);
  useEffect(() => {
    let name = "";
    let image = "";
    let username = "";

    if (selectedRoom) {
      if (selectedRoom.isGroup) {
        name = selectedRoom.groupName;
        image = selectedRoom.groupImage;
      } else if (selectedRoom.members[0]._id == selectedRoom.members[1]._id) {
        name = selectedRoom.members[0].fullname;
        image = selectedRoom.members[0].image;
        username = selectedRoom.members[0].username;
      } else {
        for (let i = 0; i < selectedRoom.members.length; i++) {
          if (selectedRoom.members[i]._id != userInfo.id) {
            name = selectedRoom.members[i].fullname;
            image = selectedRoom.members[i].image;
            username = selectedRoom.members[i].username;
            break;
          }
        }
      }
      // setIsLoading(false);
      setRoomHeader({ name, image, username });
    }
  }, [selectedRoom]);

  function fetchChats() {
    if (selectedRoom) {
      setIsLoading(true);
      fetch(`/api/chats/${selectedRoom._id}`)
        .then((res) => res.json())
        .then((data) => {
          emptyChats();
          setChats(data.chats);
          setIsLoading(false);
          chatListBox.current.scrollTo(0, chatListBox.current.scrollHeight);
        })
        .catch((err) => console.log(err));
    }

    return () => {
      emptyChats();
      setChats([]);
    };
  }

  function socketHandler() {
    socket.on("message-receive", (message) => {
      if (selectedRoom) {
        if (selectedRoom._id == message.room) {
          insertChat(message);
        }
      }
      socket.emit("update-convos", userInfo);
    });
  }

  function handleSubmit() {
    if (inputData) {
      const message = {
        room: selectedRoom,
        sender: userInfo,
        body: inputData,
      };
      socket.emit("message", message);
      socket.emit("update-convos", userInfo);
      insertChat(message);
      textBoxRef.current.innerHTML = "";
      setInputData("");
    }
  }

  function insertChat(chat) {
    setChats([chat]);
  }

  function inputChangeHandler(event) {
    setInputData(event.target.innerText);
  }

  function scrollToEnd() {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }

  const messageBubbles = chatList.map((message, index) => {
    // console.log(message);
    let isFromUser = message.sender.id == userInfo.id ? true : false;
    if (index + 1 <= chatList.length - 1) {
      if (message.sender.id == chatList[index + 1].sender.id) {
        return (
          <Chat
            key={index}
            isFromUser={isFromUser}
            consecutive={true}
            body={message.body}
          />
        );
      } else {
        return (
          <Chat
            key={index}
            isFromUser={isFromUser}
            consecutive={false}
            body={message.body}
            userPic={message.sender.image}
          />
        );
      }
    } else {
      return (
        <Chat
          key={index}
          isFromUser={isFromUser}
          consecutive={false}
          body={message.body}
          userPic={message.sender.image}
        />
      );
    }
  });

  return (
    <div className={styles["c-chatbox"]}>
      {isLoading && (
        <div className={styles["c-chatbox__loading"]}>
          <Loader />
        </div>
      )}
      <div className={styles["c-chatbox__header"]}>
        <button
          className={`${styles["c-chatbox__button"]} ${styles["c-chatbox__button--back"]}`}
        >
          <ArrowBackOutlinedIcon className={styles["c-chatbox__button-icon"]} />
        </button>
        <div className={styles["c-chatbox__image-wrap"]}>
          {roomHeader.image && (
            <Image
              className={styles["c-chatbox__image"]}
              src={roomHeader.image}
              alt="user pic"
              width={36}
              height={36}
              //   placeholder="blur"
            />
          )}
        </div>
        <p className={styles["c-chatbox__name"]}>{roomHeader.name}</p>
        <button
          className={`${styles["c-chatbox__button"]} ${styles["c-chatbox__button--align-right"]}`}
        >
          <MenuOpenOutlinedIcon className={styles["c-chatbox__button-icon"]} />
        </button>
      </div>
      <ul className={styles["c-chatbox__list"]} ref={chatListBox}>
        <ChatTop name={roomHeader.name} image={roomHeader.image} />
        {messageBubbles}
        <li ref={messagesEnd}></li>
      </ul>
      <div className={styles["c-chatbox__form"]}>
        <div className={styles["c-chatbox__input-wrap"]}>
          <div
            className={styles["c-chatbox__input"]}
            ref={textBoxRef}
            contentEditable="true"
            onInput={inputChangeHandler}
            suppressContentEditableWarning="true"
            role="textbox"
            rows="1"
            placeholder="Type message here..."
          ></div>
        </div>
        <button className={styles["c-chatbox__button"]} onClick={handleSubmit}>
          <SendOutlinedIcon className={styles["c-chatbox__button-icon"]} />
        </button>
      </div>
    </div>
  );
}
