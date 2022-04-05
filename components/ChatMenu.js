import Image from "next/image";
import styles from "./ChatMenu.module.scss";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import ColorButton from "./ColorButton";
import { Picker } from "emoji-mart";
import sampleColors from "../lib/sample-color";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
// import dynamic from "next/dynamic";
// const Picker = dynamic(() => import("emoji-picker-react"), {
//   ssr: false,
// });

export default function ChatMenu() {
  const colorButtons = sampleColors.map((colorItem, index) => (
    <ColorButton key={index} color={colorItem.color} />
  ));

  return (
    <div className={styles["c-chat-menu"]}>
      <div className={styles["c-chat-menu__user"]}>
        <button className={styles["c-chat-menu__back-button"]}>
          <ArrowBackOutlinedIcon
            className={styles["c-chat-menu__back-button-icon"]}
          />
        </button>
        <div className={styles["c-chat-menu__image-wrap"]}>
          <Image
            className={styles["c-chat-menu__image"]}
            src="https://res.cloudinary.com/dppgyhery/image/upload/q_auto,w_150/v1635951217/unsplash/alex-suprun-ZHvM3XIOHoE-unsplash_uluxen.jpg"
            alt="user pic"
            width={100}
            height={100}
            //   placeholder="blur"
          />
        </div>
        <h2 className={styles["c-chat-menu__name"]}>Some Name</h2>
        <p className={styles["c-chat-menu__username"]}>someusername</p>
      </div>
      <div className={styles["c-chat-menu__option"]}>
        <p className={styles["c-chat-menu__option-name"]}>Chat color</p>
        <ul className={styles["c-chat-menu__color-list"]}>{colorButtons}</ul>
      </div>
      {/* <div className={styles["c-chat-menu__option"]}>
        <p className={styles["c-chat-menu__option-name"]}>Change emoji</p>
        <div className={styles["c-chat-menu__emoji-picker"]}>
          <Picker
            // native={true}
            set="google"
            emojiTooltip={false}
            // perLine={100}
            color="dodgerblue"
            style={{ border: "none" }}
            // emojiSize={36}
          />
        </div>
      </div> */}
    </div>
  );
}
