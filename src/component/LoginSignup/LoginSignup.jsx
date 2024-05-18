import React, { useEffect } from "react";
import "./LoginSignup.css";
import email_icon from "../assessts/images/email.jpg";
import password_icon from "../assessts/images/password.jpg";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/Firebase";
import photo from "../assessts/images/Login.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Authencation } from "../../context/Authencation";
import { doc, getDoc } from "firebase/firestore";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verify, setVerifyStatus] = useState(null);
  const navigate = useNavigate();

  const { dispatch } = useContext(Authencation);

  const handleButtonLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential) {
        throw new Error("Authentication failed");
      }

      const user = userCredential.user;

      if (!user.emailVerified) {
        throw new Error("Email not verified");
      }

      dispatch({ type: "LOGIN", payload: user });
      const userRole = await fetchUserRoleFromDatabase(user.uid);
      if (userRole === "Teacher") {
        navigate("/Teacher");
      } else if (userRole === "Student") {
        navigate("/Dashboard");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(error);
      console.error("Login failed with error code:", errorCode);
      console.error("Error message:", errorMessage);
    }
  };
  useEffect(() => {
    auth.onAuthStateChanged((userCredential) => {
      if (userCredential) {
        const { email, emailVerified } = userCredential;
        setVerifyStatus({ email, emailVerified });
      } else {
        setVerifyStatus(null);
      }
    });
  }, []);
  const fetchUserRoleFromDatabase = async (userId) => {
    try {
      const studentDoc = await getDoc(doc(db, "student", userId));
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        return studentData.Role;
      }
      const teacherDoc = await getDoc(doc(db, "teacher", userId));
      if (teacherDoc.exists()) {
        const teacherData = teacherDoc.data();
        return teacherData.Role;
      } else {
        throw new Error("User document not found");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      throw error;
    }
  };

  const handleButtonClick = () => {
    navigate("/Role");
  };

  const handleForgetPassword = () => {
    navigate("/Forget");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  return (
    <>
      <div className="login-conatiner">
        <div className="bg-image">
          <img src={photo} alt="" sx={{ height: "30%", width: "30%" }} />
        </div>
        <div className="container">
          <div className="header">
            <div className="text"> Log in </div>
            <div className="underline"></div>
          </div>
          <form>
            {" "}
            <div className="inputs">
              <div className="input">
                <img src={email_icon} alt="" width={20} height={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmail}
                  autoComplete="current-password" 

                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" width={20} height={20} />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={handlePassword}
                  autoComplete="current-password" 
                />
              </div>
            </div>{/* 
             {verify && (
            <div>
              <p>{verify?.emailVerified ? "true" : "false"}</p>

            </div>
          )}  */}
            <div className="forget-password">
              Forget password?
              <span onClick={handleForgetPassword}>click here</span>
            </div>

            {verify === false && (
              <div className="error">
                {alert ( "please verify email first")}
              </div>
            )}

            <div className="error">
              {error && <span>wrong password or information </span>}
            </div>
            <div className="submit-container">
              <button
                onClick={handleButtonLogin}
              >
                Log in
              </button>
            </div>
            <div className="acc">
              <span onClick={handleButtonClick}>Create a new Account</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default LoginSignup;
