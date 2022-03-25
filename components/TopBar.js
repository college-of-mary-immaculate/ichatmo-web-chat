import Image from "next/image";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import styles from "./TopBar.module.scss";

export default function TopBar() {
  return (
    <div className={styles["c-topbar"]}>
      <h1 className={styles["c-topbar__header"]}>Messages</h1>
      <div className={styles["c-topbar__user"]}>
        <p className={styles["c-topbar__user-name"]}>John Doe</p>
        <Image
          className={styles["c-topbar__user-pic"]}
          src="https://res.cloudinary.com/dppgyhery/image/upload/q_auto,w_150/v1635951217/unsplash/alex-suprun-ZHvM3XIOHoE-unsplash_uluxen.jpg"
          alt="user pic"
          width={36}
          height={36}
          //   placeholder="blur"
        />
        <button className={styles["c-topbar__button"]}>
          <SettingsOutlinedIcon className={styles["c-topbar__icon"]} />
        </button>
      </div>
    </div>
  );
}
