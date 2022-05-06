import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles["navbar"]}>
      <Link href={"/"}>
        <a className={styles["navbar__logo"]}>
          IChat<span className={styles["navbar__logo--blue"]}>Mo</span>
        </a>
      </Link>
      <ul className={styles["navbar__list"]}>
        <li className={styles["navbar__item"]}>
          <Link href={"/login"}>
            <a
              className={`${styles["navbar__link"]} ${styles["navbar__link--no-fill"]}`}
            >
              Login
            </a>
          </Link>
        </li>
        <li className={styles["navbar__item"]}>
          <Link href={"/signup"}>
            <a className={styles["navbar__link"]}>Sign Up</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
