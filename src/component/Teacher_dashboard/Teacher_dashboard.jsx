import { useState, useEffect } from "react";
import { Stack, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { Box, Typography } from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../Firebase/Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Grid from "@mui/material/Grid";
import Header from "../dashboard-topbar/Dashboard_topbar";
import user_icon from "../assessts/images/th.jpg";
import Slider from "./Teacher_Sidebar";
import Navbar from "../Navbar/Navbar";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import AttachFileIcon from "@mui/icons-material/AttachFile";

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

const Teacher_dashboard = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [announce, setAnnounce] = useState("");
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(""); 


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "teacher", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setBranch(userData.Branch);
          setSemester(userData.semester);
        } else {
          console.error("Teacher data not exist");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
      alert("Announcement has been send ");
      setAnnounce("");
      setFile(null);
    } catch (error) {
      console.error("Error adding announcement:", error);
      setError("Error adding announcement. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchstudentData = async () => {
      try {
        const q = query(
          collection(db, "student"),
          where("semester", "==", semester),
          where("branch", "==", branch)
        );

        const querySnapshot = await getDocs(q);
        const studentList = [];
        querySnapshot.forEach((doc) => {
          studentList.push({ id: doc.id, ...doc.data() });
        });
        setStudents(studentList);
      } catch (error) {
        console.error("error fetching student", error);
      }
    };
    fetchstudentData();
  }, [semester, branch]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <Box>
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
          m={"20px"}
        >
          {user && (
            <Header
              title="DASHBOARD"
              subtitle={
                <Typography>
                  {" "}
                  Welcome to your Account
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {user.name.toUpperCase()}
                  </span>
                </Typography>
              }
            />
          )}
        </Box>
      </Box>

      <Box>
        <Grid ml={8} mr={8}>
          <Stack spacing={7} direction="row">
            <Grid item xs={4}>
              <div className="con-1">
                <Card sx={{ width: 400, height: 400 }} elevation={20}>
                  <Typography sx={{ fontSize: 20, mb: 4 }}>
                    My Profile
                  </Typography>

                  <CardMedia
                    sx={{
                      height: 200,
                      width: 200,
                      ml: 12,
                      border: "solid black",
                      borderRadius: 10,
                    }}
                    image={user && user.profile ? user.profile : user_icon}
                  />
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontFamily:
                          '"Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif',
                      }}
                    >
                      NAME - {`${user.name.toUpperCase()}`}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily:
                          '"Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif',
                      }}
                    >
                      College - CU
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily:
                          '"Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif',
                      }}
                    >
                      Teacher Id -{`${user.teacherID}`}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </Grid>
            <Grid item xs={8}>
              <Card sx={{ width: 950, height: 400 }} elevation={20}>
                <Card sx={{ width: "100%", height: "100%" }}>
                  <Typography>Announcement</Typography>
                      
                    <Header
                      title="Announcement"
                      subtitle={<Typography>Create message</Typography>}
                    />
                   
                  <Box
                    style={{
                      display: "flex",
                      marginTop: "100px",
                      marginLeft: "50px",
                      width: "100%",
                    }}
                  > <form
                      style={{ margin: "10px", width: "90%", display: "flex" }}
                      onSubmit={handleSubmit}
                    >
                      <input
                        type="text"
                        placeholder="enter your message here"
                        style={{
                          padding: "10px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
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
                      {file && <span>{fileName}</span>}
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
                </Card>
              </Card>
            </Grid>
          </Stack>

          {/******************* 2 ROW **************/}

          <Box height={100} />

          <Stack spacing={2} direction="row">
            <Grid item xs={4}>
              <Card
                sx={{ width: 1400, height: 400, overflow: "auto" }}
                elevation={20}
              >
                <Card sx={{ width: "100%", height: "100%", overflow: "auto" }}>
                  <Typography>Student Details</Typography>

                  <Box m="20px">
                    <Typography variant="h5">
                      Students in {semester} semester, {branch} Branch:
                    </Typography>
                  </Box>

                  <CardContent>
                    <table
                      style={{
                        borderSpacing: "25px",
                        border: "1px solid black",
                        width: "100%",
                      }}
                    >
                      <thead>
                        <tr>
                          <th className="table-header">Name</th>
                          <th className="table-header">Roll No</th>
                          <th className="table-header"> email </th>
                          <th className="table-header">10th mark sheet </th>
                          <th className="table-header">12th mark sheet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.rollNo}</td>
                            <td>{student.email}</td>
                            <td>
                              <a
                                href={student.ten_mark}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download
                              </a>
                            </td>
                            <td>
                              {" "}
                              <a href={student.twelv_mark} target="_blank">
                                Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </Card>
            </Grid>
          </Stack>
          <Box height={100} />
        </Grid>
      </Box>
    </div>
  );
};

export default Teacher_dashboard;
