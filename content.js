let innerText = "Did you get a reliable answer from ChatGPT?";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Get message", message.action);
  if (message.action === "showSnackbar") {
    // Add your code here to show the UI component
    // For example, you can inject HTML/CSS to create a snackbar
    var snackbar = document.createElement("div");
    snackbar.style = `
          position: fixed;
          bottom: 102px;
          right: 32px;
          background-color: #000000;
          color: white;
          padding: 16px;
          border-radius: 8px;
          z-index: 9999;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
      `;
    let innerStatement = document.createElement("p");
    innerStatement.id = "innerStatement";
    innerStatement.textContent = innerText;
    innerStatement.style = `color: white; margin-right: 40px; font-size: 14px`;
    snackbar.appendChild(innerStatement);

    let yesButton = document.createElement("div");
    yesButton.textContent = "YES";
    yesButton.style.cssText = `
          color: yellow;
          font-size: 14px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
    `;
    snackbar.appendChild(yesButton);

    let noButton = document.createElement("div");
    noButton.textContent = "NO";
    noButton.style.cssText = `
          color: white;
          font-size: 14px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
    `;
    snackbar.appendChild(noButton);

    const closeSnackbar = () => snackbar.remove();

    yesButton.onclick = closeSnackbar;
    noButton.onclick = closeSnackbar;
    document.body.appendChild(snackbar);
  } else if (message.action === "changeText") {
    const { newText } = message;
    innerText = newText;
    let innerStatement = document.getElementById("innerStatement");
    if (innerStatement) innerStatement.textContent = newText;
  }
});
