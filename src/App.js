import React, { useState, useEffect } from "react";
import ResizableDiv from "./components/ResizableDiv";
import axios from "axios";
import "./App.css";

const App = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [divs, setDivs] = useState([]);
  const [inputText, setInputText] = useState("");
  const [validation, setValidation] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/documents`);
      if (response.data.length > 0) {
        setDivs(response.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const addDiv = () => {
    setShowInput(true);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (data) => {
    if (data === "") {
      setValidation(true);
    } else {
      try {
        await addContentToDatabase(data);
        setInputText("");
        setValidation(false);
        setShowInput(false);
      } catch (error) {
        console.error("Error adding document:", error);
      }
    }
  };

  const addContentToDatabase = async (content) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/documents`,
        { content }
      );
      if (response.status === 201) {
        setDivs((prevDivs) => [...prevDivs, response.data]);
        console.log("Content added to the database:", response.data);
      }
    } catch (error) {
      console.error("Error adding content to the database:", error);
      throw error;
    }
  };

  return (
    <div>
      <h1>Data Neuron Assignment : Kunal Joshi</h1>
      <div className="add-btn-container">
        <button onClick={addDiv} className="add-btn">
          Add Data
        </button>
      </div>
      {showInput && (
        <div className="text-area-div">
          {validation && (
            <p className="validation-error">Input Field Cannot Be Empty!!</p>
          )}
          <textarea value={inputText} onChange={handleInputChange} />
          <button id="submit-btn" onClick={() => handleSubmit(inputText)}>
            Submit
          </button>
        </div>
      )}
      <div className="grid-container">
        {divs.map((div, index) => (
          <ResizableDiv key={index} width={"45%"} height={"auto"} data={div} />
        ))}
      </div>
    </div>
  );
};

export default App;
