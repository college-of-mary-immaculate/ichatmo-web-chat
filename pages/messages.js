import ConversationList from "../components/ConversationList";
import ChatBox from "../components/ChatBox";
import TopBar from "../components/TopBar";
import styles from "../styles/Messages.module.scss";
import ChatMenu from "../components/ChatMenu";

export default function Messages() {
  return (
    <div className={styles["l-container"]}>
      <div className={styles["l-container__topbar"]}>
        <TopBar />
      </div>
      <div className={styles["l-container__conversations"]}>
        <ConversationList />
      </div>
      <div className={styles["l-container__chat-box"]}>
        <ChatBox />
      </div>
      <div className={styles["l-container__chat-menu"]}>
        <ChatMenu />
      </div>
    </div>
  );
}
