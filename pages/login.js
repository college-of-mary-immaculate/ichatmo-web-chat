import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Form.module.scss";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import Head from "next/head";
import Link from "next/link";
import NavLayout from "../components/Layouts/NavLayout";
import Loader from "../components/Loader";

const initialInputErrorState = {
  userError: false,
  passwordError: false,
};

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState(initialInputErrorState);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    setInputErrors({ ...initialInputErrorState });
    setIsLoading(true);
    fetch("/api/auth/signin", {
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isCredentials.user.ok && data.isCredentials.password.ok) {
          router.push("/messages");
        } else {
          setIsLoading(false);
          if (!data.isCredentials.user.ok) {
            setInputErrors((prev) => ({
              ...prev,
              userError: true,
            }));
          } else if (!data.isCredentials.password.ok) {
            setInputErrors((prev) => ({
              ...prev,
              passwordError: true,
            }));
          }
        }
      })
      .catch((err) => console.log(err));
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
        <title>Sign In | IChatMo</title>
      </Head>
      <form className={styles["c-form"]} onSubmit={handleSubmit}>
        <h1 className={styles["c-form__name"]}>Login</h1>
        <div className={styles["c-form__input-wrap"]}>
          <input
            type="text"
            placeholder="Username or Email"
            name="user"
            onChange={handleInputChange}
            className={styles["c-form__input"]}
            value={formData.user}
            required={true}
          ></input>
          {inputErrors.userError && (
            <div className={styles["c-form__input-error-wrap"]}>
              <p className={`${styles["c-form__error"]}`}>
                <span className={styles["c-form__error-icon-wrap"]}>
                  <ErrorRoundedIcon className={styles["c-form__error-icon"]} />
                </span>{" "}
                Cannot find the email or phone specified, consider signing up!
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
          {inputErrors.passwordError && (
            <div className={styles["c-form__input-error-wrap"]}>
              <p className={`${styles["c-form__error"]}`}>
                <span className={styles["c-form__error-icon-wrap"]}>
                  <ErrorRoundedIcon className={styles["c-form__error-icon"]} />
                </span>{" "}
                Incorrect Password
              </p>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className={styles["c-form__loader-wrap"]}>
            <Loader size={32} />
          </div>
        ) : (
          <button className={styles["c-form__button"]} type="submit">
            Login
          </button>
        )}
        <p className={styles["c-form__text"]}>
          Don&apos;t have an account?{" "}
          <Link href={"/signup"}>
            <a className={styles["c-form__text--link"]}>Sign Up</a>
          </Link>
        </p>
      </form>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
