import Image from "next/image";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import styles from "./ConversationItem.module.scss";

export default function ConversationItem() {
  return (
    <li className={styles["c-conversations__item"]}>
      <div className={styles["c-conversations__image-wrap"]}>
        <Image
          className={styles["c-conversations__image"]}
          src="https://res.cloudinary.com/dppgyhery/image/upload/q_auto,w_150/v1635951217/unsplash/alex-suprun-ZHvM3XIOHoE-unsplash_uluxen.jpg"
          alt="user pic"
          layout="fixed"
          width={64}
          height={64}
          //   placeholder="blur"
        />
      </div>

      <div className={styles["c-conversations__innerwrap"]}>
        <p className={styles["c-conversations__name"]}>Some Name</p>
        <p className={styles["c-conversations__preview"]}>
          This is a sample message snippet
        </p>
      </div>
      <button className={styles["c-conversations__button"]}>
        <MoreVertOutlinedIcon />
      </button>
    </li>
  );
}
