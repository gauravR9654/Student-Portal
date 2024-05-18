import React, { useEffect, useState } from "react";
import Header from "../dashboard-topbar/Dashboard_topbar";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const Announcement = () => {
  const [announce, setAnnouncement] = useState(null);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [branch, setbranch] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    const Auth = getAuth();
    const unsubscribe = onAuthStateChanged(Auth, async (user) => {
      if (user) {
        setUser(user);
        fetchannounce(user);
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
        setSemester(userData.semester);
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

  return (
    <div>
      <Box>
        <Navbar />
        <Header title="Announcement" subtitle="Here is latest news" />
      </Box>
      <Box m="40px" maxHeight="400px">
        {announce && announce.length > 0 ? (
          announce.map((announcement, index) => (
            <Card
              elevation={5}
              key={index}
              style={{ maxWidth: "100%", minHeight: "50px", margin: 40 }}
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
    </div>
  );
};

export default Announcement;
