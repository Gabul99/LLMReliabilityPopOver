console.log("Service worker");
let popoverStyle;

// Load the popover style from local storage.
// If there is no data, set default data.
function initialize(completeHandler) {
  chrome.storage.local.get("popoverStyle", (data) => {
    if (Object.keys(data).length === 0) {
      popoverStyle = {
        backgroundColor: "black",
        popoverText:
          "Always verify facts by checking multiple reputable sources for accuracy.",
      };
      chrome.storage.local.set(popoverStyle);
    } else {
      popoverStyle = data.popoverStyle;
    }
    completeHandler();
  });
}
initialize(() => {});

// Intercept network requests and send message to content script if needed.
chrome.webRequest.onCompleted.addListener(
  async function (details) {
    // check this request from ChatGPT
    if (
      details.initiator &&
      (details.initiator.includes("openai.com") ||
        details.initiator.includes("chatgpt.com"))
    ) {
      if (details.url.endsWith("backend-api/conversation")) {
        console.log("Send Message!");
        setTimeout(
          () =>
            chrome.tabs.sendMessage(details.tabId, {
              action: "showSnackbar",
              site: "ChatGPT",
              style: popoverStyle,
            }),
          5000
        );
      }
    }
    // check this request from Google Gemini
    if (details.initiator && details.initiator.includes("gemini.google.com")) {
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
              style: popoverStyle,
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
      // this 'onload' closure is triggered when readAsArrayBuffer called.
      reader.onload = (event) => {
        const dataUri = event.target.result;
        const blobUrl = `data:application/json;base64,${btoa(
          new Uint8Array(dataUri).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;
        // Trigger to download
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
      chrome.storage.local.set(newLog);
    });
  } else if (message.action === "downloadLogs") {
    // When download logs button is clicked
    getStorageAndDownload("gemeniReliableExtLogs");
    getStorageAndDownload("gptReliableExtLogs");
  } else if (message.action === "changeStyle") {
    // When the color or text is changed in popup.
    const { newText, newColor } = message;
    // If newColor or newText is undefined, existing value is included for new popover style.
    popoverStyle = {
      backgroundColor: newColor ?? popoverStyle.backgroundColor,
      popoverText: newText ?? popoverStyle.popoverText,
    };
    chrome.storage.local.set({
      popoverStyle,
    });
    chrome.runtime.sendMessage(
      undefined,
      {
        action: "updateStyle",
        popoverStyle,
      },
      undefined,
      () => {}
    );
  } else if (message.action === "getCurrentStyle") {
    if (popoverStyle === undefined) {
      initialize(() => {
        sendResponse(popoverStyle);
      });
    } else {
      sendResponse(popoverStyle);
    }
  }
});
