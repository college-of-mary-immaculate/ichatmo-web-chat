import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import ChatTop from "./ChatTop";
import Chat from "./Chat";
import Loader from "./Loader";
import ChatBoxHeader from "./ChatBoxHeader";
import useOnClickOutside from "../utils/useOnClickOutside";
import { useState, useEffect, useRef, useContext } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";
import { Picker } from "emoji-mart";
import styles from "./ChatBox.module.scss";

export default function ChatBox() {
  const {
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
  const [emojiToggle, setEmojiToggle] = useState(false);
  const textBoxRef = useRef(null);
  const pickerRef = useRef(null);
  const messagesEnd = useRef(null);
  const chatListBox = useRef(null);
  useOnClickOutside(pickerRef, () => setEmojiToggle());
  useEffect(() => textBoxRef.current.focus(), []);
  useEffect(() => socketHandler(), [selectedRoom]);
  useEffect(() => scrollToEnd(), [chatList]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    if (selectedRoom) {
      fetch(`/api/chats/${selectedRoom._id}`, { signal })
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
      if (signal && controller.abort) {
        controller.abort();
      }
    };
  }, [selectedRoom]);

  useEffect(() => {
    if (selectedRoom) {
      let name = "";
      let image = "";
      let username = "";
      let members = selectedRoom.members
        .filter((member) => member._id !== userInfo._id)
        .map((member) => member._id);

      if (selectedRoom.isGroup) {
        name = selectedRoom.groupName;
        image = selectedRoom.groupImage.url;
      } else if (selectedRoom.members[0]._id == selectedRoom.members[1]._id) {
        name = selectedRoom.members[0].fullname;
        image = selectedRoom.members[0].image.url;
        username = selectedRoom.members[0].username;
        members = [selectedRoom.members[0]._id];
      } else {
        for (let i = 0; i < selectedRoom.members.length; i++) {
          if (selectedRoom.members[i]._id != userInfo._id) {
            name = selectedRoom.members[i].fullname;
            image = selectedRoom.members[i].image.url;
            username = selectedRoom.members[i].username;
            break;
          }
        }
      }
      setRoomHeader({ name, image, username, members });
    }
  }, [selectedRoom]);

  function socketHandler() {
    const updater = (message) => {
      if (selectedRoom) {
        if (selectedRoom._id == message.room) {
          insertChat(message);
        }
      }
    };
    socket.on("message-receive", updater);

    return () => socket.off("message-receive", updater);
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

  function emojiSelectHandler(emoji) {
    const { native } = emoji;
    // console.log(native);
    textBoxRef.current.innerText = textBoxRef.current.innerText + native;
    setInputData(textBoxRef.current.innerText);
  }

  function inputChangeHandler(event) {
    setInputData(event.target.innerText);
  }

  function scrollToEnd() {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }

  const messageBubbles = chatList.map((message, index) => {
    // console.log(message);
    let isFromUser = message.sender.id == userInfo._id ? true : false;
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
            userPic={message.sender.image.url}
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
          userPic={message.sender.image.url}
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
      <ChatBoxHeader />
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
          <div
            ref={pickerRef}
            className={styles["c-chatbox__emoji-picker-wrap"]}
          >
            {emojiToggle && (
              <div className={styles["c-chatbox__emoji-picker"]}>
                <Picker
                  native={true}
                  // set="google"
                  // perLine={100}
                  color="dodgerblue"
                  style={{
                    backgroundColor: "#fefefe",
                    boxShadow: "0 0 4px rgba(0,0,0,0.25)",
                    border: "none",
                  }}
                  showPreview={false}
                  showSkinTones={false}
                  emojiTooltip={false}
                  skin={1}
                  emojiSize={24}
                  onSelect={emojiSelectHandler}
                />
              </div>
            )}
            <button
              className={`${styles["c-chatbox__button"]}`}
              onClick={() => setEmojiToggle((prev) => !prev)}
            >
              <InsertEmoticonRoundedIcon
                className={`${styles["c-chatbox__button-icon"]} ${styles["c-chatbox__button-icon--blue"]} ${styles["c-chatbox__button-icon--medium"]}`}
              />
            </button>
          </div>
        </div>
        <button className={styles["c-chatbox__button"]} onClick={handleSubmit}>
          <SendRoundedIcon
            className={`${styles["c-chatbox__button-icon"]} ${styles["c-chatbox__button-icon--blue"]}`}
          />
        </button>
      </div>
    </div>
  );
}
