import React, { useContext, useEffect, useState } from "react";
import "./DashBoard_sidebar.css";
import { Drawer, Box, Typography, IconButton, MenuItem } from "@mui/material";
import user_icon from "../assessts/images/th.jpg";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CampaignIcon from "@mui/icons-material/Campaign";
import { UserContext } from "../DashBoard/DashBoard";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export default function DashBoard() {
  const Item = ({ title, to, icon, selected, setSelected }) => {
    console.log(to);
    return (
      <MenuItem
        component={Link}
        to={to}
        active={selected === title}
        onClick={() => setSelected(title)}
      >
        {icon}
        <Typography>{title}</Typography>
      </MenuItem>
    );
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selected, setSelected] = useState("DashBoard");
  const [user, setUser] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "student", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          fetchStudentData(user);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
    return null;
  }

  return (
    <>
      <div className="root">
        <div className="drawer">
          <IconButton
            size="large"
            edge="start"
            color="black"
            aria-label="logo"
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            <Box role="presentation" p={5} width="400px" textAlign="center">
              <Typography variant="h6" component="div">
                My Account
              </Typography>
              <div className="underline-drawer"></div>
            </Box>
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  src={user.profile ? user.profile : user_icon}
                  alt=""
                  width="100px"
                  height="100px"
                  borderRadius="50%"
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h5" color="red" fontWeight="bold">
                  {user.name.toUpperCase()}
                </Typography>

                <Typography variant="h6" color="">
                  Team College
                </Typography>
                <Typography
                  variant="h6"
                  color=""
                >{`${user.rollNo}`}</Typography>
              </Box>
            </Box>

            {/* MENU ITEM */}
            <div className="menu">
              <div className="box0">
                <Box paddingLeft="10%" marginBottom="10px">
                  <Item
                    title="DashBoard"
                    to="/DashBoard"
                    icon={<CampaignIcon style={{ marginRight: "80px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </div>
              <div className="underline-drawer-menu"></div>

              <div className="box1">
                <Box paddingLeft="10%">
                  <Item
                    title="Announcement"
                    to="/Announcement"
                    icon={<CampaignIcon style={{ marginRight: "80px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </div>
              <div className="underline-drawer-menu"></div>

              <div className="box2">
                <Box paddingLeft="10%">
                  <Item
                    title="Student Documents"
                    to="/Document"
                    icon={<ArticleIcon style={{ marginRight: "80px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </div>

              <div className="underline-drawer-menu"></div>

              <div className="box3">
                <Box paddingLeft="10%">
                  <Item
                    title="Student Profile"
                    to="/MyProfile"
                    icon={<PersonIcon style={{ marginRight: "80px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </div>

              <div className="underline-drawer-menu"></div>

              <div className="underline-drawer-menu"></div>
              <div className="box5">
                <Box paddingLeft="10%" marginBottom="15px">
                  <Item
                    title="Gpa calculator"
                    to="/Gpa"
                    icon={
                      <AutoModeIcon
                        style={{
                          marginRight: "80px" /* , fontFamily : 
                    '"Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif' */,
                        }}
                      />
                    }
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </>
  );
}
