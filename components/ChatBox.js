import Image from "next/image";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ChatTop from "./ChatTop";
import Chat from "./Chat";
import { useState, useEffect, useRef } from "react";
import styles from "./Chatbox.module.scss";
import sampleData from "../lib/sample-data";

export default function ChatboxBox() {
  const [inputData, setInputData] = useState("");
  const [messages, setMessages] = useState([...sampleData]);
  const textBoxRef = useRef(null);
  const messagesEnd = useRef(null);

  useEffect(() => textBoxRef.current.focus(), []);

  // useEffect(() => setMessages((prevList) => [...prevList, ...sampleData]), []);

  // useEffect(() => scrollToEnd(), [messages]);

  function handleSubmit(event) {
    // event.preventDefault();
    if (inputData) {
      //   socket.emit("message", inputData);
      //   insertChatbox({ sender: "user", message: inputData });
      setInputData("");
    }
  }

  function inputChangeHandler(event) {
    setInputData(event.target.innerText);
  }

  function scrollToEnd() {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }

  const messageBubbles = messages.map((message, index) => {
    let isFromUser = message.sender == 2 ? true : false;
    if (index + 1 <= messages.length - 1) {
      if (message.sender === messages[index + 1].sender) {
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
            userPic={message.userPic}
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
          userPic={message.userPic}
        />
      );
    }
  });

  return (
    <div className={styles["c-chatbox"]}>
      <div className={styles["c-chatbox__header"]}>
        <button
          className={`${styles["c-chatbox__button"]} ${styles["c-chatbox__button--back"]}`}
        >
          <ArrowBackOutlinedIcon className={styles["c-chatbox__button-icon"]} />
        </button>
        <div className={styles["c-chatbox__image-wrap"]}>
          <Image
            className={styles["c-chatbox__image"]}
            src="https://res.cloudinary.com/dppgyhery/image/upload/q_auto,w_150/v1635951217/unsplash/alex-suprun-ZHvM3XIOHoE-unsplash_uluxen.jpg"
            alt="user pic"
            width={36}
            height={36}
            //   placeholder="blur"
          />
        </div>
        <p className={styles["c-chatbox__name"]}>John Doe</p>
        <button
          className={`${styles["c-chatbox__button"]} ${styles["c-chatbox__button--align-right"]}`}
        >
          <MenuOpenOutlinedIcon className={styles["c-chatbox__button-icon"]} />
        </button>
      </div>
      <ul className={styles["c-chatbox__list"]}>
        <ChatTop />
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
        <button className={styles["c-chatbox__button"]}>
          <SendOutlinedIcon className={styles["c-chatbox__button-icon"]} />
        </button>
      </div>
    </div>
  );
}
