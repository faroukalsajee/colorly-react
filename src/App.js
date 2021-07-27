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

const shufflingArray = (colors) => {
  for (let i = colors.length - 1; i > 0; i--) {
    let swapIndex = Math.floor(Math.random() * (i + 1));
    let current = colors[i];
    let toSwap = colors[swapIndex];
    colors[i] = toSwap;
    colors[swapIndex] = current;
  }

  return colors;
};

const App = () => {
  // declare color state to render html whenever this state changes
  const [colors, setColors] = useState(initialColors);

  const onClickShuffle = () => {
    setColors(shufflingArray([...colors]));
  };

  const onClickReset = () => {
    setColors(initialColors);
  };

  // Save shuffle state button
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

  // Get the latest shuffled colors
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
    // Render every color as div with correct background color
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
