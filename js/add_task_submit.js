/**
 * Submits a new task, updates storage, and navigates to the board page asynchronously.
 *
 * @returns {Promise<void>} Resolves when the submission and storage update are complete.
 */
async function submitTask() {
    saveCurrentEntriesToTask();
    if (checkIfFormSubmittable()) {
        tasks.push(unfinishedTaskData);
        renderTaskAddedElement();
        await setItem("tasks", tasks);
        setTimeout(() => openBoard(), 2000);
    }
}

/**
 * Renders a notification for a successfully added task dynamically in the 'addTaskContainer' element.
 *
 * @returns {void}
 */
function renderTaskAddedElement() {
    const addTaskContainer = document.getElementById("addTaskContainer");
    if (addTaskContainer) {
        addTaskContainer.innerHTML += /*html*/ `<div class="task-created-notification-container">
        <div class="task-created-notification"><p>Task added to board</p><img src="./assets/icons/board-icon.svg"></div>
      </div>`;
    }
}

/**
 * Calls functions to save the data entered by the contact into the unfinishedTaskData JSON array
 * Calls a function to check wether the Task can be created
 */
function saveCurrentEntriesToTask() {
    saveGlobalVariables();
    saveDirectInputFields();
}

/**
 * Saves validated selected global variables into the 'unfinishedTaskData' JSON array
 *
 * @returns {void}
 *
 */
function saveGlobalVariables() {
    if (assignedContacts.length > 0) {
        unfinishedTaskData["assignedContacts"] = assignedContacts;
    }

    if (subTasks.length > 0) {
        unfinishedTaskData["subTasks"] = subTasks;
    }

    if (selectedTaskPriority != null) {
        unfinishedTaskData["priority"] = selectedTaskPriority;
    }
}

/**
 * Saves non-empty values of specified direct input fields in the 'unfinishedTaskData' object.
 *
 * @returns {void}
 */
function saveDirectInputFields() {
    if (document.getElementById("newTaskTitle").value != "") {
        unfinishedTaskData["taskName"] = document.getElementById("newTaskTitle").value;
    }

    if (document.getElementById("newTaskDescription").value != "") {
        unfinishedTaskData["taskDescription"] = document.getElementById("newTaskDescription").value;
    }

    if (document.getElementById("newTaskDate").value != "") {
        unfinishedTaskData["taskDate"] = document.getElementById("newTaskDate").value;
    }

    if (document.getElementById("selectCategory").value != "") {
        unfinishedTaskData["taskCategoryValue"] = document.getElementById("selectCategory").value;
    }
}

/**
 * Resets the Add Task form to its default state.
 *
 * @returns {void}
 */
function emptyAddTaskForm() {
    resetDirectInputFields();
    resetIndirectInputs();
    renderSelectedContactIcons();
    renderContactAssignmentDropDown();
    resetPriority();
    unfinishedTaskData = { status: "toDo" };
}

/**
 * Resets the values of direct input fields to empty strings.
 *
 * @param {string[]} directInputFieldIds - An array of IDs of direct input fields to be reset.
 * @returns {void}
 */

/**
 * Resets various indirect inputs and data related to task creation.
 *
 * @returns {void}
 */
function resetIndirectInputs() {
    selectedTaskPriority = null;
    subTasks = [];
    renderSubTasksList();
    resetSubTaskInput();

    showAssignedContacts = false;
    assignedContacts = [];
}

/**
 * Resets the priority selection menu by unchecking all radio buttons.
 *
 * @returns {void}
 */
function resetPriority() {
    selectedTaskPriority = null;

    /** @type {NodeListOf<HTMLInputElement>} */
    const radioButtons = document.querySelectorAll('input[name="priority"]');

    // Iterate through the radio buttons and uncheck them
    radioButtons.forEach((button) => {
        button.checked = false;
    });
}

/**
 * Loads a task with the given taskId and populates the Add Task form with its data for editing.
 *
 * @param {number} taskId - The ID of the task to load.
 * @returns {void}
 */
