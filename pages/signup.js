import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { useRouter } from "next/router";
import styles from "../styles/Form.module.scss";

const initialInputErrorState = {
  usernameExists: false,
  emailExists: false,
  passwordsNotMatch: false,
};

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [inputErrors, setInputErrors] = useState(initialInputErrorState);

  function handleSubmit(event) {
    event.preventDefault();
    setInputErrors({ ...initialInputErrorState });
    // setInputErrors((prev) => ({
    //   ...prev,
    //   passwordsNotMatch: !(formData.password == formData.confirmPassword),
    // }));

    if (formData.password !== formData.confirmPassword) {
      console.log("match");
      const { confirmPassword, ...formBody } = formData;
      console.log(formData);
      console.log("continue fetch");
      // fetch("/api/auth/signup", {
      //   body: JSON.stringify(formBody),
      //   headers: { "Content-Type": "application/json" },
      //   method: "POST",
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.success) {
      //       router.push("/messages");
      //     } else {
      //       if (data.existing.username) {
      //         setInputErrors((prev) => ({
      //           ...prev,
      //           usernameExists: true,
      //         }));
      //       }
      //       if (data.existing.email) {
      //         setInputErrors((prev) => ({
      //           ...prev,
      //           emailExists: true,
      //         }));
      //       }
      //     }
      //   })
      //   .catch((err) => console.log(err));
    } else {
      setInputErrors((prev) => ({
        ...prev,
        passwordsNotMatch: true,
      }));
    }
  }

  function handleInputChange(event) {
    const { value, name } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className={styles["l-form"]}>
      <Head>
        <title>Sign Up | IChatMo</title>
      </Head>
      <form onSubmit={handleSubmit} className={styles["c-form"]}>
        <h1 className={styles["c-form__name"]}>Sign Up</h1>
        <div className={styles["c-form__input-wrap"]}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleInputChange}
            className={styles["c-form__input"]}
            value={formData.username}
            required={true}
          ></input>
          {inputErrors.usernameExists && (
            <div className={styles["c-form__input-error-wrap"]}>
              <p className={`${styles["c-form__error"]}`}>
                <span className={styles["c-form__error-icon-wrap"]}>
                  <ErrorRoundedIcon className={styles["c-form__error-icon"]} />
                </span>{" "}
                Username already exists
              </p>
            </div>
          )}
        </div>
        <div className={styles["c-form__input-wrap"]}>
          <input
            type="text"
            placeholder="Firstname"
            name="firstname"
            onChange={handleInputChange}
            className={styles["c-form__input"]}
            value={formData.firstname}
            required={true}
          ></input>
        </div>
        <div className={styles["c-form__input-wrap"]}>
          <input
            type="text"
            placeholder="Lastname"
            name="lastname"
            onChange={handleInputChange}
            className={styles["c-form__input"]}
            value={formData.lastname}
            required={true}
          ></input>
        </div>
        <div className={styles["c-form__input-wrap"]}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
            className={styles["c-form__input"]}
            value={formData.email}
            required={true}
          ></input>
          {inputErrors.emailExists && (
            <div className={styles["c-form__input-error-wrap"]}>
              <p className={`${styles["c-form__error"]}`}>
                <span className={styles["c-form__error-icon-wrap"]}>
                  <ErrorRoundedIcon className={styles["c-form__error-icon"]} />
                </span>{" "}
                Email already exists
              </p>
            </div>
          )}
        </div>
        <div className={styles["c-form__input-wrap"]}>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            className={styles["c-form__input"]}
            value={formData.password}
            required={true}
          ></input>
        </div>
        <div className={styles["c-form__input-wrap"]}>
          <input
            type="password"
            placeholder="Re-enter Password"
            name="confirmPassword"
            onChange={handleInputChange}
            className={styles["c-form__input"]}
            value={formData.confirmPassword}
            required={true}
          ></input>
          {inputErrors.passwordsNotMatch && (
            <div className={styles["c-form__input-error-wrap"]}>
              <p className={`${styles["c-form__error"]}`}>
                <span className={styles["c-form__error-icon-wrap"]}>
                  <ErrorRoundedIcon className={styles["c-form__error-icon"]} />
                </span>{" "}
                Passwords do not match
              </p>
            </div>
          )}
        </div>
        <button type="submit" className={styles["c-form__button"]}>
          Sign Up
        </button>
        <p className={styles["c-form__text"]}>
          Already have an account?{" "}
          <Link href={"/signin"}>
            <a className={styles["c-form__text--link"]}>Sign In</a>
          </Link>
        </p>
      </form>
    </div>
  );
}
