import "./App.css";
import InputItem from "./components/InputItem";
import MessageManager from "./message/MessageManager";

function App() {
  const handleLog = () => {
    const msgManager = new MessageManager();
    msgManager.sendMessageToRuntime({ action: "downloadLogs" }, () => {});
  };
  return (
    <div className="App">
      <div className="header">Experimental</div>
      <InputItem />
      <p>You can download the logs from gpt and gemini at once</p>
      <div className="log-button" onClick={handleLog}>
        Download logs
      </div>
    </div>
  );
}

export default App;