function loadTask(taskId) {
    let task = tasks[taskId];

    document.getElementById("addTaskTitle").innerHTML = "Edit Task";
    unfinishedTaskData = task;
    setNewTaskTitleFieldValue(task);
    setNewTaskDescriptionFieldValue(task);
    setNewTaskDateFieldValue(task);

    setAssignedContacts(task);
    setPriorityValue(task);
    setCategoryValue(task);
    setSubTaskFieldValue(task);

    replaceCurrentAddTaskSubmit(taskId);
}

/**
 * Sets the value of the "newTaskTitle" input field based on the task's taskName property.
 *
 * @param {Object} task - The task object containing task-related data.
 * @returns {void}
 */
function setNewTaskTitleFieldValue(task) {
    document.getElementById("newTaskTitle").value = task["taskName"];
}

/**
 * Sets the value of the "newTaskDescription" input field based on the task's taskDescription property.
 *
 * @param {Object} task - The task object containing task-related data.
 * @returns {void}
 */
function setNewTaskDescriptionFieldValue(task) {
    document.getElementById("newTaskDescription").value = task["taskDescription"];
}

/**
 * Sets assigned contacts based on the task's "assignedContacts" property,
 * defaulting to an empty array if none are present. Triggers rendering of selected contact icons.
 *
 * @param {Object} task - Task object with relevant data.
 * @returns {void}
 */
function setAssignedContacts(task) {
    if (task["assignedContacts"]) {
        assignedContacts = task["assignedContacts"];
    } else {
        assignedContacts = [];
    }
    renderSelectedContactIcons();
}

/**
 * Sets the value of the "newTaskDate" input field based on the task's taskDate property.
 *
 * @param {Object} task - The task object containing task-related data.
 * @returns {void}
 */
function setNewTaskDateFieldValue(task) {
    document.getElementById("newTaskDate").value = task["taskDate"];
}

/**
 * Sets the priority value for a task by checking the corresponding radio button.
 *
 * @param {Object} task - The task object containing the priority.
 * @param {string} task.priority - The priority value to be set.
 * @returns {void}
 */
function setPriorityValue(task) {
    let radioButtons = document.getElementsByName("priority");
    selectedTaskPriority = task["priority"];

    radioButtons.forEach((button) => {
        if (button.value === selectedTaskPriority) {
            button.checked = true;
        }
    });
}

/**
 * Sets the value of the "selectCategory" dropdown based on the task's taskCategoryValue property.
 *
 * @param {Object} task - The task object containing task-related data.
 * @returns {void}
 */
function setCategoryValue(task) {
    document.getElementById("selectCategory").value = task["taskCategoryValue"];
}

/**
 * Sets the subtasks array based on the task's "subTasks" property and renders the subtasks list if available.
 *
 * @param {Object} task
 * @returns {void}
 */
function setSubTaskFieldValue(task) {
    if (task["subTasks"]) {
        subTasks = task["subTasks"];
    }
    if (subTasks) {
        renderSubTasksList();
    }
}

/**
 * Replaces the existing buttons in the specified parent element with a "Save Changes" button.
 * The new button is associated with the given task ID and triggers the "saveTaskChanges" function when clicked.
 *
 * @param {string} parentId
 * @param {string} taskId
 * @returns {void}
 */
function replaceCurrentAddTaskSubmit(taskId) {
    removeAllButtons("formOptions");
    addSaveChangesButton("formOptions", taskId);
}

/**
 * Removes all buttons from the specified parent element by iterating through and deleting them.
 *
 * @param {string} parentId
 * @returns {void}
 */
function removeAllButtons(parentId) {
    var formOptionsDiv = document.getElementById(parentId);

    var buttons = formOptionsDiv.getElementsByTagName("button");

    for (var i = buttons.length - 1; i >= 0; i--) {
        var button = buttons[i];
        button.parentNode.removeChild(button);
    }
}

