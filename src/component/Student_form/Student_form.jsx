import React, { useState } from "react";
import "./Student.css";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../Firebase/Firebase";
import { useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Student_form = () => {
  const [Name, setSelectName] = useState("");
  const [rollno, setSelectedRollNo] = useState("");
  const [email, setemail] = useState("");
  const [password, setSelectedPassword] = useState("");
  const [semester, setSelectedSemester] = useState("");
  const [Branch, setSelectedBranch] = useState("");
  const [pp, setSelectedPP] = useState(null);
  const [ten, setSelected10] = useState(null);
  const [twelve, setSelected12] = useState(null);
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
    setSelectName(e.target.value);
  };

  const handleSelectedRoll = (e) => {
    setSelectedRollNo(e.target.value);
  };

  const hamdleSubmitemail = (e) => {
    setemail(e.target.value);
  };

  const handleSelectedPassword = (e) => {
    setSelectedPassword(e.target.value);
  };

  const handleSelectedBranch = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleSelectedSemester = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleSelectedPP = (e) => {
    const file = e.target.files[0];
    setSelectedPP(file);
  };

  const handleSelected10 = (e) => {
    const file = e.target.files[0];
    setSelected10(file);
  };

  const handleSelected12 = (e) => {
    const file = e.target.files[0];
    setSelected12(file);
  };

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 90000000);
    return randomNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();

    const randomSixDigitNumber = generateRandomNumber();
    setSelectedRollNo(randomSixDigitNumber);


    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const [ppURL, tenURL, twelveURL] = await Promise.all([
        uploadAndGetURL(pp),
        uploadAndGetURL(ten),
        uploadAndGetURL(twelve),
      ]);

      const userData = {
        name: Name,
        rollNo: randomSixDigitNumber,
        email: email,
        semester: semester,
        branch: Branch,
        Role: "Student",
        profile: ppURL,
        ten_mark: tenURL,
        twelv_mark: twelveURL,
      };

      sendEmailVerification(auth.currentUser);
      console.log("send to your email");

      await setDoc(doc(db, "student", res.user.uid), userData);
      console.log("User registered successfully!");
      alert("verification Link sent to your mail");
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error.message);
    } finally {
      setLoading(false); 
    }
  };
  
  return (
    <div className="Student_form">
      {loading ? (
        <div className="loading-overlay"> LOADING..... </div>
      ) : (
        <div>
          <div className="greet">Welcome! Enter your Detail</div>
          <div className="form-details">
            <form onSubmit={handleSubmit}>
              <div className="form">
                <div className="first-half">
                  <div className="name">
                    <label>Name*</label>
                    <input
                      type="text"
                      placeholder="Enter your name "
                      value={Name}
                      onChange={handleSelectName}
                      required
                    />
                  </div>
                  <div className="rollno">
                    <label>Roll No*</label>
                    <input
                      type="text"
                      placeholder="This will generate automatically"
                      readOnly
                    />
                  </div>

                  <div className="email-student">
                    <label> Student Email* </label>
                    <input
                      type="email"
                      value={email}
                      onChange={hamdleSubmitemail}
                    />
                  </div>

                  <div className="password-student">
                    <label> Password* </label>
                    <input
                      type="password"
                      value={password}
                      onChange={handleSelectedPassword}
                    />
                  </div>

                  <div className="dropdown-option">
                    <div className="title">Select your semester* </div>
                    <select
                      className="DropDown"
                      value={semester}
                      onChange={handleSelectedSemester}
                    >
                      <option value="">Semester*</option>
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
                </div>
                <div className="sec-half">
                  <div className="Branch-root">
                    <div className="Branch"> enter your Branch* </div>

                    <select
                      className="option-Branch"
                      value={Branch}
                      onChange={handleSelectedBranch}
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

                  <div className="upload">
                    <label>upload your profile photo</label>
                    <input type="file" accept=".jpg" onChange={handleSelectedPP} />
                  </div>

                  <div className="upload-doc">
                    <label>upload your 10th class marksheet</label>
                    <input type="file" accept=".pdf" onChange={handleSelected10} />
                  </div>
                  <div className="upload-doc">
                    <label>upload your 12th class marksheet</label>
                    <input type="file" accept=".pdf" onChange={handleSelected12} />
                  </div>
                </div>
              </div>

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

export default Student_form;
