import Image from "next/image";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useContext } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";
import useRoomOnlineCheck from "../utils/useRoomOnlineCheck";
import styles from "./ConversationItem.module.scss";

export default function ConversationItem(props) {
  const { socket, userInfo } = useContext(ChatAppContext);
  const [isOnline] = useRoomOnlineCheck(userInfo._id, props.members, socket);

  return (
    <li className={styles["c-conversations__item"]} onClick={props.onclick}>
      <div
        className={`${styles["c-conversations__image-wrap"]} ${
          isOnline ? styles["c-conversations__image-wrap--online"] : ""
        }`}
      >
        <Image
          className={styles["c-conversations__image"]}
          src={props.image}
          alt="user pic"
          layout="fill"
          priority={true}
          //   placeholder="blur"
        />
      </div>
      <div
        className={`${styles["c-conversations__innerwrap"]} ${
          !props.latestChatBody
            ? styles["c-conversations__innerwrap--center"]
            : ""
        }`}
      >
        <p className={styles["c-conversations__name"]}>{props.name}</p>
        {props.latestChatBody && (
          <p className={styles["c-conversations__preview"]}>
            {props.latestChatSender}: {props.latestChatBody}
          </p>
        )}
      </div>
      {/* <button className={styles["c-conversations__button"]}>
        <MoreVertOutlinedIcon />
      </button> */}
    </li>
  );
}
