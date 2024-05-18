import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Slider from "../Teacher_dashboard/Teacher_Sidebar";
import Navbar from "../Navbar/Navbar";
import Header from "../dashboard-topbar/Dashboard_topbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
} from "firebase/firestore";

import { db, storage } from "../Firebase/Firebase";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Define Announcement class
class Announcement {
  constructor(title, fileURL, branch, semester) {
    this.branch = branch;
    this.semester = semester;
    this.title = title;
    this.fileURL = fileURL;
    this.timestamp = new Date();
  }
  toObject() {
    return {
      semester: this.semester,
      branch: this.branch,
      title: this.title,
      fileURL: this.fileURL,
      timestamp: this.timestamp,
    };
  }
}

const Announce = () => {
  const [announce, setAnnounce] = useState("");
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState(null);
  const [Anbranch, setbranch] = useState("");
  const [annsemester, setAnnSemester] = useState("");
  const [fileName, setFileName] = useState(""); 

  const [announce1, setAnnouncement] = useState(null);

  useEffect(() => {
    const Auth = getAuth();
    const unsubscribe = onAuthStateChanged(Auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "teacher", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBranch(userData.Branch);
          setSemester(userData.semester);
          setUser(userData);
          fetchannounce(user);
        } else {
          console.error("user data not found");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchannounce = async (user) => {
    try {
      const studentID = user.uid;
      const docRef = doc(db, "teacher", studentID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setbranch(userData.Branch);
        setAnnSemester(userData.semester);
        const announceQuerySnapshot = await getDocs(
          query(
            collection(db, "announcements"),
            where("branch", "==", userData.Branch),
            where("semester", "==", userData.semester)
          )
        );

        const announcements = announceQuerySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          fileURL: doc.data().fileURL,
        }));
        setAnnouncement(announcements);
      } else {
        console.log("user data not found");
      }
    } catch (error) {
      console.error("error fetching announcement : ", error);
    }
  };

  const uploadAndGetURL = async (file) => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    try {
      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File upload successful. URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("File upload error:", error);
      return null;
    }
  };

  const handleSubmitFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleSubmitAnnounce = (e) => {
    setAnnounce(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fileURL = null;
    if (file) {
      fileURL = await uploadAndGetURL(file);
    }

    try {
      const announcement = new Announcement(
        announce,
        fileURL,
        branch,
        semester
      );

      const announcementsRef = collection(db, "announcements");
      await addDoc(announcementsRef, announcement.toObject());
      console.log("Announcement added successfully");
      setAnnounce("");
      setFile(null);
      setFileName("");
    } catch (error) {
      console.error("Error adding announcement:", error);
      setError("Error adding announcement. Please try again later.");
    }

    alert("announcement has been send");
  };

  if (!user) {
    return null;
  }

  const sortedAnnouncements = announce1
  ? announce1.slice().sort((a, b) => b.timestamp - a.timestamp)
  : [];

  return (
    <div>
      <Box
        display="inline-flex"
        alignItems="center"
        width="100%"
        position="relative"
      >
        <Box position="absolute" top="1" left="0" zIndex="1">
          <Slider />
        </Box>
        <Box flex="1">
          <Navbar />
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginLeft=" 35px"
        m="20px"
      >
        <Header
          title="Announcement"
          subtitle={
            <Typography variant="h5">
              Send a new message to all your students
            </Typography>
          }
        />
      </Box>
      <Card elevation={10} sx={{  marginLeft : 5, width : 1450 , maxHeight : 300, overflow : "auto"}}>
        {" "}
        <Box m="4px">
          {announce1 && sortedAnnouncements.length > 0 ? (
            sortedAnnouncements.map((announcement, index) => (
              <Card
                elevation={5}
                key={index}
                style={{
                  maxWidth: "100%",
                  minHeight: "50px",
                  margin: 40,
                }}
              >
                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5">{announcement.title}</Typography>
                  {announcement.fileURL && (
                    <Button
                      href={announcement.fileURL}
                      target="_blank"
                      variant="outlined"
                    >
                      Download File
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No announcements found</div>
          )}
        </Box>
      </Card>

      <Box
        style={{
          border: "solid black",
          display: "flex",
          margin: "20px",
          maxHeight: "450px",
        }}
      >
        <form
          style={{ margin: "10px", width: "90%", display: "flex" }}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="enter your message here"
            style={{
              padding: "10px",
              fontSize: "16px",
              margin: " 10px",
              borderRadius: "4px",
            }}
            value={announce}
            onChange={handleSubmitAnnounce}
          />
          <IconButton>
            <label htmlFor="file-upload">
              <AttachFileIcon />
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleSubmitFile}
            />
          </IconButton>
          {fileName && <span>{fileName}</span>}
          <button
            style={{
              width: "100px",
              borderRadius: "30px",
              height: "40px",
              marginTop: "10px",
              color: "",
              backgroundColor: "lightblue",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </Box>
    </div>
  );
};

export default Announce;
