import React, { useContext, useEffect, useState } from "react";
import { Drawer, Box, Typography, IconButton, MenuItem } from "@mui/material";

import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import user_icon from "../assessts/images/th.jpg";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export default function Teacher_Sidebar() {
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
    const Auth = getAuth();
    const unsubscribe = onAuthStateChanged(Auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "teacher", user.uid));
        setUser(userDoc.data());
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
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
            color="inherit"
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
                  borderRadius= "30px"
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h5" color="red" fontWeight="bold">
                  {user.name.toUpperCase()}
                </Typography>

                <Typography variant="h6" color="blue">
                  Team College
                </Typography>
                <Typography
                  variant="h6"
                  color=""
                >{`${user.teacherID}`}</Typography>
              </Box>
            </Box>

            {/* MENU ITEM */}
            <div className="menu">
              <div className="box0">
                <Box paddingLeft="10%" marginBottom="10px">
                  <Item
                    title="DashBoard"
                    to="/Teacher"
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
                    to="/Announce"
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
                    title="Student Detail"
                    to="/Student-detail"
                    icon={<ArticleIcon style={{ marginRight: "80px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </div>

              <div className="underline-drawer-menu"></div>
            </div>
          </Drawer>
        </div>
      </div>
    </>
  );
}
