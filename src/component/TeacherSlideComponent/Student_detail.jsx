import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import Slider from "../Teacher_dashboard/Teacher_Sidebar";
import Navbar from "../Navbar/Navbar";
import Header from "../dashboard-topbar/Dashboard_topbar";
import { Box, Typography } from "@mui/material";

const Student_detail = () => {
  const [students, setStudents] = useState([]);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const Auth = getAuth();
    const unsubscribe = onAuthStateChanged(Auth, async (user) => {
      if (user) {
        setUser(user);
        fetchTeacherData(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTeacherData = async (user) => {
    try {
      const teacherId = user.uid;
      const docRef = doc(db, "teacher", teacherId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBranch(data.Branch);
        setSemester(data.semester);
      } else {
        console.log("No teacher found with such branch and semester");
      }
    } catch (error) {
      console.error("Error Fetching teacher data :", error);
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
          title="Student"
          subtitle={
            <Typography variant="h5">
              Here is All the detail of your student
            </Typography>
          }
        />
      </Box>

      <Box m="20px">
        <Typography variant="h5">
          Students in {semester} semester, {branch} Branch:
        </Typography>
      </Box>

      <Box m="20px" display="flex">
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
                  <a href={student.twelv_mark} target="_blank">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default Student_detail;
