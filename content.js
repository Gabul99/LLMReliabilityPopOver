let innerText = "Did you get a reliable answer?";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Get message", message.action);
  if (message.action === "showSnackbar") {
    const site = message.site;

    // Snackbar Styling
    var snackbar = document.createElement("div");
    snackbar.style = `
          position: fixed;
          bottom: ${site === "Gemini" ? "112px" : "102px"};
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

    // When close snackbar, it sends log data to service worker.
    const closeSnackbar = (answer) => {
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
            },
          },
          undefined,
          () => {}
        );
      }
      snackbar.remove();
    };

    yesButton.onclick = () => closeSnackbar("YES");
    noButton.onclick = () => closeSnackbar("NO");
    document.body.appendChild(snackbar);
  } else if (message.action === "changeText") {
    const { newText } = message;
    innerText = newText;
    let innerStatement = document.getElementById("innerStatement");
    if (innerStatement) innerStatement.textContent = newText;
  }
});