/**
 * Adds a "Save Changes" button to the specified parent element. The button triggers the "saveTaskChanges" function
 * when clicked and is associated with the specified taskId.
 *
 * @param {string} parentNode
 * @param {string} taskId
 * @returns {void}
 */
function addSaveChangesButton(parentNode, taskId) {
    document.getElementById(parentNode).innerHTML += /*html*/ `
        <button type='button' onclick='saveTaskChanges(${taskId})' class='default-button'>
            Ok<img src='./assets/icons/checkmark-icon.svg' class='white-symbol'>
        </button>`;
}

/**
 * Saves changes made to a task with the given taskId.
 *
 * @param {number} taskId
 * @returns {Promise<void>}
 */
async function saveTaskChanges(taskId) {
    saveCurrentEntriesToTask();
    if (checkIfFormSubmittable()) {
        tasks[taskId] = unfinishedTaskData;
        renderTaskChangesSavedElement();
        await setItem("tasks", tasks);
        setTimeout(function () {
            openBoard();
        }, 2000);
    }
}

/**
 * Renders the task changes saved notification element in the 'addTaskContainer'.
 *
 * @returns {void}
 */
function renderTaskChangesSavedElement() {
    if (document.getElementById("addTaskContainer") != null) {
        document.getElementById("addTaskContainer").innerHTML += renderChangesSavedElement();
    }
}

/**
 * Renders the task deleted notification element in the body and removes it after a delay.
 *
 * @returns {void}
 */
function renderTaskDeletedElement() {
    document.body.innerHTML += renderTaskDeletedElement();

    setTimeout(() => {
        document.getElementById("addTaskContainer").remove();
    }, 1500);
}

/**
 * Calls functions to see whether all required input field are set
 *
 * @returns {boolean}
 * */
function checkIfFormSubmittable() {
    if (validateTaskTitle() & validateTaskDescription() & validateTaskDate() & validateTaskCategory() & validateTaskPriority()) {
        return true;
    } else {
        return false;
    }
}

/**
 * Validates the new task title input. Adds tooltip to input field if invalid.
 * @returns {number} true if valid, false if invalid
 */
function validateTaskTitle() {
    const taskTitleInput = document.getElementById("newTaskTitle");
    const taskTitleValue = taskTitleInput.value.trim();

    if (taskTitleValue === "") {
        taskTitleInput.reportValidity();
        return false;
    } else {
        return true;
    }
}

/**
 * Validates the new task description input. Adds tooltip to input field if invalid.
 * @returns {number} true if valid, false if invalid
 */
function validateTaskDescription() {
    const taskDescriptionInput = document.getElementById("newTaskDescription");
    const taskDescriptionValue = taskDescriptionInput.value.trim();

    if (taskDescriptionValue === "") {
        taskDescriptionInput.classList.add("inputCheck");
        taskDescriptionInput.reportValidity();
        return false;
    } else {
        return true;
    }
}

/**
 * Validates the new task date input. Adds tooltip to input field if invalid.
 * @returns {boolean} true if valid, false if invalid
 */
function validateTaskDate() {
    const taskDateInput = document.getElementById("newTaskDate");
    const taskDateValue = taskDateInput.value;

    if (taskDateValue == "" || taskDateValue === "yyyy-mm-dd") {
        taskDateInput.reportValidity();
        taskDateInput.classList.add("input-check");
        return false;
    } else {
        return true;
    }
}

/**
 * Validates the selected task priority to ensure it is not null.
 *
 * @returns {boolean} True if a task priority is selected (not null), false otherwise.
 */
function validateTaskPriority() {
    if (selectedTaskPriority != null) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks if input field "selectCategory" is set; Adds tooltip to input field if invalid.
 * @returns {boolean} true if is set, false if is not set
 */
function validateTaskCategory() {
    const taskCategoryElement = document.getElementById("selectCategory");
    const selectCategoryValue = taskCategoryElement.value;
    if (selectCategoryValue == "") {
        taskCategoryElement.reportValidity();
        return false;
    } else {
        return true;
    }
}
