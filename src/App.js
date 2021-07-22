import { useState } from "react";

import "./App.css";

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
const initialColors = Object.values(colorsList)

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

  return (
    // colors state will be mapped to render every color as div with correct background color
    <div className="App">
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
        </div>
      </div>

      <div className="App-action">
        <button className="App-action-shuffle" onClick={onClickShuffle}>
          Shuffle
        </button>
        <button className="App-action-reset" onClick={onClickReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
