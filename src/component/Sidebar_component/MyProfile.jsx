import React, { useEffect, useState } from "react";
import Sidebar from "../dashboard_sidebar/DashSidebar";
import Header from "../dashboard-topbar/Dashboard_topbar";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import user_icon from "../assessts/images/th.jpg";
import { db } from "../Firebase/Firebase";
import Navbar from "../Navbar/Navbar"

const MyProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "student", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
        } else {
          console.error("user data not found");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return;
  }

  return (
    <div>
      <Navbar />
      <Box m={5}>
        <Header title="Student Profile" subtitle="Here is your detail" />
      </Box>
      <Box m={5}>
        <CardMedia
          sx={{
            height: 200,
            width: 200,
            border: "solid black",
            borderRadius: 4,
            mt: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          image={user && user.profile ? user.profile : user_icon}
        />
        <Box>
          <Typography variant="h5" sx={{ m: "15px", flexDirection: "column" }}>
            NAME = {`${user.name.toUpperCase()}`}
          </Typography>

          <div className="underline" style={{ width: "100%" }}></div>

          <Typography variant="h5" sx={{ m: "15px" }}>
            Roll NO = {`${user.rollNo}`}
          </Typography>
          <div className="underline" style={{ width: "100%" }}></div>

          <Typography
            variant="h5"
            sx={{ m: "15px", fontFamily: "Lurial, sans-serif" }}
          >
            College = Team College
          </Typography>
          <div className="underline" style={{ width: "100%" }}></div>

          <Typography variant="h5" sx={{ m: "15px" }}>
            Semester = {`${user.semester}`}
          </Typography>
          <div className="underline" style={{ width: "100%" }}></div>

          <Typography variant="h5" sx={{ m: "15px" }}>
            Branch = {`${user.branch}`}
          </Typography>
          <div className="underline" style={{ width: "100%" }}></div>
        </Box>
      </Box>
    </div>
  );
};

export default MyProfile;
