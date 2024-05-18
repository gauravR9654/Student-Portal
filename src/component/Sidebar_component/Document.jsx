import React, { useEffect, useState } from "react";
import Sidebar from "../dashboard_sidebar/DashSidebar";

import Header from "../dashboard-topbar/Dashboard_topbar";

import { Box, Card, Typography } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Navbar from "../Navbar/Navbar"


const Document = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const Auth = getAuth();
    const unsubscribe = onAuthStateChanged(Auth, async (user) => {
   
      if (user) {
        setUser(user);
        fetchstudentData(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchstudentData = async (user) => {
    try {
      if (!user) {
        console.log("NO user");
        return;
      }
      const firestore = getFirestore();
      const studentRef = doc(firestore, "student", user.uid);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setFile(data);
      } else {
        console.log("NO STUDENT DATA FOUND");
      }
    } catch (error) {
      console.log("ERROR FETCHING STUDENT DATA :", error);
    }
  };

  return (
    <div>
        <Navbar />
      <Box m="20px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginLeft=" 35px"
        >
          <Header title="Document" subtitle="This is your Document area " />
        </Box>
      </Box>
      <Box m={10}>
        <Card elevation={20} sx={{ display: "flex" }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            your Document
          </Typography>
        </Card>
        {file && (
          <Card elevation={20} sx={{ height: "100px", marginTop: "20px" }}>
            <Typography variant="h6" m={4}>
              <span>Your Tenth Class marksheet</span>
              <a
                href={file.ten_mark}
                target="_blank"
                style={{ float: "right", marginRight: " 100px" }}
              >
                Download
              </a>
            </Typography>
          </Card>
        )}

        {file && (
          <Card elevation={20} sx={{ height: "100px", marginTop: "20px" }}>
            <Typography variant="h6" m={4}>
              <span>Your 12th Class marksheet</span>
              <a
                href={file.twelv_mark}
                target="_blank"
                style={{ float: "right", marginRight: " 100px" }}
              >
                Download
              </a>
            </Typography>
          </Card>
        )}
      </Box>
    </div>
  );
};

export default Document;
