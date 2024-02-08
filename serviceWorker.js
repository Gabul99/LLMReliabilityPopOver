console.log("Service worker");
chrome.webRequest.onCompleted.addListener(
  async function (details) {
    console.log(details.initiator);
    if (details.initiator && details.initiator.includes("openai.com")) {
      console.log(details.url);
      if (details.url.endsWith("backend-api/conversation")) {
        console.log("Send Message!");
        await chrome.tabs.sendMessage(details.tabId, {
          action: "showSnackbar",
        });
      }
    }
  },
  { urls: ["<all_urls>"] }
);
