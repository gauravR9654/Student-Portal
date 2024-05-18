import "./App.css";
import LoginSignup from "./component/LoginSignup/LoginSignup";
import DashBoard from "./component/DashBoard/DashBoard";
import Announcement from "./component/Sidebar_component/Announcement";
import Document from "../src/component/Sidebar_component/Document";
import Profile from "../src/component/Sidebar_component/MyProfile";
import Gpa from "../src/component/Sidebar_component/Gpa";
import Question from "../src/component/Sidebar_component/QuestionPaper";
import Role from "../src/component/Role/Role";
import Student_form from "../src/component/Student_form/Student_form";
import Teacher_form from "./component/Teacher/Teacher_form";
import Teacher_dashboard from "./component/Teacher_dashboard/Teacher_dashboard";

import Announce from "./component/TeacherSlideComponent/Announce";
import StudentDetail from "./component/TeacherSlideComponent/Student_detail";
import UpdateDetail from "./component/TeacherSlideComponent/updateDetail";
import Forget from '../src/component/forget/ForgetPassword'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { Authencation } from "./context/Authencation";

function App() {
  const { currentUser } = useContext(Authencation);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/" />;
  };

  console.log(currentUser);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginSignup />} />
          <Route exact path="/admin" element={<Teacher_form />} />
          <Route exact path="/student" element={<Student_form />} />
          <Route exact path="/Role" element={<Role />} />
          <Route exact path="/Forget" element={<Forget />} />
          

          <Route
            exact
            path="/Teacher"
            element={
              <RequireAuth>
                <Teacher_dashboard />
              </RequireAuth>
            }
          />

          <Route
            exact
            path="/Announce"
            element={
              <RequireAuth>
                <Announce />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/Student-detail"
            element={
              <RequireAuth>
                <StudentDetail/>
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/Update-detail"
            element={
              <RequireAuth>
                <UpdateDetail />
              </RequireAuth>
            }
          />

          <Route
            exact
            path="/DashBoard"
            element={
              <RequireAuth>
                <DashBoard />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/Announcement"
            element={
              <RequireAuth>
                <Announcement />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/Document"
            element={
              <RequireAuth>
                <Document />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/MyProfile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/Gpa"
            element={
              <RequireAuth>
                <Gpa />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
