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

const shufflingArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

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

  /**  show notification for data status from backend.
  /*   https://prnt.sc/1ed2ni2 */
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
            message: "Saved successfully!",
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
      <header className="App-header">Color Shuffling</header>

      <div className="App-body">
        <div className="App-body-container">
          {colors.map((color, index) => (
            <div
              className="App-body-item"
              style={{ backgroundColor: color }}
              key={index}
            ></div>
          ))}
        </div>
      </div>

      <div className="App-action">
        <button className="App-action-pink-button" onClick={onClickShuffle}>
          Shuffle
        </button>
        <button onClick={onClickReset}>Reset</button>
        <button onClick={onClickSave}>Save</button>
        <button onClick={onClickLatestStatus}>Latest Status</button>
      </div>
    </div>
  );
};

export default App;
