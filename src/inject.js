const commentTypes = {
  praise: {},
  nitpick: {},
  suggestion: {},
  issue: {},
  question: {},
  thought: {},
  chore: {},
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
  button.classList.add("ccwe--button", `ccwe--button-blocking-${isBlocking}`);
  button.textContent = key[0];
  button.dataset.type = key;
  button.dataset.blocking = isBlocking;
  parent.appendChild(button);

  return button;
};

const injectContent = (container) => {
  Object.keys(commentTypes).forEach((key) => {
    buildButton(container, key, true);
    buildButton(container, key, false);
  });
};

const appendCommentTemplate = (e) => {
  let type = e.target.dataset.type;
  let isBlocking = e.target.dataset.blocking;
  let textarea =
    e.target.parentElement.nextElementSibling.querySelector("textarea");
  textarea.value = `**${type} (${isBlocking === 'true' ? 'blocking' : 'non-blocking'}):** ${textarea.value}`;
};

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
  }, 200);
};

document.querySelectorAll(".js-add-line-comment").forEach((button) => {
  button.addEventListener("click", () => main(), true);
});
