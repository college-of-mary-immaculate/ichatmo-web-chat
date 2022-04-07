import Image from "next/image";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import styles from "./ConversationItem.module.scss";

export default function ConversationItem(props) {
  return (
    <li className={styles["c-conversations__item"]} onClick={props.onclick}>
      <div className={styles["c-conversations__image-wrap"]}>
        <Image
          className={styles["c-conversations__image"]}
          src={props.image}
          alt="user pic"
          layout="fixed"
          width={64}
          height={64}
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
