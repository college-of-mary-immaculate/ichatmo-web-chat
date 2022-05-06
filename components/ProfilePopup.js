import { useState, useContext, useRef, useEffect } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";
import styles from "./ProfilePopup.module.scss";
import Loader from "./Loader";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import useOnClickOutside from "../utils/useOnClickOutside";
import Image from "next/image";
import { useFilePicker } from "use-file-picker";

const initialInputErrorState = {
  emailExists: false,
  usernameExists: false,
  passwordIncorrect: false,
  passwordNotMatch: false,
};

export default function ProfilePopup() {
  const { userInfo, toggleProfilePopup, setUserInfo } =
    useContext(ChatAppContext);
  const popupRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [inputErrors, setInputErrors] = useState(initialInputErrorState);
  const [formBody, setFormBody] = useState({
    image: { id: userInfo.image.id, url: userInfo.image.url },
    username: userInfo.username,
    firstname: userInfo.firstname,
    lastname: userInfo.lastname,
    email: userInfo.email,
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });

  useOnClickOutside(popupRef, () => {
    if (!isLoading) {
      toggleProfilePopup();
    }
  });

  function handleInputChange(event) {
    setSaveDisabled(false);
    const { name, value } = event.target;
    setFormBody((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (filesContent.length) {
      setFormBody((prev) => ({
        ...prev,
        image: { ...prev.image, url: filesContent[0].content },
      }));
      setSaveDisabled(false);
    }
  }, [filesContent]);

  function saveChanges(event) {
    event.preventDefault();
    setInputErrors({ ...initialInputErrorState });
    setIsLoading(true);
    if (formBody.newPassword) {
      setInputErrors((prev) => ({
        ...prev,
        passwordNotMatch: formBody.newPassword !== formBody.confirmPassword,
      }));
    }

    if (!inputErrors.passwordNotMatch) {
      const asArray = Object.entries(formBody);
      const filtered = asArray.filter(([key, value]) => {
        if (key == "image") {
          if (value.url == userInfo.image.url) {
            return false;
          }
        }
        if (key == "username") {
          if (value == userInfo.username) {
            return false;
          }
        }
        if (key == "email") {
          if (value == userInfo.email) {
            return false;
          }
        }
        if (key == "password" || key == "newPassword") {
          if (value == "") {
            return false;
          }
        }
        if (key == "confirmPassword") {
          return false;
        }

        return true;
      });

      const filteredBody = Object.fromEntries(filtered);

      fetch(`/api/users/${userInfo._id}`, {
        method: "POST",
        body: JSON.stringify(filteredBody),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserInfo(data.updatedInfo);
            setSaveDisabled(true);
          } else {
            if (data.field == "username") {
              setInputErrors((prev) => ({
                ...prev,
                usernameExists: data.exists,
              }));
            } else if (data.field == "email") {
              setInputErrors((prev) => ({
                ...prev,
                emailExists: data.exists,
              }));
            } else if (data.field == "password") {
              setInputErrors((prev) => ({
                ...prev,
                passwordIncorrect: !data.match,
              }));
            }
          }
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className={styles["c-user-popup"]}>
      {isLoading && (
        <div className={styles["c-user-popup__loader-bg"]}>
          <div className={styles["c-user-popup__loader"]}>
            <div className={styles["c-user-popup__loader-wrap"]}>
              <Loader size={64} />
            </div>
            <p className={styles["c-user-popup__loader-text"]}>
              Saving changes...
            </p>
          </div>
        </div>
      )}
      <div ref={popupRef} className={styles["c-user-popup__wrap"]}>
        <div
          className={`${styles["c-user-popup__inner-wrap"]} ${styles["c-user-popup__inner-wrap--space-between"]}`}
        >
          <h2>Profile Settings</h2>
          <button
            className={styles["c-user-popup__close-button"]}
            onClick={() => toggleProfilePopup()}
          >
            <CloseRoundedIcon />
          </button>
        </div>
        <form className={styles["c-user-popup__form"]} onSubmit={saveChanges}>
          <div
            className={`${styles["c-user-popup__inner-wrap"]} ${styles["c-user-popup__inner-wrap--column"]} ${styles["c-user-popup__inner-wrap--center"]}`}
          >
            <div className={styles["c-user-popup__image-selector-wrap"]}>
              <span className={styles["c-user-popup__icon-wrap"]}>
                <EditRoundedIcon
                  className={styles["c-user-popup__image-selector-icon"]}
                />
              </span>
              <button
                type="button"
                className={styles["c-user-popup__image-selector-button"]}
                onClick={() => openFileSelector()}
              >
                {formBody.image && (
                  <Image
                    className={styles["c-user-popup__image"]}
                    src={formBody.image.url}
                    alt="user image"
                    layout="fill"
                  />
                )}
              </button>
            </div>
            {errors.length ? (
              <div className={styles["c-user-popup__image-errors-wrap"]}>
                <p
                  className={`${styles["c-user-popup__error"]} ${styles["c-user-popup__error--centered"]}`}
                >
                  <span className={styles["c-user-popup__error-icon-wrap"]}>
                    <ErrorRoundedIcon
                      className={styles["c-user-popup__error-icon"]}
                    />
                  </span>
                  {errors[0].fileSizeToolarge &&
                    "File is too large, please choose a file that is less than 3mb"}
                  {errors[0].readerError &&
                    "Problem occured while reading file!"}
                  {errors[0].maxLimitExceeded && "Too many files"}
                </p>
              </div>
            ) : null}
            <div className={styles["c-user-popup__names-wrap"]}>
              <h2>{userInfo.fullname}</h2>
              <p className={styles["c-user-popup__username"]}>
                {userInfo.username}
              </p>
            </div>
          </div>
          <div
            className={`${styles["c-user-popup__inner-wrap"]} ${styles["c-user-popup__inner-wrap--column"]}`}
          >
            <h3 className={styles["c-user-popup__field-name"]}>
              Account Information
            </h3>
            <div className={styles["c-user-popup__input-wrap"]}>
              <label
                className={styles["c-user-popup__input-label"]}
                htmlFor="username"
              >
                Username:
              </label>
              <input
                className={styles["c-user-popup__input"]}
                value={formBody.username}
                name="username"
                type="text"
                required={true}
                onChange={handleInputChange}
              ></input>
              {inputErrors.usernameExists && (
                <div className={styles["c-user-popup__input-error-wrap"]}>
                  <p className={`${styles["c-user-popup__error"]}`}>
                    <span className={styles["c-user-popup__error-icon-wrap"]}>
                      <ErrorRoundedIcon
                        className={styles["c-user-popup__error-icon"]}
                      />
                    </span>{" "}
                    Username already exists
                  </p>
                </div>
              )}
            </div>
            <div className={styles["c-user-popup__input-wrap"]}>
              <label
                className={styles["c-user-popup__input-label"]}
                htmlFor="firstname"
              >
                Firstname:
              </label>
              <input
                className={styles["c-user-popup__input"]}
                value={formBody.firstname}
                name="firstname"
                type="text"
                required={true}
                onChange={handleInputChange}
              ></input>
            </div>
            <div className={styles["c-user-popup__input-wrap"]}>
              <label
                className={styles["c-user-popup__input-label"]}
                htmlFor="lastname"
              >
                Lastname:
              </label>
              <input
                className={styles["c-user-popup__input"]}
                value={formBody.lastname}
                name="lastname"
                type="text"
                required={true}
                onChange={handleInputChange}
              ></input>
            </div>
            <div className={styles["c-user-popup__input-wrap"]}>
              <label
                className={styles["c-user-popup__input-label"]}
                htmlFor="email"
              >
                Email:
              </label>
              <input
                className={styles["c-user-popup__input"]}
                value={formBody.email}
                name="email"
                type="email"
                required={true}
                onChange={handleInputChange}
              ></input>
              {inputErrors.emailExists && (
                <div className={styles["c-user-popup__input-error-wrap"]}>
                  <p className={`${styles["c-user-popup__error"]}`}>
                    <span className={styles["c-user-popup__error-icon-wrap"]}>
                      <ErrorRoundedIcon
                        className={styles["c-user-popup__error-icon"]}
                      />
                    </span>{" "}
                    Email already exists
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            className={`${styles["c-user-popup__inner-wrap"]} ${styles["c-user-popup__inner-wrap--column"]}`}
          >
            <h3 className={styles["c-user-popup__field-name"]}>
              Change Password
            </h3>
            <div className={styles["c-user-popup__input-wrap"]}>
              <label
                className={styles["c-user-popup__input-label"]}
                htmlFor="password"
              >
                Current Password:
              </label>
              <input
                className={styles["c-user-popup__input"]}
                value={formBody.password}
                name="password"
                type="password"
                required={
                  formBody.password ||
                  formBody.newPassword ||
                  formBody.confirmPassword
                    ? true
                    : false
                }
                onChange={handleInputChange}
              ></input>
              {inputErrors.passwordIncorrect && (
                <div className={styles["c-user-popup__input-error-wrap"]}>
                  <p className={`${styles["c-user-popup__error"]}`}>
                    <span className={styles["c-user-popup__error-icon-wrap"]}>
                      <ErrorRoundedIcon
                        className={styles["c-user-popup__error-icon"]}
                      />
                    </span>{" "}
                    Incorrect password
                  </p>
                </div>
              )}
            </div>
            <div className={styles["c-user-popup__input-wrap"]}>
              <label
                className={styles["c-user-popup__input-label"]}
                htmlFor="newPassword"
              >
                New Password:
              </label>
              <input
                className={styles["c-user-popup__input"]}
                name="newPassword"
                type="password"
                value={formBody.newPassword}
                required={
                  formBody.password ||
                  formBody.newPassword ||
                  formBody.confirmPassword
                    ? true
                    : false
                }
                onChange={handleInputChange}
              ></input>
            </div>
            <div className={styles["c-user-popup__input-wrap"]}>
              <label
                className={styles["c-user-popup__input-label"]}
                htmlFor="confirmPassword"
              >
                Re-enter Password:
              </label>
              <input
                className={styles["c-user-popup__input"]}
                name="confirmPassword"
                type="password"
                required={
                  formBody.password ||
                  formBody.newPassword ||
                  formBody.confirmPassword
                    ? true
                    : false
                }
                onChange={handleInputChange}
              ></input>
              {inputErrors.passwordNotMatch && (
                <div className={styles["c-user-popup__input-error-wrap"]}>
                  <p className={`${styles["c-user-popup__error"]}`}>
                    <span className={styles["c-user-popup__error-icon-wrap"]}>
                      <ErrorRoundedIcon
                        className={styles["c-user-popup__error-icon"]}
                      />
                    </span>{" "}
                    Passwords do not match
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            className={`${styles["c-user-popup__inner-wrap"]} ${styles["c-user-popup__inner-wrap--center"]}`}
          >
            <button
              type="submit"
              disabled={saveDisabled}
              className={`${styles["c-user-popup__button"]} ${styles["c-user-popup__button--filled"]}`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
