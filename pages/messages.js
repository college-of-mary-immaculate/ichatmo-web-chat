import ConversationList from "../components/ConversationList";
import ChatBox from "../components/ChatBox";
import TopBar from "../components/TopBar";
import styles from "../styles/Messages.module.scss";
import ChatMenu from "../components/ChatMenu";
import NewChatPopup from "../components/NewChatPopup";
import NewGroupPopup from "../components/NewGroupPopup";
import ProfilePopup from "../components/ProfilePopup";
import Head from "next/head";
// import { io } from "socket.io-client";
import { useContext, useEffect } from "react";
import { ChatAppContext, ChatAppProvider } from "../contexts/ChatApp.context";
import { getUserBasicInfo } from "../lib/user-queries";
import { verify } from "jsonwebtoken";
import useMediaQuery from "@mui/material/useMediaQuery";

// let socket = null;

export async function getServerSideProps(context) {
  const { req } = context;
  const { cookies } = req;
  const jwt = cookies.chatjwt;
  const { userId } = verify(jwt, process.env.JWT_SECRET);
  const data = await getUserBasicInfo(userId);
  return {
    props: {
      data: JSON.parse(JSON.stringify(data.userData)),
    },
  };
}

export default function Messages({ data }) {
  const {
    setUserInfo,
    newChatPopupOpen,
    newGroupPopupOpen,
    profilePopupOpen,
    socket,
    setActiveConversationsTab,
    chatBoxOpen,
    chatMenuOpen,
  } = useContext(ChatAppContext);
  const matches = useMediaQuery("(min-width:1200px)");
  useEffect(() => setUserInfo(data), []);
  useEffect(() => setActiveConversationsTab("all"), []);
  useEffect(() => socket.emit("startup", data.id), []);

  // function socketHandler() {
  // }

  return (
    <div className={styles["l-container"]}>
      {profilePopupOpen && <ProfilePopup />}
      {newChatPopupOpen && <NewChatPopup />}
      {newGroupPopupOpen && <NewGroupPopup />}
      <Head>
        <title>Messages | IChatMo</title>
      </Head>
      <div className={styles["l-container__topbar"]}>
        <TopBar />
      </div>
      <div className={styles["l-container__conversations"]}>
        <ConversationList />
      </div>
      <div
        className={`${styles["l-container__chat-box"]} ${
          chatBoxOpen ? styles["l-container__chat-box--show"] : ""
        } ${
          !chatMenuOpen && matches ? styles["l-container__chat-box--full"] : ""
        }`}
      >
        <ChatBox />
      </div>
      <div
        className={`${styles["l-container__chat-menu"]} ${
          chatMenuOpen ? styles["l-container__chat-menu--show"] : ""
        }`}
      >
        <ChatMenu />
      </div>
    </div>
  );
}

Messages.getLayout = function getLayout(page) {
  return <ChatAppProvider>{page}</ChatAppProvider>;
};
