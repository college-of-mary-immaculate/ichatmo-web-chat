import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Form.module.scss";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = await fetch("/api/auth/signin", {
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = await data.json();
    console.log(result);

    if (result.isCredentials.user.ok && result.isCredentials.password.ok) {
      router.push("/messages");
    }
  }

  function handleInput(event) {
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
        <h1 className={styles["c-form__name"]}>Sign In</h1>
        {/* <p className={styles["c-form__text"]}>
          Welcome to NextChat! Login to start chattin!
        </p> */}
        <input
          className={styles["c-form__input"]}
          type="text"
          placeholder="Username or Email"
          name="user"
          onChange={handleInput}
          value={formData.user}
        ></input>
        <input
          className={styles["c-form__input"]}
          type="password"
          placeholder="Password"
          name="password"
          onInput={handleInput}
          value={formData.password}
        ></input>
        <button className={styles["c-form__button"]} type="submit">
          Sign In
        </button>
        <p className={styles["c-form__text"]}>
          Don't have an account?{" "}
          <Link href={"/signup"}>
            <a className={styles["c-form__text--link"]}>Sign Up</a>
          </Link>
        </p>
      </form>
    </div>
  );
}
