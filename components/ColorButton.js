import styles from "./ColorButton.module.scss";

export default function ColorButton(props) {
  const buttonColor = {
    backgroundColor: props.color,
  };

  return (
    <li className={styles["c-color"]}>
      <button
        style={buttonColor}
        className={`${styles["c-color__button"]} ${
          styles["c-color__button--" + props.color]
        }`}
      ></button>
    </li>
  );
}
