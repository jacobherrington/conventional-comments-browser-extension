(() => {
  // For now, this is basically just a list of the comment types
  // At some point it could contain extra info
  const commentTypes = {
    chore: {
      canBlock: true,
    },
    issue: {
      canBlock: true,
    },
    nitpick: {
      canBlock: true,
    },
    praise: {
      canBlock: false,
    },
    question: {
      canBlock: true,
    },
    suggestion: {
      canBlock: true,
    },
    thought: {
      canBlock: false,
    },
  };
  let lastInjectedContainer;

  const injectContainers = () => {
    // This selector is pretty brittle
    const commentFormHeaders = document.querySelectorAll(
      `tbody:not(#js-inline-comments-single-container-template) div:not(.js-resolvable-thread-contents) > .js-comments-holder,
    .SelectMenu-header`
    );

    commentFormHeaders.forEach((header) => {
      // Skip headers that already have containers injected next to them
      if (!header.nextElementSibling.classList.contains("ccwe--container")) {
        let container = document.createElement("div");
        container.classList.add("ccwe--container");
        header.after(container);
        lastInjectedContainer = container;
        injectButtons(container);
      }
    });
  };

  const buildButton = (parent, key, isBlocking) => {
    const button = document.createElement("button");
    const gitHubClasses = ["btn", "ml-1", "my-1"];
    button.classList.add(
      ...gitHubClasses,
      "ccwe--button",
      `ccwe--button-blocking-${isBlocking}`,
      "ccwe--animation-wave"
    );
    button.title = buildCommentTemplate(
      { value: "..." },
      { type: key, blocking: isBlocking }
    );
    button.textContent = key[0];
    button.dataset.type = key;
    button.dataset.blocking = isBlocking;
    parent.appendChild(button);

    return button;
  };

  // Makes buttons for each object in commentTypes
  // Buttons that might used as blockers get a second button
  const injectButtons = (container) => {
    Object.keys(commentTypes).forEach((key) => {
      buildButton(container, key, false);
      if (commentTypes[key].canBlock === true) {
        buildButton(container, key, true);
      }
    });
  };

  // Tricking my own code
  const hotkeyEvent = (type, blocking) => {
    const target =
      document.querySelector(".details-overlay[open] .ccwe--container")
        ?.firstChild || lastInjectedContainer.firstChild;
    return {
      target: target,
      hotkeyEventDataset: { type: type, blocking: blocking },
    };
  };

  const appendCommentTemplate = (e) => {
    const textarea =
      e.target.parentElement.nextElementSibling.querySelector("textarea");
    const dataset = e?.hotkeyEventDataset || e.target.dataset;
    textarea.value = buildCommentTemplate(textarea, dataset);
  };

  const buildCommentTemplate = (textarea, dataset) => {
    return `**${dataset.type} (${
      String(dataset.blocking) === "true" ? "blocking" : "non-blocking"
    }):** ${textarea.value}`;
  };

  // Definitely the "least good" part of this project
  const updateEventListeners = () => {
    const container =
      document.querySelector(".details-overlay[open] .ccwe--container") ||
      lastInjectedContainer;
    let buttons = Array.prototype.filter.call(
      container.querySelectorAll(".ccwe--button"),
      (button) => !button.dataset.listening
    );
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => appendCommentTemplate(e));
      button.dataset.listening = true;
    });
  };

  // Adding shift to the hotkey makes it a blocking comment
  const blockingModifier = (e) => {
    return !!e.shiftKey;
  };

  // Handle hotkeys
  // Right now it's just alt + ctrl + first letter of comment type
  const captureHotkeys = (e) => {
    if (e.altKey && e.ctrlKey) {
      switch (e.keyCode) {
        case 67: // c
          appendCommentTemplate(hotkeyEvent("chore", blockingModifier(e)));
          break;
        case 73: // i
          appendCommentTemplate(hotkeyEvent("issue", blockingModifier(e)));
          break;
        case 78: // n
          appendCommentTemplate(hotkeyEvent("nitpick", blockingModifier(e)));
          break;
        case 80: // p
          appendCommentTemplate(hotkeyEvent("praise", blockingModifier(e)));
          break;
        case 81: // q
          appendCommentTemplate(hotkeyEvent("question", blockingModifier(e)));
          break;
        case 83: // s
          appendCommentTemplate(hotkeyEvent("suggestion", blockingModifier(e)));
          break;
        case 84: // t
          appendCommentTemplate(hotkeyEvent("thought", blockingModifier(e)));
          break;
      }
    }
  };

  // It'd be nice to get rid of the setTimeout() calls
  const main = () => {
    setTimeout(() => {
      injectContainers();
    }, 1);
    setTimeout(() => {
      updateEventListeners();
    }, 10);
  };

  // Set event listeners
  document
    .querySelectorAll(".js-add-line-comment, .js-reviews-toggle")
    .forEach((button) => {
      button.addEventListener("click", () => main(), true);
    });

  document.onkeydown = captureHotkeys;
})();
