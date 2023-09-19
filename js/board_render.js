/**
 * Renders an HTML progress bar based on the provided progress percentage, completed subtask count, and total subtask count.
 *
 * @param {number} progressPercentage - The progress percentage (0-100).
 * @param {number} completedSubtaskCount - The count of completed subtasks.
 * @param {number} subtaskCount - The total count of subtasks.
 * @returns {string} The HTML code for the progress bar.
 */
function renderProgressBar(progressPercentage, completedSubtaskCount, subtaskCount) {
    return `
    <div class="progress-bar-section">
        <div class="progress-bar">
            <div class="progress" style="width: ${progressPercentage}%;"></div>
        </div>
        <div class="progress-bar-subtasks">${completedSubtaskCount}/${subtaskCount} Subtasks</div>
    </div>
    `;
}

/**
 * Renders an HTML task card based on the provided data and elements.
 *
 * @param {number} index - The index of the task.
 * @param {object} task - The task object containing task information.
 * @param {string} categoryClass - The CSS class for the task category.
 * @param {string} progressBarHTML - The HTML code for the progress bar.
 * @param {string} assignedContactsIcons - The HTML code for assigned contact icons.
 * @param {string} priorityImageSrc - The image source URL for task priority.
 * @returns {string} The HTML code for the task card.
 */
function renderTaskCards(index, task, categoryClass, progressBarHTML, assignedContactsIcons, priorityImageSrc) {
    return `
    <div id="taskCard${index}" onclick="showTaskCard(${index})" draggable="true" ondrop="moveTo(event)" ondragstart="startDragging(${index})" class="task-card" data-category="${task['status']}">
        <div class="task-headline">
            <div class="card-category ${categoryClass}">${task['taskCategoryValue']}</div> 
            <div class="move" onclick="showMoveTo(event, ${index}, '${task['status']}')">Move</div>
        </div>
        <div>
            <h4>${task['taskName']}</h4>
            <div class="card-description">${task['taskDescription']}</div>
        </div>
        ${progressBarHTML}
        <div class="task-card-bottom-section">
            <div class="task-card-users">
                ${assignedContactsIcons}
            </div>
            <img src="${priorityImageSrc}" alt="Prio">
        </div>
    </div>
    `;
}

/**
 * Generates an HTML task card for display in an overlay.
 *
 * @param {number} index - The index of the task.
 * @param {string} categoryClass - The CSS class for the task category.
 * @param {string} category - The task category.
 * @param {string} name - The task name.
 * @param {string} description - The task description.
 * @param {string} date - The due date of the task.
 * @param {string} priority - The priority level of the task.
 * @param {string} priorityImageSrc - The image source URL for task priority.
 * @param {string} getAssignedText - The HTML for the assigned contacts text.
 * @param {string} assignedContactsHTML - The HTML for assigned contacts icons.
 * @param {string} getSubtaskText - The HTML for the subtasks text.
 * @param {string} subtasksHTML - The HTML for subtasks.
 * @returns {string} The HTML code for the task card overlay.
 */
