import styles from "./Loader.module.scss";

export default function Loader() {
  return (
    <div className={styles["c-loader"]}>
      <div
        className={`${styles["c-loader__circle"]} ${styles["c-loader__circle--top"]}`}
      ></div>
      <div
        className={`${styles["c-loader__circle"]} ${styles["c-loader__circle--bottom"]}`}
      ></div>
    </div>
  );
}
