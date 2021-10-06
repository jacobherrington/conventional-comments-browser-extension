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

const injectContainers = () => {
  const commentFormHeaders = document.querySelectorAll(".js-comments-holder");

  commentFormHeaders.forEach((header) => {
    if (!header.nextElementSibling.classList.contains("ccwe--container")) {
      let container = document.createElement("div");
      container.classList.add("ccwe--container");
      header.after(container);
      injectContent(container);
    }
  });
};

const buildButton = (parent, key, isBlocking) => {
  const button = document.createElement("button");
  const gitHubClasses = ['btn', 'ml-1', 'mb-1']
  button.classList.add(...gitHubClasses, "ccwe--button", `ccwe--button-blocking-${isBlocking}`);
  button.title = ``
  button.textContent = key[0];
  button.dataset.type = key;
  button.dataset.blocking = isBlocking;
  parent.appendChild(button);

  return button;
};

const injectContent = (container) => {
  Object.keys(commentTypes).forEach((key) => {
    buildButton(container, key, false);
    if (commentTypes[key].canBlock === true) {
        buildButton(container, key, true);
    }
  });
};

const appendCommentTemplate = (e) => {
  const textarea =
    e.target.parentElement.nextElementSibling.querySelector("textarea");
  textarea.value = buildCommentTemplate(textarea, e.target.dataset);
};

const buildCommentTemplate = (textarea, dataset) => {
  return `**${dataset.type} (${dataset.blocking === 'true' ? 'blocking' : 'non-blocking'}):** ${textarea.value}`;
}

const updateEventListeners = () => {
  document.querySelectorAll(".ccwe--button").forEach((button) => {
    button.removeEventListener("click", (e) => appendCommentTemplate(e));
    button.addEventListener("click", (e) => appendCommentTemplate(e));
  });
};

const main = () => {
  injectContainers();
  setTimeout(() => {
    updateEventListeners();
  }, 50);
};

document.querySelectorAll(".js-add-line-comment").forEach((button) => {
  button.addEventListener("click", () => main(), true);
});
