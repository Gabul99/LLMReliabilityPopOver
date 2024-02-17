class MessageManager {
  sendMessage(msg, completeHandler) {
    if (!chrome) return;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg, completeHandler);
    });
  }
}

export default MessageManager;
