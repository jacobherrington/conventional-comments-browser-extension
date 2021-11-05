const main = () => {
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
    let lastInjectedCommentsContainer;

    const lastInjectedContainer = () => lastInjectedCommentsContainer?.querySelector('div.js-line-comments .ccbe--container');

    const respondToMutation = (mutationList, _observer) => {
        mutationList.forEach((mutation) => {
            switch (mutation.type) {
                case 'childList':
                    let nodes = mutation.addedNodes
                    if (nodes.length === 1 && nodes[0].classList.contains("js-inline-comments-container")) {
                        lastInjectedCommentsContainer = nodes[0];
                        injectContainer(lastInjectedCommentsContainer.querySelector(".js-comments-holder"));
                    }
                    break;
            }
        });
    }

    /* Inject UI */

    const injectContainer = (target) => {
        let container = document.createElement("div");
        container.classList.add("ccbe--container");
        target.after(container);
        injectButtons(container);
        addEventListeners(container);
    }

    const injectButtons = (container) => {
        Object.keys(commentTypes).forEach((key) => {
            buildButton(container, key, false);
            if (commentTypes[key].canBlock === true) {
                buildButton(container, key, true);
            }
        });
    };

    const buildButton = (parent, key, isBlocking) => {
        const button = document.createElement("button");
        const gitHubClasses = ["btn", "ml-1", "my-1"];
        button.classList.add(
            ...gitHubClasses,
            "ccbe--button",
            `ccbe--button-blocking-${isBlocking}`,
            "ccbe--animation-wave"
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

    const addEventListeners = (container) => {
        Array.prototype.filter.call(
            container.querySelectorAll(".ccbe--button"),
            (button) => !button.dataset.listening
        ).forEach((button) => {
            button.addEventListener("click", (e) => appendCommentTemplate(e));
            button.dataset.listening = true;
        });
    }

    /* Comment Templates */

    const buildCommentTemplate = (textarea, dataset) => {
        return `**${dataset.type} (${String(dataset.blocking) === "true" ? "blocking" : "non-blocking"
            }):** ${textarea.value}`;
    };

    const appendCommentTemplate = (e) => {
        const textarea =
            e.target.parentElement.nextElementSibling.querySelector("textarea");
        const dataset = e?.hotkeyEventDataset || e.target.dataset;
        textarea.value = buildCommentTemplate(textarea, dataset);
    };

    /* Hotkeys */

    const hotkeyEvent = (type, blocking) => {
        const target =
            document.querySelector(".details-overlay[open] .ccbe--container")
                ?.firstChild || lastInjectedContainer().firstChild;
        return {
            target: target,
            hotkeyEventDataset: { type: type, blocking: blocking },
        };
    };

    // Adding shift gives the comment a "blocking" decoration
    const blockingModifier = (e) => {
        return !!e.shiftKey;
    };

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

    const targetNode = document.querySelector("#files");
    const observerOptions = {
        childList: true,
        attributes: false,
        subtree: true
    }
    const observer = new MutationObserver(respondToMutation);

    if (targetNode) observer.observe(targetNode, observerOptions);
    document.onkeydown = captureHotkeys;
}

// This mostly works.
document.addEventListener("DOMContentLoaded", main);
document.addEventListener("pjax:end", main);