import ConversationItem from "./ConversationItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import styles from "./ConversationList.module.scss";
import AddMenu from "./AddMenu";
import { ChatAppContext } from "../contexts/ChatApp.context";
import { useContext, useEffect } from "react";

export default function ConversationList() {
  const { setConversations, conversationList, userInfo } =
    useContext(ChatAppContext);

  useEffect(async () => {
    await fetch("/api/rooms");
  }, []);

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
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
      </ul>
      <AddMenu />
    </div>
  );
}
