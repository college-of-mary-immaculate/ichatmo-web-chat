import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles["footer"]}>
      <p className={styles["footer__logo"]}>
        IChat<span className={styles["footer__logo--blue"]}>Mo</span>
      </p>
      <p className={styles["footer__copyright"]}>© IChatMo 2022</p>
    </footer>
  );
}
