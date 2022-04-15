import Image from "next/image";
import styles from "./ChatMenu.module.scss";
import { useState, useContext } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";
import "emoji-mart/css/emoji-mart.css";
import ColorButton from "./ColorButton";
import sampleColors from "../lib/sample-color";
import ChatMember from "./ChatMember";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
// import dynamic from "next/dynamic";
// const Picker = dynamic(() => import("emoji-picker-react"), {
//   ssr: false,
// });

export default function ChatMenu() {
  const { roomHeader, selectedRoom, userInfo, toggleChatMenu } =
    useContext(ChatAppContext);

  const colorButtons = sampleColors.map((colorItem, index) => (
    <ColorButton key={index} color={colorItem.color} />
  ));

  async function deleteGroup() {
    await fetch(`/api/rooms/${selectedRoom._id}`, { method: "DELETE" }).then(
      (data) => console.log(data)
    );
  }

  const chatMembers =
    selectedRoom && selectedRoom.isGroup
      ? selectedRoom.members
          .sort((a, b) => a.fullname.localeCompare(b.fullname))
          .map((user) => {
            if (user.id == selectedRoom.groupAdmin._id) {
              return (
                <ChatMember
                  key={user._id}
                  userId={user.id}
                  name={user.fullname}
                  image={user.image.url}
                  isAdmin={true}
                />
              );
            }
            return (
              <ChatMember
                key={user._id}
                userId={user.id}
                name={user.fullname}
                image={user.image.url}
              />
            );
          })
      : null;

  return (
    <div className={styles["c-chat-menu"]}>
      <div className={styles["c-chat-menu__user"]}>
        <button
          className={styles["c-chat-menu__back-button"]}
          onClick={() => toggleChatMenu()}
        >
          <ArrowBackOutlinedIcon
            className={styles["c-chat-menu__back-button-icon"]}
          />
        </button>
        <div className={styles["c-chat-menu__image-wrap"]}>
          {roomHeader.image && (
            <Image
              className={styles["c-chat-menu__image"]}
              src={roomHeader.image}
              alt="user pic"
              layout="fill"
              priority={true}
              //   placeholder="blur"
            />
          )}
        </div>
        <h2 className={styles["c-chat-menu__name"]}>{roomHeader.name}</h2>
        {selectedRoom && !selectedRoom.isGroup ? (
          <p className={styles["c-chat-menu__username"]}>
            {roomHeader.username}
          </p>
        ) : null}
      </div>
      {selectedRoom && selectedRoom.isGroup ? (
        <ul className={styles["c-chat-menu__members"]}>{chatMembers}</ul>
      ) : null}
      {/* <div className={styles["c-chat-menu__option"]}>
        {/* <p className={styles["c-chat-menu__option-name"]}>Chat color</p>
        <ul className={styles["c-chat-menu__color-list"]}>{colorButtons}</ul> */}
      {/* <div className={styles["c-chat-menu__option"]}>
        {selectedRoom &&
        selectedRoom.isGroup &&
        userInfo._id == selectedRoom.groupAdmin._id ? (
          <button
            className={styles["c-chat-menu__delete-button"]}
            onClick={async () => await deleteGroup()}
          >
            Delete group
          </button>
        ) : null}
      </div> */}
    </div>
  );
}
