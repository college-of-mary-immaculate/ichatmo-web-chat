import Image from "next/image";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useRouter } from "next/router";
import styles from "./TopBar.module.scss";
import useOnClickOutside from "../utils/useOnClickOutside";
import { ChatAppContext } from "../contexts/ChatApp.context";
import { useContext, useState, useRef } from "react";

export default function TopBar() {
  const router = useRouter();
  const { userInfo, socket, toggleProfilePopup } = useContext(ChatAppContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownMenuRef = useRef(null);

  useOnClickOutside(dropdownMenuRef, () => setDropdownVisible(false));

  function signOut() {
    fetch("/api/auth/signout")
      .then(() => {
        socket.disconnect();
        router.push("/signin");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles["c-topbar"]}>
      <h1 className={styles["c-topbar__header"]}>Messages</h1>
      <div
        className={styles["c-topbar__user"]}
        onClick={() => setDropdownVisible((isVisible) => !isVisible)}
        ref={dropdownMenuRef}
      >
        <p className={styles["c-topbar__user-name"]}>{userInfo.firstname}</p>
        <div className={styles["c-topbar__user-pic-wrap"]}>
          {userInfo.image && (
            <Image
              className={styles["c-topbar__user-pic"]}
              src={userInfo.image.url}
              alt="user pic"
              layout="fill"
              priority={true}
            />
          )}
        </div>
        {dropdownVisible && (
          <ul className={styles["c-topbar__dropdown"]}>
            <li
              className={styles["c-topbar__dropdown-item"]}
              onClick={() => toggleProfilePopup()}
              role="button"
            >
              <AccountCircleRoundedIcon
                className={styles["c-topbar__dropdown-item-icon"]}
              />
              <p>Profile</p>
            </li>
            <li
              className={styles["c-topbar__dropdown-item"]}
              role="button"
              onClick={() => signOut()}
            >
              <LogoutRoundedIcon
                className={styles["c-topbar__dropdown-item-icon"]}
              />
              <p>Sign Out</p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
