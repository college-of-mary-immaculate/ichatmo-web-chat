import Image from "next/image";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useContext, useEffect, useState } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";
import useRoomOnlineCheck from "../utils/useRoomOnlineCheck";
import styles from "./ConversationItem.module.scss";

export default function ConversationItem(props) {
  // const [isOnline, setIsOnline] = useState(false);
  let { socket, userInfo } = useContext(ChatAppContext);
  const [isOnline] = useRoomOnlineCheck(userInfo.id, props.members, socket);

  // useEffect(() => socketHandler(), []);
  // useEffect(() => {
  //   socket.emit("online-check", {
  //     client: userInfo.id,
  //     toCheckIds: props.members,
  //   });
  // }, []);

  // function socketHandler() {
  //   const onlineUpdater = (id) => {
  //     if (props.members.includes(id)) {
  //       socket.emit("online-check", {
  //         client: userInfo.id,
  //         toCheckIds: props.members,
  //       });
  //     }
  //   };

  //   const onlineToggler = (result) => {
  //     if (JSON.stringify(result.toCheckIds) == JSON.stringify(props.members)) {
  //       setIsOnline(result.isOnline);
  //     }
  //   };

  //   socket.on("user-connect", onlineUpdater);
  //   socket.on("user-disconnect", onlineUpdater);
  //   socket.on("is-online", onlineToggler);

  //   return () => {
  //     socket.off("user-connect", onlineUpdater);
  //     socket.off("user-disconnect", onlineUpdater);
  //     socket.off("user-online", onlineToggler);
  //   };
  // }
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
