import React, { useState } from "react";
import { Resizable } from "re-resizable";
import axios from "axios";

const ResizableDiv = ({ width, height, data }) => {
  const [edit, setEdit] = useState(false);
  const [inputText, setInputText] = useState(data.content);
  const [content, setContent] = useState(data.content);
  const [validation, setValidation] = useState(false);
  const style = {
    border: "solid 1px #ddd",
    background: "#f0f0f0",
    margin: "10px",
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (id, data) => {
    if (inputText === "") {
      setValidation(true);
    } else {
      try {
        await editContentInDatabase(id, data);
        setInputText("");
        setValidation(false);
        setEdit(false);
      } catch (error) {
        console.error("Error adding document:", error);
      }
    }
  };

  const editContentInDatabase = async (id, content) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/documents/${id}`,
        { content }
      );
      if (response.status === 200) {
        setContent(response.data.content);
        console.log("Content edited in the database:", response.data);
      }
    } catch (error) {
      console.error("Error editing content in the database:", error);
      throw error;
    }
  };

  return (
    <Resizable
      style={style}
      defaultSize={{
        width: width || 200,
        height: height || 200,
      }}
    >
      <div className="edit-btn-container">
        <button className="edit-btn" onClick={() => setEdit(true)}>
          Edit
        </button>
      </div>
      {edit ? (
        <div className="text-area-div">
          {validation && <span>Input Field Cannot Be Empty!!</span>}
          <textarea value={inputText} onChange={handleInputChange} />
          <button
            id="submit-btn"
            onClick={() => handleSubmit(data._id, inputText)}
          >
            Submit
          </button>
        </div>
      ) : (
        <p className="content">{content}</p>
      )}
    </Resizable>
  );
};

export default ResizableDiv;
