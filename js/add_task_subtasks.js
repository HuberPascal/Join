/**
 * Creates a new subtask based on the value entered in the "subtaskField" input element.
 * If a non-empty value is provided, it creates a subtask object with the name and default completion status.
 * The new subtask is then added to the 'subTasks' array, and the list of subtasks is re-rendered.
 * If the input value is empty, no subtask is created.
 *
 * @returns {void}
 */
function createSubTask() {
    subTaskName = document.getElementById("subtaskField").value;
    subtask =
    {
        "name": subTaskName,
        "isComplete": 0
    }
    if (subTaskName != "") {
        subTasks.push(subtask);
    }
    renderSubTasksList();
    resetSubTaskInput();
}

/**
 * Displays the 'approveSubtaskMenu' and hides the 'enterSubtaskCreation' menu.
 * 
 * @returns {void}
 */
function approveSubtaskMenu() {
    document.getElementById("approveSubtaskMenu").classList.remove("hide");
    document.getElementById("enterSubtaskCreation").classList.add("hide");
}

/**
 * Deletes a subtask from the 'subTasks' array based on the provided element's ID.
 * After deletion, it clears any editing interface and re-renders the list of subtasks.
 *
 * @param {HTMLElement} element - The HTML element representing the deletion action for the subtask.
 * @returns {void}
 */
function deleteSubTask(element) {
    let id = element.id.replace("deleteSubTask", "");
    subTasks.splice(id, 1);
    setElementHtml("editSubTaskField", "");
    renderSubTasksList();
}

/**
 * Approves the edited subtask by updating its name and clearing the editing interface.
 * The function retrieves the edited subtask's input field, updates the subtask's name with
 * the edited value, clears the input field, and re-renders the list of subtasks.
 *
 * @param {HTMLElement} element - The HTML element representing the approval action for the subtask.
 * @returns {void}
 */
function approveSubTask(element) {
    let i = element.id.replace("approveSubTask", "");
    let editSubTaskInputfield = document.getElementById(`editSubtaskField${i}`);
    subTasks[i]['name'] = editSubTaskInputfield.value;
    editSubTaskInputfield.innerHtml = "";
    setElementHtml("editSubTaskField", "");
    renderSubTasksList();
}

/**
 * Initiates the editing of a subtask by replacing its name with an editable input field.
 * The input field is populated with the current subtask name for editing.
 * Additionally, it provides menu options for deleting or approving the edited subtask.
 *
 * @param {HTMLElement} element - The HTML element representing the subtask to be edited.
 * @returns {void}
 */
function editSubTask(element) {
    let i = element.id.replace("editSubTask", "");
    let valueToEdit = subTasks[i]['name'];
    document.getElementById("editSubTaskField").innerHTML =/*html*/`
    <input type='text' class='edit-subtask-field' id='editSubtaskField${i}' value='${valueToEdit}'>
    <div class='edit-subtask-menu'>
        <img src='./assets/icons/trashcan-icon.svg' id='deleteSubTask${i}' class='animated-icon' onclick='deleteSubTask(this)'>
        <div class='approve-subtask-menu-border'></div>
        <img src='./assets/icons/checkmark-icon.svg' id='approveSubTask${i}' class='animated-icon' onclick='approveSubTask(this)'>
    </div>`;
    setElementHtml("currentSelectedSubtasks", "");
}

/**
 * Generates HTML markup for displaying a list of subtasks based on the 'subTasks' array.
 * If there are subtasks available, it creates an ordered list (ol) with each subtask item containing
 * the subtask name and associated menu icons (delete and edit).
 * If there are no subtasks, it returns an empty string.
 *
 * @returns {string} The HTML markup for the list of subtasks or an empty string if there are no subtasks.
 */
function getSubTasksListHtml() {
    if (subTasks.length > 0) {
        let html = "<uol>";
        for (let i = 0; i < subTasks.length; i++) {
            const subtask = subTasks[i];
            html += /*html*/ `
            <li class='shown-subtask' id='shownSubtask${i}'>
                ${subtask['name']}
                <div class='shown-subtask-menu'>
                    <img src="./assets/icons/trashcan-icon.svg" id="deleteSubTask${i}"  class="animated-icon" onclick='deleteSubTask(this)'>
                    <div class="approve-subtask-menu-border"></div>
                    <img src="./assets/icons/pen-icon.svg"      id="editSubTask${i}"    class="animated-icon" onclick="editSubTask(this)">
                </div>
            </li>`;
        }
        html += "</uol>";
        return html;
    } else {
        return "";
    }
}

/**
 * Renders the list of subtasks by setting the HTML content of an element.
 * @function
 * @returns {void}
 */
function renderSubTasksList() {
    setElementHtml("currentSelectedSubtasks", getSubTasksListHtml());
}

/**
 * Sets event listeners for a subtask input field.
 * When the input field receives focus, it triggers the 'approveSubtaskMenu' function,
 * and when it loses focus and is empty, it triggers the 'defaultSubtaskMenu' function.
 */
function setSubTaskEventListeners() {
    const inputField = document.getElementById('subtaskField');

    /**
     * Event listener for the 'focus' event on the subtask input field.
     * @listens focus
     */
    inputField.addEventListener('focus', function () {
        approveSubtaskMenu();
    });

    /**
     * Event listener for the 'blur' event on the subtask input field.
     * If the input field is empty, it triggers the 'defaultSubtaskMenu' function.
     * @listens blur
     */
    inputField.addEventListener('blur', function () {
        if (document.getElementById("subtaskField").value == "") {
            defaultSubtaskMenu();
        }
    });
}

/**
 * Resets the value of the "subtaskField" input element to an empty string.
 *
 * @returns {void}
 */
function resetSubTaskInput() {
    setElementValue("subtaskField", "");
}

/**
 * Displays the 'approveSubtaskMenu' and hides the 'enterSubtaskCreation' menu.
 * 
 * @returns {void}
 */
function approveSubtaskMenu() {
    document.getElementById("approveSubtaskMenu").classList.remove("hide");
    document.getElementById("enterSubtaskCreation").classList.add("hide");
}

/**
 * Displays the 'enterSubtaskCreation' and hides the 'approveSubtaskMenu' menu.
 * 
 * @returns {void}
 */
function defaultSubtaskMenu() {
    document.getElementById("approveSubtaskMenu").classList.add("hide");
    document.getElementById("enterSubtaskCreation").classList.remove("hide");
}