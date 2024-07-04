import React, { useState, useRef } from "react";
import "./dashboard.scss";
const Dashboard = () => {
  const [data, setData] = useState([]);

  const formref = useRef();

  const onDragEnter = () => formref.current.classList.add("dragover");

  const onDragLeave = () => formref.current.classList.add("dragleave");

  const onDrop = () => formref.current.classList.add("dragover");

  const handleSubmit = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setData(file);
  };
  return (
    <form
      className="FileUpload"
      ref={formref}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrag={onDrop}
      onSubmit={(e) => {
        e.preventDefault();
        console.log(e);
      }}
    >
      <label>Upload an csv file</label>
      <input type="file" accept=".csv" id="file" onChange={handleSubmit} />
      <button>Upload File</button>
    </form>
  );
};

export default Dashboard;
