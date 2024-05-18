import React, { createContext, useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../dashboard-topbar/Dashboard_topbar";
import user_icon from "../assessts/images/th.jpg";
import Grid from "@mui/material/Grid";
import Navbar from "../Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./DashBoard.css";

import { Stack, Card, CardContent, CardMedia } from "@mui/material";
import { Box, Button, Typography } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export const UserContext = createContext();

const DashBoard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [announce, setAnnouncement] = useState(null);
  const [semester, setSemester] = useState("");
  const [score, setScore] = useState("");
  const [totalGpa, setTotalGpa] = useState(0);
  const [branch, setbranch] = useState("");
  const [annsemester, setAnnSemester] = useState("");

  const handleGpa = (e) => {
    setScore(e.target.value);
  };

  const handleSemester = (e) => {
    setSemester(e.target.value);
  };

  const TotalGPA = (e) => {
    e.preventDefault();
    const Gpa = score / semester;
    setTotalGpa(Gpa);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "student", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          fetchStudentData(user);
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
      const docRef = doc(db, "student", studentID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setbranch(userData.Branch);
        setAnnSemester(userData.semester);
        const announceQuerySnapshot = await getDocs(
          query(
            collection(db, "announcements"),
            where("branch", "==", userData.branch),
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

  const fetchStudentData = async (user) => {
    try {
      if (!user) {
        console.log("NO User");
        return;
      }
      const Store = getFirestore();
      const studentRef = doc(Store, "student", user.uid);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setData(data);
      } else {
        console.log("NO Student Data Found");
      }
    } catch (error) {
      console.log("ERROR FETCHING STUDENT DATA :", error);
    }
  };

  if (!user) {
    return;
  }

  return (
    <>
      <UserContext.Provider value={user}>
        <Navbar />
        <Box m="20px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginLeft=" 35px"
          >
            {user && (
              <Header
                title="DASHBOARD"
                subtitle={
                  <Typography>
                    Welcome to your Account{" "}
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
          <Grid item ml={8} mr={8}>
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
                      component="img"
                      alt="user profile"
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
                        College - Team College
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily:
                            '"Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif',
                        }}
                      >
                        Roll NO - {`${user.rollNo}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
              <Grid item xs={8}>
                <Card sx={{ width: 900, height: 400 }} elevation={20}>
                  <Card
                    sx={{ width: "100%", height: "100%", overflow: "auto" }}
                  >
                    <Typography>Announcement</Typography>

                    <Box m="40px" maxHeight="400px">
                      {announce && announce.length > 0 ? (
                        announce.map((announcement, index) => (
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
                              <Typography variant="h5">
                                {announcement.title}
                              </Typography>
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
                </Card>
              </Grid>
            </Stack>

            {/******************* 2 ROW **************/}

            <Box height={100} />

            <Stack spacing={2} direction="row">
              <Grid item xs={4}>
                <Card sx={{ width: 650, height: 400 }} elevation={20}>
                  <Card sx={{ width: "100%", height: "100%" }}>
                    <Typography>Document</Typography>
                    <CardMedia>
                      {data && (
                        <Card
                          elevation={20}
                          sx={{ height: "100px", marginTop: "20px" }}
                        >
                          <CardContent>
                            <Typography variant="body1" m={4}>
                              Your Tenth Class marksheet
                              <a
                                href={data.ten_mark}
                                target="_blank"
                                rel="noreferrer"
                                style={{ float: "right", marginLeft: "10px" }}
                              >
                                Download
                              </a>
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </CardMedia>{" "}
                    <CardMedia>
                      {data && (
                        <Card
                          elevation={20}
                          sx={{ height: "100px", marginTop: "20px" }}
                        >
                          <CardContent>
                            <Typography variant="body1" m={4}>
                              Your Twelfth Class marksheet
                              <a
                                href={data.twelv_mark}
                                target="_blank"
                                rel="noreferrer"
                                style={{ float: "right", marginLeft: "10px" }}
                              >
                                Download
                              </a>
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </CardMedia>{" "}
                  </Card>
                </Card>
              </Grid>

              <Grid item xs={4}>
                <Card
                  sx={{ width: 650, height: 400, marginLeft: 5 }}
                  elevation={20}
                >
                  <Card sx={{ width: "100%", height: "100%" }}>
                    <Typography>GPA</Typography>
                    <form style={{ margin: "3px" }}>
                      <Box
                        style={{
                          display: "flex",
                          margin: "3px",
                          marginTop: "50px",
                        }}
                      >
                        <label htmlFor="grade">Enter your Total GPA</label>
                        <input
                          id="grade"
                          type="number"
                          value={score}
                          onChange={handleGpa}
                          placeholder="sum of Total Gpa"
                          max="80"
                          min="0"
                          step="0.01"
                          style={{
                            display: " flex  ",
                            marginLeft: "20px",
                            width: "100px",
                          }}
                        />
                        <Typography marginLeft={10} color="grey">
                          Enter grade less than 80{" "}
                        </Typography>
                      </Box>

                      <Box
                        style={{
                          display: "flex",
                          margin: "3px",
                          marginTop: "50px",
                        }}
                      >
                        <label htmlFor="semester">
                          Enter your Total Semester
                        </label>
                        <input
                          id="semester"
                          type="number"
                          value={semester}
                          onChange={handleSemester}
                          placeholder="No of semester"
                          max="8"
                          min="0"
                          step="0.01"
                          style={{
                            display: " flex  ",
                            marginLeft: "7px",
                            width: "100px",
                          }}
                        />
                        <Typography marginLeft={10} color="grey">
                          Enter semester less than 8{" "}
                        </Typography>
                      </Box>

                      <button
                        onClick={TotalGPA}
                        style={{
                          height: "40px",
                          marginLeft: "180px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          marginTop: "50px ",
                        }}
                      >
                        CALCULATE GPA
                      </button>
                    </form>

                    {semester !== "0" &&
                      semester <= "8" &&
                      score > "0" &&
                      score <= "80" && (
                        <Box
                          style={{
                            display: "flex",
                            margin: "30px",
                            marginLeft: "150px",
                          }}
                        >
                          <label htmlFor="semester">
                            Your Total GPA is ,
                            <span style={{ color: "red" }}>{totalGpa}</span>
                          </label>
                        </Box>
                      )}
                  </Card>
                </Card>
              </Grid>
            </Stack>
            <Box height={100} />
          </Grid>
        </Box>
        <Footer />
      </UserContext.Provider>
    </>
  );
};
export default DashBoard;
