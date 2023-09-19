/**
 * Submits a new task by saving the current user entries, checking if the form is submittable,
 * adding the task to the 'tasks' array, rendering a task added element,
 * and asynchronously updating the 'tasks' data in storage. Finally, it navigates to the board page after a delay.
 *
 * @returns {Promise<void>} A promise that resolves when the task submission and storage update are complete.
 */
async function submitTask() {
    saveCurrentEntriesToTask();
    if (checkIfFormSubmittable()) {
        tasks.push(unfinishedTaskData);
        renderTaskAddedElement();
        await setItem("tasks", tasks);
        setTimeout(function () {
            openBoard();
        }, 2000);
    }
}

/**
 * Renders a notification element to indicate that a task has been successfully added to the board.
 * This function dynamically generates HTML for the notification element and appends it to the
 * 'addTaskContainer' element to inform the user about the task addition.
 *
 * @returns {void}
 */
function renderTaskAddedElement() {
    if (document.getElementById("addTaskContainer") != null) {
        document.getElementById("addTaskContainer").innerHTML +=/*html*/`<div class="task-created-notification-container">
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
 * Saves the values of specified direct input fields into the 'unfinishedTaskData' object.
 * If the input fields have non-empty values, they are stored in the 'unfinishedTaskData' object
 * with corresponding keys.
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

//RESET INPUT VALUES

/**
 * Empties and resets the elements and input fields within the Add Task form to their default states.
 * This function clears the direct input fields, updates the selected contact icons,
 * refreshes the contact assignment dropdown, resets the priority menu, and clears any indirect inputs.
 *
 * @returns {void}
 */
function emptyAddTaskForm() {
    resetDirectInputFields();
    resetIndirectInputs();
    renderSelectedContactIcons();
    renderContactAssignmentDropDown();
    resetPriority();

    unfinishedTaskData = { "status": "toDo" };
}

/**
 * Resets the values of direct input fields identified by their IDs to empty strings.
 * This function iterates through the provided array of direct input field IDs,
 * retrieves each element by its ID, and sets its value to an empty string if found.
 *
 * @param {string[]} directInputFieldIds - An array of IDs of direct input fields to be reset.
 * @returns {void}
 */
function resetDirectInputFields() {
    directInputFieldIds.forEach(directInputFieldId => {
        let field = document.getElementById(directInputFieldId);
        if (field) {
            field.value = "";
        }
    });
}

/**
 * Resets various indirect inputs and data related to task creation.
 * This function clears the selected task priority, resets the subtasks array,
 * re-renders the subtasks list, clears the subtask input field, and resets assigned contacts data.
 *
 * @returns {void}
 */
function resetIndirectInputs() {
    selectedTaskPriority = null //Priorities= urgent, medium, low
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
    radioButtons.forEach(button => {
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

    document.getElementById("addTaskTitle").innerHTML = 'Edit Task';
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
    document.getElementById("newTaskTitle").value = task['taskName'];
}

/**
 * Sets the value of the "newTaskDescription" input field based on the task's taskDescription property.
 *
 * @param {Object} task - The task object containing task-related data.
 * @returns {void}
 */
function setNewTaskDescriptionFieldValue(task) {
    document.getElementById("newTaskDescription").value = task['taskDescription'];
}

/**
 * Sets the assigned contacts based on the task's "assignedContacts" property.
 * If no assigned contacts are present in the task, an empty array is assigned.
 * It also triggers the rendering of selected contact icons.
 *
 * @param {Object} task - The task object containing task-related data.
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
    document.getElementById("newTaskDate").value = task['taskDate'];
}

/**
 * Sets the priority value for a task by checking the corresponding radio button.
 *
 * @param {Object} task - The task object containing the priority.
 * @param {string} task.priority - The priority value to be set.
 * @returns {void}
 */
function setPriorityValue(task) {
    /**
     * Get a list of radio buttons with the name "priority".
     * @type {NodeListOf<HTMLInputElement>}
     */
    let radioButtons = document.getElementsByName("priority");

    // Store the selected task's priority.
    selectedTaskPriority = task['priority'];

    // Iterate through the radio buttons and check the one that matches the task's priority.
    radioButtons.forEach(button => {
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
 * @param {Object} task - The task object containing task-related data.
 * @returns {void}
 */
function setSubTaskFieldValue(task) {
    if (task['subTasks']) {
        subTasks = task['subTasks'];
    }
    if (subTasks) {
        renderSubTasksList();
    }
}

/**
 * Replaces the existing buttons in the specified parent element with a "Save Changes" button.
 * The new button is associated with the given task ID and triggers the "saveTaskChanges" function when clicked.
 *
 * @param {string} parentId - The ID of the parent element where buttons will be replaced.
 * @param {string} taskId - The ID of the task associated with the "Save Changes" button.
 * @returns {void}
 */
function replaceCurrentAddTaskSubmit(taskId) {
    removeAllButtons('formOptions');
    addSaveChangesButton('formOptions', taskId);
}

/**
 * Removes all buttons from the specified parent element by iterating through and deleting them.
 *
 * @param {string} parentId - The ID of the parent element containing the buttons to be removed.
 * @returns {void}
 */
function removeAllButtons(parentId) {
    // Get the div element with the specified id
    var formOptionsDiv = document.getElementById(parentId);

    // Get all buttons within the div
    var buttons = formOptionsDiv.getElementsByTagName("button");

    // Loop through the buttons and remove them
    for (var i = buttons.length - 1; i >= 0; i--) {
        var button = buttons[i];
        button.parentNode.removeChild(button);
    }
}

/**
 * Adds a "Save Changes" button to the specified parent element. The button triggers the "saveTaskChanges" function
 * when clicked and is associated with the specified taskId.
 *
 * @param {string} parentNode - The ID of the parent element where the button will be added.
 * @param {string} taskId - The ID of the task associated with the "Save Changes" button.
 * @returns {void}
 */
function addSaveChangesButton(parentNode, taskId) {
    document.getElementById(parentNode).innerHTML +=/*html*/`
        <button type='button' onclick='saveTaskChanges(${taskId})' class='default-button'>
            Ok<img src='./assets/icons/checkmark-icon.svg' class='white-symbol'>
        </button>`;
}

/**
 * Saves changes made to a task with the given taskId.
 *
 * @param {number} taskId - The ID of the task to save changes for.
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

function renderTaskChangesSavedElement() {
    if (document.getElementById("addTaskContainer") != null) {
        document.getElementById("addTaskContainer").innerHTML +=/*html*/`<div class="task-created-notification-container">
        <div class="task-created-notification"><p>Task saved</p><img src="./assets/icons/board-icon.svg"></div>
    </div>`;
    }
}

function renderTaskDeletedElement() {
    document.body.innerHTML +=/*html*/`
        <div id="addTaskContainer">
            <div class="task-created-notification-container">
                <div class="task-created-notification">
                    <p>Task deleted</p><img src="./assets/icons/board-icon.svg">
                </div>
            </div>
        </div>`;

    setTimeout(() => {
        document.getElementById("addTaskContainer").remove();
    }, 1500);
}

/** 
 * Calls functions to see whether all required input field are set 
 * 
 * @returns {boolean} true if form is submittable; false if not;
 * 
 * */
function checkIfFormSubmittable() {
    if (
        validateTaskTitle()
        & validateTaskDescription()
        & validateTaskDate()
        & validateTaskCategory()
        & validateTaskPriority()
    ) {
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
    /** @type {HTMLInputElement} */
    const taskTitleInput = document.getElementById("newTaskTitle");
    /** @type {string} */
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
    /** @type {HTMLInputElement} */
    const taskDescriptionInput = document.getElementById("newTaskDescription");
    /** @type {string} */
    const taskDescriptionValue = taskDescriptionInput.value.trim();

    if (taskDescriptionValue === "") {
        taskDescriptionInput.classList.add('inputCheck');
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
    /** @type {HTMLInputElement} */
    const taskDateInput = document.getElementById("newTaskDate");

    /** @type {string} */
    const taskDateValue = taskDateInput.value;

    if (taskDateValue == "" || taskDateValue === "yyyy-mm-dd") {
        taskDateInput.reportValidity();
        taskDateInput.classList.add('input-check');
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
    /** @type {HTMLSelectElement} */
    const taskCategoryElement = document.getElementById("selectCategory");
    /** @type {string} */
    const selectCategoryValue = taskCategoryElement.value;
    if (selectCategoryValue == "") {
        taskCategoryElement.reportValidity();
        return false;
    } else {
        return true;
    }
}