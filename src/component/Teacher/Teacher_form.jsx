import React, { useState } from "react";
import "./Teacher.css";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../Firebase/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Teacher_form = () => {
  const [Name, setName] = useState("");
  const [Teacher_id, setId] = useState("");
  const [semester, setSemester] = useState(" ");
  const [Branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setSelectedPassword] = useState("");
  const [error, setError] = useState("");
  const [semerror, setsemErr] = useState(false);
  const [pp, setSelectedPP] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const uploadAndGetURL = async (file, fileType) => {
    if (!file || !file.name) {
      console.log(`${fileType} is null`);
      return null;
    }

    const name = new Date().getTime() + file.name;
    console.log(name);

    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    try {
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);

      console.log(`${fileType} upload successful. URL:`, downloadURL);

      return downloadURL;
    } catch (error) {
      console.error(`${fileType} upload error:`, error);
      return null;
    }
  };

  const handleSelectName = (e) => {
    setName(e.target.value);
  };

  const handleSubmitemail = (e) => {
    setEmail(e.target.value);
  };

  const handleSelectedPassword = (e) => {
    setSelectedPassword(e.target.value);
  };

  const handleSelectedSemester = (e) => {
    setSemester(e.target.value);
  };

  const handleSelectedBranch = (e) => {
    setBranch(e.target.value);
  };

  const handleSelectedPP = (e) => {
    const file = e.target.files[0];
    setSelectedPP(file);
  };

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();

    const randomSixDigitNumber = generateRandomNumber();
    setId(randomSixDigitNumber);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const [ppURL] = await Promise.all([uploadAndGetURL(pp)]);
      const userData = {
        name: Name,
        email: email,
        password: password,
        teacherID: randomSixDigitNumber,
        semester: semester,
        Branch: Branch,
        profile: ppURL,
        Role: "Teacher",
      };
      
      sendEmailVerification(auth.currentUser);
      console.log("send to your email");

      await setDoc(doc(db, "teacher", res.user.uid), userData);
      console.log("user register successfully");
      alert("verification Link sent to your mail");
      navigate("/");
    } catch (error) {
      console.error("error registering user :", error.message);
      setError(error);
    }
  };
  return (
    <div className="Teacher-container">
      {loading ? (
        <div className="loading-overlay"> LOADING..... </div>
      ) : (
        <div>
          <div className="greet-teacher">Welcome to teacher form</div>
          <div className="form-details">
            <form onSubmit={handleSubmit}>
              <div className="half">
                <div className="name">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name "
                    value={Name}
                    onChange={handleSelectName}
                    required
                  />
                </div>

                <div className="email-teacher">
                  <label> Teacher Email </label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter your email "
                    onChange={handleSubmitemail}
                    required
                  />
                </div>

                <div className="password-student">
                  <label> Password </label>
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter your password "
                    onChange={handleSelectedPassword}
                    required
                  />
                </div>
              </div>
              <div className="sec">
                <div className="teacher">
                  <div className="upload">
                    <label>upload your profile photo</label>
                    <input
                      type="file"
                      accept=".jpg"
                      onChange={handleSelectedPP}
                    />
                  </div>
                </div>
                <div className="dropdown-option">
                  <div className="title">Select your semester</div>
                  <select
                    className="DropDown"
                    value={semester}
                    onChange={handleSelectedSemester}
                    required
                  >
                    <option value="">Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
                <div className="Branch-root">
                  <div className="Branch"> Enter your Branch </div>

                  <select
                    className="option-Branch"
                    value={Branch}
                    onChange={handleSelectedBranch}
                    required
                  >
                    <option value="">
                      ---------------Branch----------------
                    </option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics and Communication</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="IT">Information Technology</option>
                  </select>
                </div>
              </div>

              {error && (
                <span
                  style={{
                    marginLeft: "180px",
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  this Email is Already in use
                </span>
              )}

              <div className="submit-buttonform">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Teacher_form;
