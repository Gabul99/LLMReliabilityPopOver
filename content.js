function colorTag(colorName) {
  switch (colorName) {
    case "black":
      return "#000000";
    case "red":
      return "#FF5C5C";
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Get message", message.action);
  if (message.action === "showSnackbar") {
    const site = message.site;
    const { backgroundColor, popoverText } = message.style;
    const colorHashCode = colorTag(backgroundColor);

    // Snackbar Styling
    var snackbar = document.createElement("div");
    snackbar.style = `
          position: fixed;
          bottom: ${site === "Gemini" ? "112px" : "102px"};
          right: 32px;
          background-color: ${colorHashCode};
          color: white;
          padding: 16px;
          border-radius: 8px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
      `;
    snackbar.id = "extensionSnackbar";
    let innerStatement = document.createElement("p");
    innerStatement.id = "innerStatement";
    innerStatement.textContent = popoverText;
    innerStatement.style = `max-width: 360px; color: white; font-size: 14px; word-wrap:break-word;`;
    snackbar.appendChild(innerStatement);

    let buttonContainer = document.createElement("div");
    buttonContainer.style = `
          width: fit-content;
          display: flex;
          flex-direction: row;
          margin-left: auto;
          gap: 8px;
          align-items: center;
    `;

    let yesButton = document.createElement("div");
    yesButton.textContent = "Let’s fact-check now";
    yesButton.style.cssText = `
          color: yellow;
          font-size: 14px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
    `;
    buttonContainer.appendChild(yesButton);

    let noButton = document.createElement("div");
    noButton.textContent = "I will do it later";
    noButton.style.cssText = `
          color: white;
          font-size: 14px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
    `;
    buttonContainer.appendChild(noButton);

    // When close snackbar, it sends log data to service worker.
    const closeSnackbar = (text, answer) => {
      if (site === "Gemini") {
        const modelTurns = Array.from(
          document.querySelectorAll('[id^="message-content-id-"]')
        );
        const userTurns = Array.from(
          document.querySelectorAll('[id^="user-query-content-"]')
        );
        const recentTurns = [
          userTurns.pop().outerHTML,
          modelTurns.pop().outerHTML,
        ];
        chrome.runtime.sendMessage(
          undefined,
          {
            action: "saveLogs",
            log: {
              userAnswer: answer,
              site,
              time: new Date().toISOString(),
              turns: recentTurns,
              text,
            },
          },
          undefined,
          () => {}
        );
      } else {
        const turns = document.querySelectorAll(
          '[data-testid^="conversation-turn-"]'
        );
        const recentTurns = Array.from(turns)
          .slice(-2)
          .map(
            (t) =>
              t.querySelector(
                '[data-message-author-role="user"], [data-message-author-role="assistant"]'
              ).outerHTML
          );
        chrome.runtime.sendMessage(
          undefined,
          {
            action: "saveLogs",
            log: {
              userAnswer: answer,
              site,
              time: new Date().toISOString(),
              turns: recentTurns,
              text,
            },
          },
          undefined,
          () => {}
        );
      }
      snackbar.remove();
    };

    yesButton.onclick = () =>
      closeSnackbar(innerStatement.textContent, "Let's fact-check now");
    noButton.onclick = () =>
      closeSnackbar(innerStatement.textContent, "I will do it later");

    snackbar.appendChild(buttonContainer);
    // Snackbar Injection to DOM
    document.body.appendChild(snackbar);
  } else if (message.action === "updateStyle") {
    const { popoverStyle } = message;
    const { popoverText, backgroundColor } = popoverStyle;
    let innerStatement = document.getElementById("innerStatement");
    if (innerStatement) innerStatement.textContent = popoverText;
    let snackbar = document.getElementById("extensionSnackbar");
    if (snackbar) snackbar.style.backgroundColor = colorTag(backgroundColor);
  }
});
