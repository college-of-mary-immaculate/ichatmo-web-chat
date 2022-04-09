import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import styles from "./ChatMember.module.scss";
import Image from "next/image";
import { ChatAppContext } from "../contexts/ChatApp.context";
import useUserOnlineCheck from "../utils/useUserOnlineCheck";
import { useContext } from "react";

export default function ChatMember(props) {
  const { socket, userInfo } = useContext(ChatAppContext);
  const [isOnline] = useUserOnlineCheck(userInfo.id, props.userId, socket);

  return (
    <li className={styles["c-chat-member"]}>
      <div
        className={`${styles["c-chat-member__image-wrap"]} ${
          isOnline || userInfo.id == props.userId
            ? styles["c-chat-member__image-wrap--online"]
            : ""
        }`}
      >
        <Image
          className={styles["c-chat-member__image"]}
          src={props.image}
          alt="user pic"
          layout="fill"
          priority={true}
          //   placeholder="blur"
        />
      </div>
      <div className={styles["c-chat-member__innerwrap"]}>
        <p className={styles["c-chat-member__name"]}>{props.name}</p>
        {props.isAdmin && (
          <SupervisorAccountRoundedIcon
            className={styles["c-chat-member__admin-icon"]}
          />
        )}
      </div>
    </li>
  );
}
