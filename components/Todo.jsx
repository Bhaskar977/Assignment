import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const initialState = {
  taskName: "",
  description: "",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const thTdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

const thStyle = {
  ...thTdStyle,
  paddingTop: "12px",
  paddingBottom: "12px",
  textAlign: "left",
  backgroundColor: "#f2f2f2",
  color: "black",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid gray",
};

const btnStyle = {
  borderRadius: "5px",
  padding: "10px 20px",
  border: "none",
  backgroundColor: "blue",
  color: "#fff",
};

const Todo = () => {
  const [formData, setFormData] = useState(initialState);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  const handleOpen = (id) => {
    setTaskIdToDelete(id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/task");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update task
        await axios.put(`http://localhost:8000/task/${formData.id}`, formData);
      } else {
        // Create new task
        await axios.post("http://localhost:8000/task", formData);
      }
      fetchData();
    } catch (error) {
      console.log(error);
    }
    setFormData(initialState);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/task/${taskIdToDelete}`);
      setData(data.filter((item) => item.id !== taskIdToDelete));
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (task) => {
    setFormData(task);
  };

  const { taskName, description } = formData;

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Task Management</h2>
      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          <label>Task Name:-</label>
          <input
            type="text"
            name="taskName"
            value={taskName}
            onChange={handleChange}
            style={inputStyle}
          />
          <br />
          <br />
          <label>Description:-</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            style={inputStyle}
          />
          <br />
          <br />
          <button type="submit" style={btnStyle}>
            {formData.id ? "Update Task" : "Add Task"}
          </button>
          <br />
        </form>
      </div>
      <div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>S.No.</th>
              <th style={thStyle}>Task Name</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((el, i) => (
              <tr key={el.id}>
                <td style={thTdStyle}>{i + 1}</td>
                <td style={thTdStyle}>{el.taskName}</td>
                <td style={thTdStyle}>{el.description}</td>
                <td style={thTdStyle}>
                  <button onClick={() => handleUpdate(el)}>Update</button>
                  <button onClick={() => handleOpen(el.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Pop-up for delete */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this row?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="text" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="text" onClick={handleClose}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Todo;
