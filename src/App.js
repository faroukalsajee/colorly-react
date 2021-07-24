import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const API_PATH = "http://localhost:8888";

const colorsList = {
  one: "red",
  two: "orange",
  three: "yellow",
  four: "green",
  five: "blue",
  six: "indigo",
  seven: "violet",
  eight: "grey",
  nine: "black",
};
const initialColors = Object.values(colorsList);

function shufflingArray(arr) {
  // Fisher-Yates-Durstenfeld shuffle
  for (let i = 0; i < arr.length - 1; i++) {
    let j = i + Math.floor(Math.random() * (arr.length - i));
    let temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

const App = () => {
  // declare the color state to render html whenever this state changes
  const [colors, setColors] = useState(initialColors);

  // Shuffle click event to shuffle current colors
  const onClickShuffle = () => {
    setColors(shufflingArray([...colors]));
  };

  // Reset click event to reset current colors as initial colors
  const onClickReset = () => {
    setColors(initialColors);
  };

  // show notification for data status from backend
  const showToast = ({ type, message }) => {
    if (type === "info") {
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Save click event to save current status
  const onClickSave = () => {
    axios({
      method: "post",
      url: `${API_PATH}`,
      headers: { "content-type": "application/json" },
      data: {
        colors,
      },
    })
      .then((res) => {
        if (res.data.success) {
          showToast({
            type: "info",
            message: "Saving Shuffle Order...",
          });
        } else {
          showToast({
            type: "error",
            message: res.data.error,
          });
        }
      })
      .catch((error) => {
        showToast({
          type: "error",
          message: error,
        });
      });
  };

  // Latest status click event to get the latest shuffled colors
  const onClickLatestStatus = () => {
    axios
      .get(`${API_PATH}`)
      .then((res) => {
        if (res.data.success) {
          setColors(res.data.colors);
        } else {
          showToast({
            type: "error",
            message: res.data.error,
          });
        }
      })
      .catch((error) => {
        showToast({
          type: "error",
          message: error,
        });
      });
  };

  return (
    // colors state will be mapped to render every color as div with correct background color
    <div className="App">
      <ToastContainer />
      <header className="App-header">Colorly</header>

      <div className="App-body">
        <div className="App-body-container">
          {colors.map((color, index) => (
            <div
              className="App-body-item"
              style={{ backgroundColor: color }}
              key={index}
            ></div>
          ))}

          <div className="App-action">
            <button className="App-action-pink-button" onClick={onClickShuffle}>
              Shuffle Colors
            </button>
            <button onClick={onClickReset}>Reset Shuffle Order</button>
            <button onClick={onClickSave}>Save Shuffle Order</button>
            <button onClick={onClickLatestStatus}>Latest Saved Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
