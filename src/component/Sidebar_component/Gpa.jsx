import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Header from "../dashboard-topbar/Dashboard_topbar";

import { Box, Card, CardMedia, Typography } from "@mui/material";

const Gpa = () => {
  const [semester, setSemester] = useState("");
  const [score, setScore] = useState("");
  const [totalGpa, setTotalGpa] = useState(0);

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
          <Header title="GPA" subtitle="Calculate your Gpa here " />
        </Box>
      </Box>
      <Box>
        <form style={{ margin: "30px" }}>
          <Box style={{ display: "flex", margin: "30px" }}>
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
              style={{ display: " flex  ", marginLeft: "75px", width: "300px" }}
            />
              <Typography marginLeft={10} color="grey">Enter grade less than 80 </Typography>

          </Box>

          <Box style={{ display: "flex", margin: "30px" }}>
            <label htmlFor="semester">Enter your Total Semester</label>
            <input
              id="semester"
              type="number"
              value={semester}
              onChange={handleSemester}
              placeholder="No of semester"
              max="8"
              min="0"
              step="0.01"
              style={{ display: " flex  ", marginLeft: "40px", width: "300px" }}
              />
              <Typography marginLeft={10} color="grey">Enter semester less than 8 </Typography>
          </Box>

          <button onClick={TotalGPA} style={{height : "40px", marginLeft : "180px", borderRadius : "10px", cursor : "pointer"}}>CALCULATE GPA</button>
        </form>
      </Box>

      {semester !== '0' && semester <= '8' && score > '0' && score <= '80' && (
        <Box style={{ display: "flex", margin: "30px", marginLeft: "500px" }}>
          <label htmlFor="semester">Your Total GPA is , <span style={{color : "red"}}>{totalGpa}</span></label>
        </Box>
      )} 
         </div>
  );  
};

export default Gpa;
