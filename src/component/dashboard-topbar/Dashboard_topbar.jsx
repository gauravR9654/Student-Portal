import React from "react";
import { Box, Typography} from "@mui/material";


const Dashboard_topbar = ({ title, subtitle }) => {
  return (
    <Box mb="30px">
      <Typography variant="h2" fontWeight="bold" sx={{ mb: "5px" }}>
        {title}
      </Typography>
      <Typography variant="h5" >{subtitle}</Typography>
    </Box>
  );
};

export default Dashboard_topbar;
