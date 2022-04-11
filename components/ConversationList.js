import ConversationItem from "./ConversationItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import styles from "./ConversationList.module.scss";
import AddMenu from "./AddMenu";
import { ChatAppContext } from "../contexts/ChatApp.context";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useContext, useEffect, useState } from "react";
import Loader from "./Loader";

export default function ConversationList() {
  let {
    setConversations,
    emptyConversations,
    conversationList,
    userInfo,
    setSelectedRoom,
    selectedRoom,
    setRoomSearched,
    roomSearchedList,
    socket,
    activeConversationsTab,
    setActiveConversationsTab,
  } = useContext(ChatAppContext);

  const [isLoading, setIsLoading] = useState(true);
  const [searchedListVisible, setSearchedListVisible] = useState(false);
  const [inputData, setInputData] = useState("");

  useEffect(() => socketHandler(), [activeConversationsTab]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    if (userInfo.id) {
      fetch(`/api/rooms/${activeConversationsTab}`, {
        signal,
      })
        .then((res) => res.json())
        .then((data) => {
          emptyConversations();
          setConversations(data.rooms);
          if (!selectedRoom) {
            setSelectedRoom(data.rooms[0]);
            socket.emit("join-chat", { newRoom: data.rooms[0] });
          }
          setIsLoading(false);
          // setIsUpdated(true);
        })
        .catch((err) => console.log(err));
    }
    return () => {
      emptyConversations();
      if (signal && controller.abort) {
        controller.abort();
      }
    };
  }, [userInfo, activeConversationsTab]);
  useEffect(() => {
    if (inputData) {
      setIsLoading(true);
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(`/api/rooms/search/${activeConversationsTab}/${inputData}`, {
        signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setRoomSearched(data.rooms);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));

      return () => {
        setRoomSearched([]);
        if (signal && controller.abort) {
          controller.abort();
        }
      };
    }
  }, [inputData, activeConversationsTab]);

  function socketHandler() {
    const updater = (updatedRoom) => {
      if (updatedRoom.room.isGroup && activeConversationsTab == "group") {
        setConversations([updatedRoom.room]);
      } else if (
        !updatedRoom.room.isGroup &&
        activeConversationsTab == "private"
      ) {
        setConversations([updatedRoom.room]);
      } else if (activeConversationsTab == "all") {
        setConversations([updatedRoom.room]);
      }
    };
    socket.on("update-list", updater);

    return () => socket.off("update-list", updater);
  }

  function inputChangeHandler(event) {
    setInputData(event.target.value);
  }

  const conversationItems = createConversationItems(conversationList);

  const searchedItems = createConversationItems(roomSearchedList);

  function createConversationItems(conversations) {
    if (conversations) {
      return conversations.map((conversation) => {
        let privateConvoReceiver = null;
        let latestChatSender = "";
        let latestChatBody = "";
        let chatMembers = conversation.members
          .filter((member) => member._id !== userInfo.id)
          .map((member) => member._id);

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
              isGroup={true}
              members={chatMembers}
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
              isGroup={false}
              members={[conversation.members[0]._id]}
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
            isGroup={false}
            members={chatMembers}
            name={privateConvoReceiver.fullname}
            image={privateConvoReceiver.image}
            latestChatSender={latestChatSender}
            latestChatBody={latestChatBody}
            onclick={() => joinRoom(conversation)}
          />
        );
      });
    }
  }

  function joinRoom(room) {
    setSearchedListVisible(false);
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
            onChange={inputChangeHandler}
            onFocus={() => setSearchedListVisible(true)}
          ></input>
        </div>
        {searchedListVisible && (
          <button
            className={styles["c-conversations__close-searched-button"]}
            onClick={() => setSearchedListVisible(false)}
          >
            <CloseRoundedIcon
              className={styles["c-conversations__close-searched-button-icon"]}
            />
          </button>
        )}
      </div>
      <ul className={styles["c-conversations__tabs"]}>
        <li
          className={`${styles["c-conversations__tab-item"]} ${
            activeConversationsTab == "all"
              ? styles["c-conversations__tab-item--active"]
              : ""
          }`}
          role="button"
          onClick={() => setActiveConversationsTab("all")}
        >
          All
        </li>
        <li
          className={`${styles["c-conversations__tab-item"]} ${
            activeConversationsTab == "private"
              ? styles["c-conversations__tab-item--active"]
              : ""
          }`}
          role="button"
          onClick={() => setActiveConversationsTab("private")}
        >
          Private
        </li>
        <li
          className={`${styles["c-conversations__tab-item"]} ${
            activeConversationsTab == "group"
              ? styles["c-conversations__tab-item--active"]
              : ""
          }`}
          role="button"
          onClick={() => setActiveConversationsTab("group")}
        >
          Group
        </li>
      </ul>
      {isLoading && (
        <div className={styles["c-conversations__loader-bg"]}>
          <Loader />
        </div>
      )}
      {searchedListVisible ? (
        <ul className={styles["c-conversations__searched-list"]}>
          {searchedItems}
        </ul>
      ) : (
        <ul className={styles["c-conversations__list"]}>
          {/* {!conversationList.length && !isLoading ? (
        <li className={styles["c-conversations__empty"]}>
          You have no conversations
        </li>
      ) : null} */}
          {conversationItems}
        </ul>
      )}
      <AddMenu />
    </div>
  );
}
