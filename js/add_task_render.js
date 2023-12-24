/**
 * Renders an HTML element for a changes saved notification.
 * @returns {string} HTML markup for the changes saved notification.
 */
function renderChangesSavedElement() {
    return /*html*/ `
    <div class="task-created-notification-container">
        <div class="task-created-notification"><p>Task saved</p><img src="./assets/icons/board-icon.svg"></div>
    </div>`;
}

/**
 * Renders an HTML element for a task deleted notification.
 * @returns {string} HTML markup for the task deleted notification.
 */
function renderTaskDeletedElement() {
    return /*html*/ `
      <div id="addTaskContainer">
          <div class="task-created-notification-container">
              <div class="task-created-notification">
                  <p>Task deleted</p><img src="./assets/icons/board-icon.svg">
              </div>
          </div>
      </div>`;
}

/**
 * Renders HTML for editing a subtask.
 * @param {string} valueToEdit - The value to be edited.
 * @param {number} i - The index of the subtask.
 * @returns {string} HTML markup for editing a subtask.
 */
function renderEditSubtask(valueToEdit, i) {
    return /*html*/ `
    <input type='text' class='edit-subtask-field' id='editSubtaskField${i}' value='${valueToEdit}'>
    <div class='edit-subtask-menu'>
        <img src='./assets/icons/trashcan-icon.svg' id='deleteSubTask${i}' class='animated-icon-subtask' onclick='deleteSubTask(this)'>
        <div class='approve-subtask-menu-border'></div>
        <img src='./assets/icons/checkmark-icon.svg' id='approveSubTask${i}' class='animated-icon-subtask' onclick='approveSubTask(this)'>
    </div>`;
}

/**
 * Renders HTML for a subtask list item.
 * @param {Object} subtask - The subtask object.
 * @param {number} i - The index of the subtask.
 * @returns {string} HTML markup for a subtask list item.
 */
function renderSubtaskListHTML(subtask, i) {
    return /*html*/ `
    <li class='shown-subtask' id='shownSubtask${i}'>
        ${subtask["name"]}
        <div class='shown-subtask-menu'>
            <img src="./assets/icons/trashcan-icon.svg" id="deleteSubTask${i}"  class="animated-icon" onclick='deleteSubTask(this)'>
            <div class="approve-subtask-menu-border"></div>
            <img src="./assets/icons/pen-icon.svg"      id="editSubTask${i}"    class="animated-icon" onclick="editSubTask(this)">
        </div>
    </li>`;
}
