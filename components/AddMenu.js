import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import styles from "./AddMenu.module.scss";
import useOnClickOutside from "../utils/useOnClickOutside";
import { ChatAppContext } from "../contexts/ChatApp.context";
import { useState, useRef, useContext } from "react";

export default function AddMenu() {
  const { toggleNewChatPopup, toggleNewGroupPopup } =
    useContext(ChatAppContext);
  const [open, setOpen] = useState(false);
  const elementRef = useRef(null);

  useOnClickOutside(elementRef, () => setOpen(false));

  function handleClick() {
    setOpen((isOpen) => !isOpen);
  }

  function toggleGroupCreatePopup() {
    toggleNewGroupPopup();
    setOpen(false);
  }

  function toggleChatCreatePopup() {
    toggleNewChatPopup();
    setOpen(false);
  }

  return (
    <div className={styles["c-add-menu"]} ref={elementRef}>
      <ul
        className={`${styles["c-add-menu__list"]} ${
          open ? styles["c-add-menu__list--open"] : ""
        }`}
      >
        <li className={styles["c-add-menu__item"]}>
          <button
            className={styles["c-add-menu__button"]}
            onClick={toggleChatCreatePopup}
          >
            <PersonAddAltRoundedIcon
              style={{ fontSize: 24 }}
              className={styles["c-add-menu__button-icon"]}
            />
          </button>
        </li>
        <li className={styles["c-add-menu__item"]}>
          <button
            className={styles["c-add-menu__button"]}
            onClick={toggleGroupCreatePopup}
          >
            <GroupAddRoundedIcon
              style={{ fontSize: 24 }}
              className={styles["c-add-menu__button-icon"]}
            />
          </button>
        </li>
      </ul>
      <button
        className={`${styles["c-add-menu__main-button"]} ${
          open ? styles["c-add-menu__main-button--rotate"] : ""
        }`}
        onClick={handleClick}
      >
        <AddRoundedIcon
          style={{ fontSize: 36 }}
          className={styles["c-add-menu__main-button-icon"]}
        />
      </button>
    </div>
  );
}
