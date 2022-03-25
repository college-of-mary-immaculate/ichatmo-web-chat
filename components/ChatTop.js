import Image from "next/image";
import styles from "./ChatTop.module.scss";

export default function ChatTop() {
  return (
    <li className={styles["c-chattop"]}>
      <div className={styles["c-chattop__image-wrap"]}>
        <Image
          className={styles["c-chattop__image"]}
          src="https://res.cloudinary.com/dppgyhery/image/upload/q_auto,w_150/v1635951217/unsplash/alex-suprun-ZHvM3XIOHoE-unsplash_uluxen.jpg"
          alt="user pic"
          width={100}
          height={100}
          //   placeholder="blur"
        />
      </div>
      <p className={styles["c-chattop__subtext"]}>
        This is the start of conversation with
      </p>
      <h2 className={styles["c-chattop__name"]}>Some Name</h2>
    </li>
  );
}
