import ConversationList from "../components/ConversationList";
import ChatBox from "../components/ChatBox";
import TopBar from "../components/TopBar";
import styles from "../styles/Messages.module.scss";
import ChatMenu from "../components/ChatMenu";
import NewChatPopup from "../components/NewChatPopup";
import NewGroupPopup from "../components/NewGroupPopup";
import Head from "next/head";
// import io from "socket.io-client";
import { useContext, useEffect } from "react";
import { ChatAppContext, ChatAppProvider } from "../contexts/ChatApp.context";
import { getUserBasicInfo } from "../lib/user-queries";
import { verify } from "jsonwebtoken";

// let socket = null;

export async function getServerSideProps(context) {
  const { req } = context;
  const { cookies } = req;
  const jwt = cookies.chatjwt;
  const { userId } = verify(jwt, process.env.JWT_SECRET);
  const data = await getUserBasicInfo(userId);
  return {
    props: {
      data: data.userData,
    },
  };
}

export default function Messages({ data }) {
  const {
    setUserInfo,
    newChatPopupOpen,
    newGroupPopupOpen,
    socket,
    setActiveConversationsTab,
  } = useContext(ChatAppContext);
  useEffect(() => setUserInfo(data), []);
  useEffect(() => setActiveConversationsTab("all"), []);
  useEffect(() => socketHandler(), [socket]);

  async function socketHandler() {
    await fetch("/api/socket");
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.emit("startup", data.id);

    return () => {
      socket.disconnect();
    };
  }

  return (
    <div className={styles["l-container"]}>
      {newChatPopupOpen && <NewChatPopup />}
      {newGroupPopupOpen && <NewGroupPopup />}
      <Head>
        <title>Messages | NextChat</title>
      </Head>
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

Messages.getLayout = function getLayout(page) {
  return <ChatAppProvider>{page}</ChatAppProvider>;
};
