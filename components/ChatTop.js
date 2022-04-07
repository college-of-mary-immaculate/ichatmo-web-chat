import Image from "next/image";
import styles from "./ChatTop.module.scss";

export default function ChatTop(props) {
  return (
    <li className={styles["c-chattop"]}>
      <div className={styles["c-chattop__image-wrap"]}>
        {props.image && (
          <Image
            className={styles["c-chattop__image"]}
            src={props.image}
            alt="user pic"
            width={100}
            height={100}
            //   placeholder="blur"
          />
        )}
      </div>
      <p className={styles["c-chattop__subtext"]}>
        This is the start of conversation with
      </p>
      <h2 className={styles["c-chattop__name"]}>{props.name}</h2>
    </li>
  );
}
