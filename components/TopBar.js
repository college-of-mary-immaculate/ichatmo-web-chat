import Image from "next/image";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import styles from "./TopBar.module.scss";
import { ChatAppContext } from "../contexts/ChatApp.context";
import { useContext, useEffect, useState } from "react";

export default function TopBar() {
  const { userInfo } = useContext(ChatAppContext);
  // const [barUserInfo, setBarUserInfo] = useState(userInfo);
  // console.log(userInfo);
  return (
    <div className={styles["c-topbar"]}>
      <h1 className={styles["c-topbar__header"]}>Messages</h1>
      <div className={styles["c-topbar__user"]}>
        <p className={styles["c-topbar__user-name"]}>{userInfo.firstname}</p>
        <div className={styles["c-topbar__user-pic-wrap"]}>
          {userInfo.image && (
            <Image
              className={styles["c-topbar__user-pic"]}
              src={userInfo.image}
              alt="user pic"
              layout="fill"
              // width={36}
              // height={36}
              //   placeholder="blur"
            />
          )}
        </div>
        <button className={styles["c-topbar__button"]}>
          <SettingsOutlinedIcon className={styles["c-topbar__icon"]} />
        </button>
      </div>
    </div>
  );
}
