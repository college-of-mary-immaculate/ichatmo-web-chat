import ConversationItem from "./ConversationItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import styles from "./ConversationList.module.scss";
import AddMenu from "./AddMenu";

export default function ConversationList() {
  return (
    <div className={styles["c-conversations"]}>
      <div className={styles["c-conversations__searchbar"]}>
        <div className={styles["c-conversations__searchbar-wrap"]}>
          <SearchRoundedIcon
            className={styles["c-conversations__searchbar-icon"]}
          />
          <input
            placeholder="Search conversations"
            className={styles["c-conversations__searchbar-input"]}
          ></input>
        </div>
      </div>
      <ul className={styles["c-conversations__tabs"]}>
        <li
          className={`${styles["c-conversations__tab-item"]} ${styles["c-conversations__tab-item--active"]}`}
        >
          All
        </li>
        <li className={styles["c-conversations__tab-item"]}>Private</li>
        <li className={styles["c-conversations__tab-item"]}>Group</li>
      </ul>
      <ul className={styles["c-conversations__list"]}>
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
      </ul>
      <AddMenu />
    </div>
  );
}
