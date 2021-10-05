const commentTypes = {
  praise: {},
  nitpick: {},
  suggestion: {},
  issue: {},
  question: {},
  thought: {},
  chore: {},
};

const injectContainer = () => {
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

const buildButton = (parent, key) => {
  const button = document.createElement("button");
  button.classList.add("ccwe--button");
  button.textContent = key[0];
  button.dataset.type = key;
  parent.appendChild(button);

  return button;
};

const injectContent = (container) => {
  Object.keys(commentTypes).forEach((key) => {
    buildButton(container, key);
  });
};

const appendCommentTemplate = (e) => {
  let type = e.target.dataset.type;
  let textarea =
    e.target.parentElement.nextElementSibling.querySelector("textarea");
  textarea.value = `**${type} (blocking):** ${textarea.value}`;
};

const updateEventListeners = () => {
  document.querySelectorAll(".ccwe--button").forEach((button) => {
    button.removeEventListener("click", (e) => appendCommentTemplate(e));
    button.addEventListener("click", (e) => appendCommentTemplate(e));
  });
};

const main = () => {
  injectContainer();
  setTimeout(() => {
    updateEventListeners();
  }, 200);
};

document.querySelectorAll(".js-add-line-comment").forEach((button) => {
  button.addEventListener("click", () => main(), true);
});
