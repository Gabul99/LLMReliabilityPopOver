import "./App.css";
import InputItem from "./components/InputItem";
import MessageManager from "./message/MessageManager";
import { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState("Did you get a reliable answer?");

  useEffect(() => {
    const msgManager = new MessageManager();
    msgManager.sendMessageToRuntime({ action: "getCurrentStyle" }, (res) => {
      const { popoverStyle } = res;
      console.log(
        "Popover Style",
        popoverStyle.popoverStyle.backgroundColor,
        popoverStyle.popoverStyle.popoverText
      );
      setText(popoverStyle.popoverStyle.popoverText);
    });
  }, []);

  const handleLog = () => {
    const msgManager = new MessageManager();
    msgManager.sendMessageToRuntime({ action: "downloadLogs" }, () => {});
  };
  const handleClick = (color) => {
    const msgManager = new MessageManager();
    msgManager.sendMessageToRuntime(
      { action: "changeStyle", newColor: color },
      () => {}
    );
  };

  return (
    <div className="App">
      <div className="header">Experimental</div>
      <InputItem text={text} setText={setText} />
      <div>Set the background color of popover</div>
      <div className="color-pick-container">
        <div
          className="color-block"
          style={{ backgroundColor: "black" }}
          onClick={() => handleClick("black")}
        />
        <div
          className="color-block"
          style={{ backgroundColor: "red" }}
          onClick={() => handleClick("red")}
        />
      </div>
      <p>You can download the logs from gpt and gemini at once</p>
      <div className="log-button" onClick={handleLog}>
        Download logs
      </div>
    </div>
  );
}

export default App;
