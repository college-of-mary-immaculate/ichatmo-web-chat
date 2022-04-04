import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Form.module.scss";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = await fetch("/api/auth/signup", {
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    console.log(data.text);
    const result = await data.json();
    console.log(result);

    if (result.success) {
      router.push("/messages");
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
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleInputChange}
          className={styles["c-form__input"]}
          value={formData.username}
        ></input>
        <input
          type="text"
          placeholder="Firstname"
          name="firstname"
          onChange={handleInputChange}
          className={styles["c-form__input"]}
          value={formData.firstname}
        ></input>
        <input
          type="text"
          placeholder="Lastname"
          name="lastname"
          onChange={handleInputChange}
          className={styles["c-form__input"]}
          value={formData.lastname}
        ></input>
        <input
          type="email"
          placeholder="samplemail@mail.com"
          name="email"
          onChange={handleInputChange}
          className={styles["c-form__input"]}
          value={formData.email}
        ></input>
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleInputChange}
          className={styles["c-form__input"]}
          value={formData.password}
        ></input>
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
