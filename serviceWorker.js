console.log("Service worker");
// Intercept network requests and send message to content script if needed.
chrome.webRequest.onCompleted.addListener(
  async function (details) {
    if (details.initiator && details.initiator.includes("openai.com")) {
      if (details.url.endsWith("backend-api/conversation")) {
        console.log("Send Message!");
        setTimeout(
          () =>
            chrome.tabs.sendMessage(details.tabId, {
              action: "showSnackbar",
              site: "ChatGPT",
            }),
          5000
        );
      }
    }
    if (details.initiator && details.initiator.includes("gemini.google.com")) {
      console.log(details.url);
      if (
        details.url.includes(
          "assistant.lamda.BardFrontendService/StreamGenerate"
        )
      ) {
        console.log("Send Message Google!!");
        setTimeout(
          () =>
            chrome.tabs.sendMessage(details.tabId, {
              action: "showSnackbar",
              site: "Gemini",
            }),
          5000
        );
      }
    }
  },
  { urls: ["<all_urls>"] }
);

// Generate log files and download.
function getStorageAndDownload(key) {
  chrome.storage.local.get(key, function (data) {
    if (data) {
      const textData = JSON.stringify(data);
      console.log(data);

      const blob = new Blob([textData], { type: "application/json" });
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target.result;
        const blobUrl = `data:application/json;base64,${btoa(
          new Uint8Array(dataUri).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;
        chrome.downloads.download({
          url: blobUrl,
          filename: key + "-log-data.json",
          saveAs: true,
          conflictAction: "uniquify",
        });
      };
      reader.readAsArrayBuffer(blob);
      return true;
    }
  });
}

// Receive saveLogs message and download the logs.
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Get message in runtime!", message);
  if (message.action === "saveLogs") {
    console.log(message);
    const logData = message.log;
    const key =
      logData.site === "Gemini"
        ? "gemeniReliableExtLogs"
        : "gptReliableExtLogs";
    chrome.storage.local.get(key, (storage) => {
      console.log(key, storage);
      const newLog = {};
      newLog[key] = [...(storage[key] ?? []), logData];
      console.log(newLog);
      chrome.storage.local.set(newLog);
    });
  } else if (message.action === "downloadLogs") {
    getStorageAndDownload("gemeniReliableExtLogs");
    getStorageAndDownload("gptReliableExtLogs");
  }
});
