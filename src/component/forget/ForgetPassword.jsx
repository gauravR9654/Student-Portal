import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    try {
      if (email) {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent. Please check your email.");
        setSubmitted(true);
      } else {
        alert("Please enter your email address.");
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Email is not valid ");
    }
  };
  if (submitted) {
    return <Navigate to="/" />;
  }

  return (
    <div
      style={{
        display: "flex",
        marginTop: "100px",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        className="container-forget"
        style={{
          display: "flex",
          minWidth: "500px",
          minHeight: "200px",
          borderRadius: 10,
        }}
      >
        <form onSubmit={handleSubmit}>
          <h1 style={{ marginLeft: "140px", fontFamily: "cursive" }}>
            Forget Password
          </h1>
          <div style={{ marginTop: 20, marginLeft: "100px" }}>
            <label htmlFor="email" style={{ margin: "10px" }}>
              Email{" "}
            </label>
            <input
              type="email"
              name=""
              id="email"
              value={email}
              placeholder="enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ width: "300px", marginLeft: "10px" }}
            />
          </div>
          <button
            style={{
              height: "30px",
              width: "70px",
              borderRadius: "10px",
              cursor: "pointer",
              marginTop: "20px",
              marginLeft: "230px",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
