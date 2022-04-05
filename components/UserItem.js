import styles from "./UserItem.module.scss";
import Image from "next/image";

export default function UserItem(props) {
  return (
    <li className={styles["c-user-item"]} role="button" onClick={props.onclick}>
      <div className={styles["c-user-item__image-wrap"]}>
        <Image
          className={styles["c-user-item__image"]}
          src={props.image}
          alt="user pic"
          layout="fill"
        />
      </div>
      <div className={styles["c-user-item__info-wrap"]}>
        <p className={styles["c-user-item__name"]}>{props.fullname}</p>
        <p className={styles["c-user-item__username"]}>{props.username}</p>
      </div>
    </li>
  );
}