function generateTaskCardHTML(index, categoryClass, category, name, description, date, priority, priorityImageSrc, getAssignedText, assignedContactsHTML, getSubtaskText, subtasksHTML) {
    return `
        <div id="overlayBoard" class="overlayBoard" onclick="loadTasksHTML()">
            <div id="taskCard${index}" class="task-card-overlay">
                <div class="card-category-top-section">
                    <div class="card-category-overlay ${categoryClass}">${category}</div> 
                    <img onclick="closeBoardOverlay(), loadTasksHTML();" src="assets/icons/close.svg">
                </div>
                <div>
                    <h4 class="title-h4">${name}</h4>
                </div>
                <div class="card-description-overlay">${description}</div>
                <div  class="card-description-overlay">
                    <div class="dark-gray">Due date:</div>
                    <div>${date}</div>
                </div>
                <div class="priority-container card-description-overlay">
                    <div class="dark-gray">Priority:</div>
                    <div class="priority">
                        <div>${priority}</div>
                        <img src="${priorityImageSrc}">
                    </div>
                </div>
                <div id="assign" class="assigned">
                        ${getAssignedText}
                        ${assignedContactsHTML}
                </div>
                <div class="subtasks">
                    <div id="subtaskTitel" class="subtaskTitel">
                        ${getSubtaskText}
                    </div>
                    <div class="subtasks-container">
                        <div class="subtasks-container">
                            ${subtasksHTML}
                        </div>
                    </div>
                </div>
                <div class="edit-container">
                    <div class="edit" onmouseover="changeImage('assets/icons/delete-blue.svg', 'trashImage')" onmouseout="changeImage('assets/icons/trashcan-icon.svg', 'trashImage')" onclick="deleteTask(${index})">
                        <img id="trashImage" src="assets/icons/trashcan-icon.svg">
                        <div>Delete</div>
                    </div>
                    <img src="assets/image/board/edit-line.svg">
                    <div onclick="openEditTaskTemplate(${index})" class="edit" onmouseover="changeImage('assets/icons/edit-blue.svg', 'editImage')" onmouseout="changeImage('assets/icons/pen-icon.svg', 'editImage')">
                        <img id="editImage" src="assets/icons/pen-icon.svg"> 
                        <div ">Edit</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates HTML code for a subtask within a task card.
 *
 * @param {string} subtaskId - The ID of the subtask.
 * @param {number} subtaskStatus - The status of the subtask (0 for incomplete, 1 for complete).
 * @param {number} i - The index of the subtask within the subtasks array.
 * @param {number} index - The index of the parent task.
 * @param {string} subtaskImgSrc - The image source URL for the subtask.
 * @param {object} subtask - The subtask object containing its name and other details.
 * @returns {string} The HTML code for the subtask.
 */
function renderSubtask(subtaskId, subtaskStatus, i, index, subtaskImgSrc, subtask) {
    return `
        <div class="subtask" onclick="subtaskChangeImg('${subtaskId}'); saveSubtask(${subtaskStatus}, ${i}, ${index}), loadTasksHTML()">
            <img id="${subtaskId}" src="${subtaskImgSrc}">
            <div>${subtask['name']}</div>
        </div>
    `;
}

/**
 * Generates HTML code for assigned contacts within a task card.
 *
 * @param {object} contacts - An object containing contact information.
 * @param {string} assignedContact - The ID of the assigned contact.
 * @returns {string} The HTML code for assigned contacts.
 */
function getAssignedContactsRenderHTML(contacts, assignedContact) {
    if (assignedContact && contacts[assignedContact]) {
        return `
            <div class='assigned-contacts'>
                <div class='contact-circle'>${getContactIconHtml(contacts[assignedContact])}</div>
                ${contacts[assignedContact]['name']}
            </div>
        `;
    } else {
        return "";
    }
}

/**
 * Generates the HTML for the "Move To" dropdown menu in a task card.
 *
 * @param {number} index - The index of the task card.
 * @returns {string} - The generated HTML for the "Move To" dropdown menu.
 */
function renderMoveToInTaskCards(index) {
    return `
        <div id="taskMoveTo" class="task-moveTo">
            <div onclick="renderTaskCardAgain(event)" class="moveTo-img">
                <img src="assets/icons/close.svg">
            </div>
            <span class="moveTo-h4">Move to</span>
            <div class="move-categorys">
                <span onclick="newDataCategory(event, 'toDo', ${index})" id="moveToDo" class="move-task-button">To-Do</span>
                <span onclick="newDataCategory(event, 'inProgress', ${index})" id="moveInProgress" class="move-task-button">In Progress</span>
                <span onclick="newDataCategory(event, 'awaitFeedback', ${index})" id="moveAwaitFeedback" class="move-task-button">Awaiting Feedback</span>
                <span onclick="newDataCategory(event, 'done', ${index})" id="moveDone" class="move-task-button">Done</span>
            </div> 
        </div>
    `;
}

/**
 * Renders the HTML for a task and appends it to the 'toDo' section.
 *
 * @param {object} task - The task object to be rendered.
 * @param {number} index - The index of the task.
 */
function renderTaskHTML(task, index){
    let taskStatus=task['status'];
    document.getElementById(taskStatus).innerHTML += generateHTML(task, index);
}

/**
 * Renders the HTML for a task in the 'Todo' category based on the provided task, index, and filter.
 *
 * @param {Array} todo - An array of tasks in the 'Todo' category.
 * @param {object} task - The task to render.
 * @param {number} index - The index of the task in the tasks array.
 * @returns {void}
 */
function renderTodoTaskHTML(todo, task, index) {
    if (todo.length > 0) {
        if (task['status'] == 'toDo') {
            document.getElementById('toDo').innerHTML += generateHTML(task, index);
        }
    } else {
        document.getElementById('toDo').innerHTML = renderNoTaskToDo();
    }
}

/**
 * Renders the HTML for a task in the 'In Progress' category based on the provided task, index, and filter.
 *
 * @param {Array} inProgress - An array of tasks in the 'In Progress' category.
 * @param {object} task - The task to render.
 * @param {number} index - The index of the task in the tasks array.
 * @returns {void}
 */
function renderInProgressTaskHTML(inProgress, task, index) {
    if (inProgress.length > 0) {
        if (task['status'] == 'inProgress') {
            document.getElementById('inProgress').innerHTML += generateHTML(task, index);
        }
    } else {
        document.getElementById('inProgress').innerHTML = renderNoInProgress();
    }
}
         
/**
 * Renders the HTML for a task in the 'Awaiting Feedback' category based on the provided task, index, and filter.
 *
 * @param {Array} awaitFeedback - An array of tasks in the 'Awaiting Feedback' category.
 * @param {object} task - The task to render.
 * @param {number} index - The index of the task in the tasks array.
 * @returns {void}
 */
function renderAwaitFeedbackTaskHTML(awaitFeedback, task, index) {
    if (awaitFeedback.length > 0) {
        if (task['status'] == 'awaitFeedback') {
            document.getElementById('awaitFeedback').innerHTML += generateHTML(task, index);
        }
    } else {
        document.getElementById('awaitFeedback').innerHTML = renderNoAwaitFeedback();
    }
}

/**
 * Renders the HTML for a task in the 'Done' category based on the provided task, index, and filter.
 *
 * @param {Array} done - An array of tasks in the 'Done' category.
 * @param {object} task - The task to render.
 * @param {number} index - The index of the task in the tasks array.
 * @returns {void}
 */
function renderDoneTaskHTML(done, task, index) {
    if (done.length > 0) {
        if (task['status'] == 'done') {
            document.getElementById('done').innerHTML += generateHTML(task, index);
        }
    } else {
        document.getElementById('done').innerHTML = renderNoDone();
    }
}