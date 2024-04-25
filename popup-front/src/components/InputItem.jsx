import { useState } from "react";
import "./InputItem.css";
import MessageManager from "../message/MessageManager";

const TEXT_LIST = [
  "Always verify facts by checking multiple reputable sources for accuracy.",
  "Your grades could be negatively impacted if you don’t fact-check because the content could be wrong.",
  "Achieve better grades by fact-checking with multiple reputable sources to ensure accuracy.",
  "Fact-checking the content enhances your grades! When you verify your sources, you ensure accuracy and demonstrate credibility.",
  "Fact-checking can be like solving a mystery, and there's a real sense of accomplishment when you know your work is accurate. Feel the sense of achievement when you get the facts right—double-check those facts!",
  "Fact-checking is a key part of academic integrity. You're contributing to a community that values truth and accuracy. Your professors and peers expect accurate facts from you.",
];

const InputItem = ({ text, setText }) => {
  const saveText = (value) => {
    const msgManager = new MessageManager();
    msgManager.sendMessageToRuntime({ action: "changeStyle", newText: value });
  };

  const handleChange = (event) => {
    setText(event.target.value);
    saveText(event.target.value);
  };

  return (
    <div className="container">
      <p className="title">Snackbar Text</p>
      {TEXT_LIST.map((phrase, index) => (
        <div key={index}>
          <input
            type="radio"
            value={phrase}
            checked={text === phrase}
            onChange={handleChange}
            id={`phrase-${index}`}
          />
          <label htmlFor={`phrase-${index}`}>{phrase}</label>
        </div>
      ))}
    </div>
  );
};

export default InputItem;
