import ConversationItem from "./ConversationItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import styles from "./ConversationList.module.scss";
import AddMenu from "./AddMenu";
import { ChatAppContext } from "../contexts/ChatApp.context";
import { useContext, useEffect, useState } from "react";
import Loader from "./Loader";

export default function ConversationList() {
  let {
    setConversations,
    conversationList,
    userInfo,
    setSelectedRoom,
    selectedRoom,
    socket,
  } = useContext(ChatAppContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(true);

  useEffect(() => socketHandler(), [socket]);
  useEffect(() => {
    fetch(`/api/rooms/users/${userInfo.id}`)
      .then((res) => res.json())
      .then((data) => {
        setConversations(data.rooms);
        if (!selectedRoom) {
          setSelectedRoom(data.rooms[0]);
          socket.emit("join-chat", { newRoom: data.rooms[0] });
        }
        setIsLoading(false);
        setIsUpdated(true);
      })
      .catch((err) => console.log(err));

    return () => {
      setConversations([]);
      setIsUpdated(true);
    };
  }, [isUpdated]);

  function socketHandler() {
    console.log(socket);
    socket.on("update-list", (updated) => {
      console.log("called");
      setIsUpdated(updated);
    });
  }

  const conversationItems = conversationList.map((conversation) => {
    let privateConvoReceiver = null;
    let latestChatSender = "";
    let latestChatBody = "";

    if (conversation.latestChat) {
      latestChatSender =
        conversation.latestChat.sender._id == userInfo.id
          ? "You"
          : conversation.latestChat.sender.firstname;
      latestChatBody = conversation.latestChat.body;
    }

    if (conversation.isGroup) {
      return (
        <ConversationItem
          key={conversation._id}
          name={conversation.groupName}
          image={conversation.groupImage}
          latestChatSender={latestChatSender}
          latestChatBody={latestChatBody}
          onclick={() => joinRoom(conversation)}
        />
      );
    }

    if (conversation.members[0]._id == conversation.members[1]._id) {
      return (
        <ConversationItem
          key={conversation._id}
          name={`(You) ${conversation.members[0].fullname}`}
          image={conversation.members[0].image}
          latestChatSender={latestChatSender}
          latestChatBody={latestChatBody}
          onclick={() => joinRoom(conversation)}
        />
      );
    }

    for (let i = 0; i < conversation.members.length; i++) {
      if (conversation.members[i]._id != userInfo.id) {
        privateConvoReceiver = conversation.members[i];
        break;
      }
    }

    return (
      <ConversationItem
        key={conversation._id}
        name={privateConvoReceiver.fullname}
        image={privateConvoReceiver.image}
        latestChatSender={latestChatSender}
        latestChatBody={latestChatBody}
        onclick={() => joinRoom(conversation)}
      />
    );
  });

  function joinRoom(room) {
    if (selectedRoom._id !== room._id) {
      console.log("rejoin");
      socket.emit("join-chat", { newRoom: room, oldRoom: selectedRoom });
      setSelectedRoom(room);
    }
  }

  return (
    <div className={styles["c-conversations"]}>
      <div className={styles["c-conversations__searchbar"]}>
        <div className={styles["c-conversations__searchbar-wrap"]}>
          <SearchRoundedIcon
            className={styles["c-conversations__searchbar-icon"]}
          />
          <input
            placeholder="Search conversations"
            className={styles["c-conversations__searchbar-input"]}
          ></input>
        </div>
      </div>
      <ul className={styles["c-conversations__tabs"]}>
        <li
          className={`${styles["c-conversations__tab-item"]} ${styles["c-conversations__tab-item--active"]}`}
        >
          All
        </li>
        <li className={styles["c-conversations__tab-item"]}>Private</li>
        <li className={styles["c-conversations__tab-item"]}>Group</li>
      </ul>
      <ul className={styles["c-conversations__list"]}>
        {isLoading && <Loader />}
        {/* {!conversationList.length && !isLoading ? (
          <li className={styles["c-conversations__empty"]}>
            You have no conversations
          </li>
        ) : null} */}
        {conversationItems}
      </ul>
      <AddMenu />
    </div>
  );
}
