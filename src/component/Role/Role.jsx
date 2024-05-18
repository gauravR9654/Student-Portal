import React, { useState } from "react";
import "./Role.css";
import { useNavigate } from "react-router-dom";
import Role from "../assessts/images/role.jpeg";

const Student_form = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedRole === "ADMIN") {
      navigate("/admin");
    } else if (selectedRole === "STUDENT") {
      navigate("/student");
    }
  };

  return (
    <div className="parent">
      <div className="root-cont">
        <img src={Role} alt="sorry hogya bhai" height={100} />
      </div>
      <div className="container-form">
        <div className="content">
          <div className="Role">Choose your Role</div>
          <div className="container2">
            <form onSubmit={handleSubmit}>
              <div className="form-role">
                <div className="Admin">
                  <input
                    type="radio"
                    name="user"
                    value="ADMIN"
                    onChange={handleRoleChange}
                  />
                  <label> TEACHER</label>
                </div>
                <div className="Student">
                  <input
                    type="radio"
                    name="user"
                    value="STUDENT"
                    onChange={handleRoleChange}
                  />
                  <label> STUDENT</label>
                </div>
              </div>

              <div className="submit-button">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student_form;
