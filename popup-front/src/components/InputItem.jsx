import { useState } from "react";
import "./InputItem.css";
import MessageManager from "../message/MessageManager";

const InputItem = ({ text, setText }) => {
  const saveText = () => {
    const msgManager = new MessageManager();
    msgManager.sendMessageToRuntime({ action: "changeStyle", newText: text });
  };

  return (
    <div className="container">
      <p className="title">Snackbar Text</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="button-area">
        <button className="save-button" onClick={() => saveText()}>
          Save
        </button>
      </div>
    </div>
  );
};

export default InputItem;
