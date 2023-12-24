/**
 * Opens the "Add Task" template by appending the necessary HTML elements to the document body.
 *
 * @param {string|null} status
 */
function openAddTaskTemplate(status = null) {
    if (status == null) {
        status = "toDo";
    }
    document.body.innerHTML += /*html*/ `
    <div id="addTaskOverlay"></div>

    <div id="addTaskWrapper">
        <div id="addTaskCard" include-tasks-html="./assets/templates/add_task_template.html"></div>
    </div>`;
    includeTasksHtml(status);

    includeEventlistenerToCloseAddTask();
}

/**
 * Attach an event listener to the "addTaskWrapper" element to close the "Add Task" template
 * when a click occurs on the overlay.
 */
function includeEventlistenerToCloseAddTask() {
    const addTaskOverlay = document.getElementById("addTaskWrapper");
    addTaskOverlay.addEventListener("click", function (event) {
        if (event.target === this) {
            // Clicked on the addTaskOverlay (not its children)
            removeAddTaskElements();
        }
    });
}

/**
 * Adds a click event listener to the "overlayBoard" element to close it when clicked.
 * Assumes an HTML element with the ID "overlayBoard" exists in the document.
 * Calls "removeOverlayBoard" when the overlay is clicked (excluding its children).
 */
function includeEventlistenerToCloseOverlayBoard() {
    const overlay = document.getElementById("overlayBoard");
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) removeOverlayBoard();
    });
}

/**
 * Removes or hides the elements related to the "Add Task" template, including the "addTaskWrapper" and "overlayBoard."
 * Additionally, it adds an event listener for search functionality after removing the elements.
 */
function removeAddTaskElements() {
    const addTaskWrapper = document.getElementById("addTaskWrapper");
    const overlayBoard = document.getElementById("overlayBoard");
    removeTaskOverlay();
    if (addTaskWrapper) {
        addTaskWrapper.remove();
    }
    if (overlayBoard) {
        overlayBoard.remove();
    }
}

/**
 * Removes the "overlayBoard" element from the DOM if it exists.
 * This function assumes that there is an HTML element with the ID "overlayBoard" in the document.
 * If the element does not exist, no action is taken.
 */
function removeOverlayBoard() {
    const overlayBoard = document.getElementById("overlayBoard");
    if (overlayBoard) {
        overlayBoard.remove();
    }
}

/**
 * Adds an overlay element to the document body with the ID "addTaskOverlay."
 * The overlay is typically used to create a modal or overlay effect on the web page.
 * It appends the overlay element to the document body.
 */
function addTaskOverlay() {
    document.body.innerHTML += /*html*/ `
    <div id="addTaskOverlay">
    </div>`;
}

/**
 * Removes the "addTaskOverlay" element from the DOM if it exists.
 * This function assumes that there is an HTML element with the ID "addTaskOverlay" in the document.
 * If the element does not exist, no action is taken.
 */
function removeTaskOverlay() {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    if (addTaskOverlay) {
        addTaskOverlay.remove();
    }
}

/**
 * Opens an edit task template for a specific task.
 *
 * @param {string} taskId - The ID of the task to edit.
 */
async function openEditTaskTemplate(taskId) {
    addTaskOverlay();
    document.body.innerHTML += /*html*/ `
    <div id="addTaskWrapper">
        <div id="addTaskCard"><div include-tasks-html="./assets/templates/add_task_template.html"></div></div>
    </div>`;

    await includeTasksHtml();
    loadTask(taskId);
    includeEventlistenerToCloseAddTask();
}
