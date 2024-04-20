class MessageManager {
  sendMessage(msg, completeHandler) {
    if (!chrome) return;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg, completeHandler);
    });
  }

  sendMessageToRuntime(msg, completeHandler) {
    if (!chrome) return;
    console.log("Send Message to run time", msg);
    chrome.runtime.sendMessage(undefined, msg, undefined, completeHandler);
  }
}

export default MessageManager;
