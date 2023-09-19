let currentDraggedElement;
/**
 * Updates the HTML representation of the entire task board by updating individual categories.
 *
 * @function
 * @returns {void}
 */
async function updateBoardHTML() {
  await init();
  loadTasksHTML();
  loadEventListeners();
}
async function boardInit() {
  await includeHTML(2);
  updateBoardHTML();
  setUserHeaderInitials();
}

/**
 * Updates the HTML view of task sections ('Todo', 'In Progress', 'Awaiting Feedback', 'Done').
 * This function clears the content of each section, filters tasks based on their status,
 * and generates and inserts HTML elements for each task in the corresponding sections.
 *
 * @function
 * @returns {void}
 */
function loadTasksHTML(filter = null) {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";

  const todo = tasks.filter((t) => t["status"] == "toDo" && checkFilter(t, filter));
  const inProgress = tasks.filter((t) => t["status"] == "inProgress" && checkFilter(t, filter));
  const awaitFeedback = tasks.filter((t) => t["status"] == "awaitFeedback" && checkFilter(t, filter));
  const done = tasks.filter((t) => t["status"] == "done" && checkFilter(t, filter));

  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    if (checkFilter(task, filter)) {
      renderTodoTaskHTML(todo, task, index);
      renderInProgressTaskHTML(inProgress, task, index);
      renderAwaitFeedbackTaskHTML(awaitFeedback, task, index);
      renderDoneTaskHTML(done, task, index);
    }
  }
}

function checkFilter(task, filter) {
  return (
    filter == null ||
    task["taskName"].toLowerCase().includes(filter) ||
    task["taskDescription"].toLowerCase().includes(filter)
  );
}

/**
 * Renders HTML to display a message when there are no tasks to do.
 *
 * @function
 * @returns {string} The HTML code for displaying the message.
 */
function renderNoTaskToDo() {
  return `<div class="noToDo">No tasks To do</div>`;
}

/**
 * Renders HTML to display a message when there are no tasks in progress.
 *
 * @function
 * @returns {string} The HTML code for displaying the message.
 */
function renderNoInProgress() {
  return `<div class="noToDo">No tasks In progress</div>`;
}

/**
 * Renders HTML to display a message when there are no tasks awaiting feedback.
 *
 * @function
 * @returns {string} The HTML code for displaying the message.
 */
function renderNoAwaitFeedback() {
  return `<div class="noToDo">No tasks Await feedback</div>`;
}

/**
 * Renders HTML to display a message when there are no tasks marked as done.
 *
 * @function
 * @returns {string} The HTML code for displaying the message.
 */
function renderNoDone() {
  return `<div class="noToDo">No tasks Done</div>`;
}

/**
 * Generates HTML for a task card.
 *
 * @param {Object} task - The task object.
 * @param {number} index - The index of the task.
 * @returns {string} The HTML code for the task card.
 */
function generateHTML(task, index) {
  const assignedContactsIcons = getAssignedContactIcons(task["assignedContacts"]);
  const priority = task["priority"];
  const subtaskCount = task["subTasks"] ? task["subTasks"].length : 0;
  const completedSubtaskCount = countCompletedSubtasks(task);
  const progressBarHTML = generateProgressBarHTML(completedSubtaskCount,subtaskCount);
  const categoryClass = getCategoryClass(task);
  const priorityImageSrc = getPriorityImageSrc(priority);
  return renderTaskCards( index, task, categoryClass, progressBarHTML, assignedContactsIcons, priorityImageSrc);
}

/**
 * Counts the number of completed subtasks in a task.
 *
 * @param {Object} task - The task object.
 * @returns {number} The number of completed subtasks.
 */
function countCompletedSubtasks(task) {
  let completedSubtaskCount = 0;
  const subtaskCount = task["subTasks"] ? task["subTasks"].length : 0;

  if (subtaskCount > 0) {
    for (let i = 0; i < subtaskCount; i++) {
      if (task["subTasks"][i]["isComplete"] === 1) {
        completedSubtaskCount++;
      }
    }
  }
  return completedSubtaskCount;
}

/**
 * Generates HTML for a progress bar based on completed and total subtasks.
 *
 * @param {number} completedSubtaskCount - The number of completed subtasks.
 * @param {number} subtaskCount - The total number of subtasks.
 * @returns {string} The HTML code for the progress bar.
 */
function generateProgressBarHTML(completedSubtaskCount, subtaskCount) {
  let progressBarHTML = "";

  if (subtaskCount > 0) {
    const progressPercentage = (completedSubtaskCount / subtaskCount) * 100;
    progressBarHTML = renderProgressBar(
      progressPercentage,
      completedSubtaskCount,
      subtaskCount
    );
  }
  return progressBarHTML;
}

/**
 * Determines and returns the CSS class based on the task's category value.
 *
 * @param {Object} task - The task object.
 * @returns {string} The CSS class corresponding to the task's category.
 */
function getCategoryClass(task) {
  let categoryClass = "";
  if (task["taskCategoryValue"] === "Technical Task") {
    categoryClass = "category-technical";
  } else if (task["taskCategoryValue"] === "Contact Story") {
    categoryClass = "category-contact-story";
  }
  return categoryClass;
}

/**
 * Generates HTML for assigned contact icons based on the provided assigned contacts.
 *
 * @param {Array|null} assignedContacts - An array of assigned contact IDs.
 * @returns {string} The HTML code for assigned contact icons.
 */
function getAssignedContactIcons(assignedContacts) {
  let contactIconHtml = "";
  let firstItem = true;
  let insertedContacts = 0;

  if (assignedContacts != null) {
    assignedContacts.forEach((assignedContact) => {
      if (insertedContacts < 6) {
        let contactIcon = getContactIconHtml(contacts[assignedContact]);
        if (firstItem == true) {contactIcon = contactIcon.replace(
            /class="circle"/g,
            'class="circle circle-1"'
          );
          firstItem = false;
        } else {contactIcon = contactIcon.replace(
            /class="circle"/g,
            'class="circle circle-2"'
          );
        }
        contactIconHtml += contactIcon;
        insertedContacts++;
      }
    });
  }
  return contactIconHtml;
}

/**
 * Adds a CSS class to highlight a DOM element with the specified ID.
 *
 * @function
 * @param {string} id - The ID of the DOM element to highlight.
 * @returns {void}
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes a CSS class to remove the highlight from a DOM element with the specified ID.
 *
 * @function
 * @param {string} id - The ID of the DOM element to remove the highlight from.
 * @returns {void}
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Sets the currently dragged element to the specified ID.
 *
 * @function
 * @param {string} id - The ID of the element being dragged.
 * @returns {void}
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Prevents the default behavior of a drop event to allow dropping content.
 *
 * @function
 * @param {Event} ev - The drop event object.
 * @returns {void}
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a different category based on the specified event and category data.
 *
 * @function
 * @param {Event} ev - The event object triggering the move.
 * @returns {void}
 */
function moveTo(ev) {
  ev.preventDefault();

  currentNode = ev.target;
  let category = currentNode.getAttribute("data-category");
  if (category == null) {
    currentNode = currentNode.parentNode;
    category = currentNode.getAttribute("data-category");
    if (category == null) {
      currentNode = currentNode.parentNode;
      category = currentNode.getAttribute("data-category");
      if (category == null) {
        currentNode = currentNode.parentNode;
        category = currentNode.getAttribute("data-category");
      }
    }
  }

  if (category && currentDraggedElement !== undefined) {
    tasks[currentDraggedElement]["status"] = category;
    setItem("tasks", tasks);
    loadTasksHTML();
  }
}

async function deleteTask(taskIndex) {
  tasks.splice([taskIndex], 1);
  setItem("tasks", tasks);
  removeOverlayBoard();
  renderTaskDeletedElement();

  setTimeout(() => {
    loadTasksHTML();
  }, 500);
}

/**
 * Filters and updates the 'Todo' category based on a search query.
 *
 * @function
 * @returns {void}
 */
function filterToDo() {
  let searchInput = document.getElementById("search-input").value;
  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    console.log(searchInput)
    let list = document.getElementById("toDo");
    list.innerHTML = "";

    let todo = tasks.filter((t) => t["status"] == "toDo");
    renderSearchListToDo(todo, list, searchInput);
  } else {
    loadTasksHTML();
  }
}

/**
 * Filters and updates the 'Todo' task section in a responsive manner based on a search input.
 * This function retrieves the search input value, converts it to lowercase, clears the 'Todo' section content,
 * and filters 'Todo' tasks that match the search criteria. It then renders the filtered tasks in the section.
 *
 * @function
 * @returns {void}
 */
function filterToDoResponsive() {
  let searchInput = document.getElementById("search-input-responsive").value;

  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    let list = document.getElementById("todo");
    list.innerHTML = "";

    let todo = tasks.filter((t) => t["status"] == "toDo");
    renderSearchListToDo(todo, list, searchInput);
  }
}

/**
 * Renders a filtered list of 'Todo' category tasks based on a search query.
 *
 * @function
 * @param {Array} todo - An array of tasks in the 'Todo' category.
 * @param {HTMLElement} list - The HTML list element where the filtered tasks will be displayed.
 * @param {string} searchInput - The search query to filter tasks.
 * @returns {void}
 */
function renderSearchListToDo(todo, list, searchInput) {
  searchElementsFound = false;

  if (todo.length > 0) {
    for (let i = 0; i < todo.length; i++) {
      let element = todo[i];
      if (element["taskName"].toLowerCase().includes(searchInput)) {
        list.innerHTML += generateHTML(element);
        searchElementsFound = true;
      }
    }
  }
  if (!searchElementsFound) {
    list.innerHTML = renderNoTaskToDo();
  }
}

/**
 * Filters and updates the 'In Progress' category based on a search query.
 *
 * @function
 * @returns {void}
 */
function filterInProgress() {
  let searchInput = document.getElementById("search-input").value;
  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    let list = document.getElementById("inProgress");
    list.innerHTML = "";

    let progress = tasks.filter((t) => t["status"] == "inProgress");
    renderSearchListInProgress(progress, list, searchInput);
  }
}

/**
 * Filters and updates the 'In Progress' task section in a responsive manner based on a search input.
 * This function retrieves the search input value, converts it to lowercase, clears the 'In Progress' section content,
 * and filters 'In Progress' tasks that match the search criteria. It then renders the filtered tasks in the section.
 *
 * @function
 * @returns {void}
 */
function filterInProgressResponsive() {
  let searchInput = document.getElementById("search-input-responsive").value;

  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    let list = document.getElementById("inProgress");
    list.innerHTML = "";

    let inProgress = tasks.filter((t) => t["status"] == "inProgress");
    renderSearchListToDo(inProgress, list, searchInput);
  }
}

/**
 * Renders a filtered list of 'In Progress' category tasks based on a search query.
 *
 * @function
 * @param {Array} progress - An array of tasks in the 'In Progress' category.
 * @param {HTMLElement} list - The HTML list element where the filtered tasks will be displayed.
 * @param {string} searchInput - The search query to filter tasks.
 * @returns {void}
 */
function renderSearchListInProgress(progress, list, searchInput) {
  searchElementsFound = false;

  if (progress.length > 0) {
    for (let i = 0; i < progress.length; i++) {
      let element = progress[i];
      if (element["taskName"].toLowerCase().includes(searchInput)) {
        list.innerHTML += generateHTML(element, i);
        searchElementsFound = true;
      }
    }
  }
  if (!searchElementsFound) {
    list.innerHTML = renderNoInProgress();
  }
}

/**
 * Filters and updates the 'Await Feedback' category based on a search query.
 *
 * @function
 * @returns {void}
 */
function filterAwaitFeedback() {
  let searchInput = document.getElementById("search-input").value;
  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    let list = document.getElementById("awaitFeedback");
    list.innerHTML = "";

    let feedback = tasks.filter((t) => t["status"] == "awaitFeedback");
    renderSearchListAwaitFeedback(feedback, list, searchInput);
  }
}

/**
 * Filters and updates the 'Await Feedback' task section in a responsive manner based on a search input.
 * This function retrieves the search input value, converts it to lowercase, clears the 'Await Feedback' section content,
 * and filters 'Await Feedback' tasks that match the search criteria. It then renders the filtered tasks in the section.
 *
 * @function
 * @returns {void}
 */
function filterAwaitFeedbackResponsive() {
  let searchInput = document.getElementById("search-input-responsive").value;

  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    let list = document.getElementById("awaitFeedback");
    list.innerHTML = "";

    let awaitFeedback = tasks.filter((t) => t["status"] == "awaitFeedback");
    renderSearchListToDo(awaitFeedback, list, searchInput);
  }
}

/**
 * Renders a filtered list of 'Await Feedback' category tasks based on a search query.
 *
 * @function
 * @param {Array} feedback - An array of tasks in the 'Await Feedback' category.
 * @param {HTMLElement} list - The HTML list element where the filtered tasks will be displayed.
 * @param {string} searchInput - The search query to filter tasks.
 * @returns {void}
 */
function renderSearchListAwaitFeedback(feedback, list, searchInput) {
  searchElementsFound = false;

  if (feedback.length > 0) {
    for (let i = 0; i < feedback.length; i++) {
      let element = feedback[i];
      if (element["taskName"].toLowerCase().includes(searchInput)) {
        list.innerHTML += generateHTML(element, i);
        searchElementsFound = true;
      }
    }
  }
  if (!searchElementsFound) {
    list.innerHTML = renderNoAwaitFeedback();
  }
}

/**
 * Filters and updates the 'Done' category based on a search query.
 *
 * @function
 * @returns {void}
 */
function filterDone() {
  let searchInput = document.getElementById("search-input").value;
  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    let list = document.getElementById("done");
    list.innerHTML = "";

    let done = tasks.filter((t) => t["status"] == "done");
    renderSearchListDone(done, list, searchInput);
  }
}

/**
 * Filters and updates the 'Done' task section in a responsive manner based on a search input.
 * This function retrieves the search input value, converts it to lowercase, clears the 'Done' section content,
 * and filters 'Done' tasks that match the search criteria. It then renders the filtered tasks in the section.
 *
 * @function
 * @returns {void}
 */
function filterDoneResponsive() {
  let searchInput = document.getElementById("search-input-responsive").value;

  if (searchInput > "") {
    searchInput = searchInput.toLowerCase();
    let list = document.getElementById("done");
    list.innerHTML = "";

    let done = tasks.filter((t) => t["status"] == "done");
    renderSearchListToDo(done, list, searchInput);
  }
}

/**
 * Renders a filtered list of 'Done' category tasks based on a search query.
 *
 * @function
 * @param {Array} done - An array of tasks in the 'Done' category.
 * @param {HTMLElement} list - The HTML list element where the filtered tasks will be displayed.
 * @param {string} searchInput - The search query to filter tasks.
 * @returns {void}
 */
function renderSearchListDone(done, list, searchInput) {
  searchElementsFound = false;

  if (done.length > 0) {
    for (let i = 0; i < done.length; i++) {
      let element = done[i];
      if (element["taskName"].toLowerCase().includes(searchInput)) {
        list.innerHTML += generateHTML(element, i);
        searchElementsFound = true;
      }
    }
  }
  if (!searchElementsFound) {
    list.innerHTML = renderNoDone();
  }
}

/**
 * Display a detailed task card for a specific task.
 *
 * @param {number} index - The index of the task to display.
 */
function showTaskCard(index) {
  const task = tasks[index];
  const categoryClass = getCategoryClass(task);
  const {
    taskCategoryValue: category,
    taskName: name,
    taskDescription: description,
    taskDate: date,
    priority,
  } = task;
  const assignedContactsHTML = getAssignedContacts(task["assignedContacts"]);
  const getAssignedText = getAssignedContainer(task["assignedContacts"]);
  const getSubtaskText = getSubtaskContainer(task["subTasks"]);
  const subtasksHTML = getSubtasks(task["subTasks"], task, index);

  const showTaskCard = document.getElementById("showTaskCard");
  const priorityImageSrc = getPriorityImageSrc(priority);

  showTaskCard.innerHTML = generateTaskCardHTML(
    index,
    categoryClass,
    category,
    name,
    description,
    date,
    priority,
    priorityImageSrc,
    getAssignedText,
    assignedContactsHTML,
    getSubtaskText,
    subtasksHTML
  );
  includeEventlistenerToCloseOverlayBoard();
}

/**
 * Generates HTML for assigned contacts.
 *
 * @param {Array} assignedContacts - An array of assigned contact IDs.
 * @returns {string} The HTML code for assigned contacts.
 */
function getAssignedContacts(assignedContacts) {
  let assignedContactsHTML = "";

  if (assignedContacts) {
    for (let i = 0; i < assignedContacts.length; i++) {
      const assignedContact = assignedContacts[i];

      assignedContactsHTML += getAssignedContactsRenderHTML(
        contacts,
        assignedContact
      );
    }
  }
  return assignedContactsHTML;
}

/**
 * Generates an "Assigned To" container if assigned contacts are present.
 *
 * @param {Array} assignedContacts - An array of assigned contact IDs.
 * @returns {string} The HTML code for the "Assigned To" container or an empty string if no assigned contacts are present.
 */
function getAssignedContainer(assignedContacts) {
  let assigned = "";

  if (assignedContacts) {
    assigned = `
        <div class="dark-gray">Assigned To:</div>
        `;
  }
  return assigned;
}

/**
 * Returns the image source (URL) for a given priority level.
 *
 * @param {string} priority - The priority level ('low', 'medium', or 'urgent').
 * @returns {string} The image source URL corresponding to the priority level. Returns an empty string for unknown priority levels.
 */
function getPriorityImageSrc(priority) {
  let imageSrc = "";

  switch (priority.toLowerCase()) {
    case "low":
      imageSrc = "assets/icons/prio-low.svg";
      break;
    case "medium":
      imageSrc = "assets/icons/prio-medium.svg";
      break;
    case "urgent":
      imageSrc = "assets/icons/prio-urgent.svg";
      break;
    default:
      imageSrc = "";
      break;
  }
  return imageSrc;
}

/**
 * Changes the image of a subtask field to mark its status (completed/incomplete).
 *
 * @param {string} id - The ID of the subtask field whose image should be changed.
 */
function subtaskChangeImg(id) {
  let subtaskField = document.getElementById(id);
  let subtaskFieldSrc = subtaskField.src;

  if (subtaskFieldSrc.indexOf("assets/image/board/Check-button.svg") !== -1) {
    subtaskField.src = "assets/image/board/Check-button-empty.svg";
  } else {
    subtaskField.src = "assets/image/board/Check-button.svg";
  }
}

/**
 * Closes the overlay window on the board.
 */
function closeBoardOverlay() {
  document.getElementById("overlayBoard").style.display = "none";
}

/**
 * Changes the source (URL) of an image with the specified ID to a new source.
 *
 * @param {string} newSrc - The new image source (URL).
 * @param {string} imageId - The ID of the image element to be changed.
 */
function changeImage(newSrc, imageId) {
  const image = document.getElementById(imageId);
  image.src = newSrc;
}

/**
 * Returns the name of the contact assigned to a task based on the provided index.
 *
 * @param {number} index - The index of the assigned contact within the task.
 * @returns {string} The name of the assigned contact or an empty string if no contact is assigned.
 */
function assignedTo(index) {
  let indexInContacts = tasks[0]["assignedContacts"][index];

  if (contacts[indexInContacts] && contacts[indexInContacts]["name"]) {
    let contactName = contacts[indexInContacts]["name"];
    return contactName;
  } else {
    return "";
  }
}

/**
 * Returns the initials of the contact assigned to a task based on the provided index.
 *
 * @param {number} index - The index of the assigned contact within the task.
 * @returns {string} The initials of the assigned contact or an empty string if no contact is assigned or available.
 */
function assignedInicials(index) {
  let initials = tasks[0]["assignedContacts"][index];

  if (initials !== undefined && contacts[initials]) {
    return getContactInitials(contacts[initials]);
  } else {
    var elementId = `initial${index}`;
    var divElement = document.getElementById(elementId);

    if (divElement) {
      divElement.style.display = "none";
    }
    return "";
  }
}

/**
 * Generates a "Subtask" container if there are subtasks present.
 *
 * @param {Array} subtasks - An array of subtasks.
 * @returns {string} The HTML code for the "Subtask" container or an empty string if no subtasks are present.
 */
function getSubtaskContainer(subtasks) {
  let subtasksHtml = "";

  if (subtasksHtml) {
    subtasksHtml = `
            <div class="dark-gray">Subtask</div>
            `;
  }
  return subtasksHtml;
}

/**
 * Generates HTML for subtasks if they are present in a task.
 *
 * @param {Array} subtasks - An array of subtasks.
 * @param {Object} task - The task object containing subtasks.
 * @param {number} index - The index of the task.
 * @returns {string} The HTML code for subtasks or an empty string if no subtasks are present.
 */
function getSubtasks(subtasks, task, index) {
  let subtasksHTML = "";

  if (subtasks) {
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      const subtaskId = `subtask${i + 1}`;
      let subtaskStatus = subtasks[i]["isComplete"];
      let subtaskImgSrc = "";

      if (subtaskStatus === 0) {
        subtaskImgSrc = "assets/icons/checkbox-empty.svg";
      } else {
        subtaskImgSrc = "assets/icons/checkbox-filled.svg";
      }

      subtasksHTML += renderSubtask(
        subtaskId,
        subtaskStatus,
        i,
        index,
        subtaskImgSrc,
        subtask
      );
    }
  }
  return subtasksHTML;
}

/**
 * Saves the status of a subtask (completed or incomplete) and updates it in the task data.
 *
 * @param {number} subtaskStatus - The status of the subtask (0 for incomplete, 1 for completed).
 * @param {number} i - The index of the subtask within the task.
 * @param {number} index - The index of the task.
 */
function saveSubtask(subtaskStatus, i, index) {
  if (subtaskStatus == 0) {
    subtaskStatus = 1;
  } else {
    subtaskStatus = 0;
  }

  if (subtaskStatus !== undefined) {
    tasks[index]["subTasks"][i]["isComplete"] = subtaskStatus;
    setItem("tasks", tasks);
  }
  showTaskCard(index);
}

/**
 * Displays the "Move To" dropdown menu in a task card and highlights the current category.
 *
 * @param {Event} event - The triggering event.
 * @param {number} index - The index of the task card.
 * @param {string} category - The target category ('toDo', 'inProgress', 'awaitFeedback', or 'done').
 */
function showMoveTo(event, index, category) {
  event.stopPropagation();

  document.getElementById(`taskCard${index}`).innerHTML = renderMoveToInTaskCards(index);

  if (category == 'toDo') {
    document.getElementById('moveToDo').classList.add('current-category');
  } else if (category == 'inProgress') {
    document.getElementById('moveInProgress').classList.add('current-category');
  } else if (category == 'awaitFeedback') {
    document.getElementById('moveAwaitFeedback').classList.add('current-category');
  } else if (category == 'done') {
    document.getElementById('moveDone').classList.add('current-category');
  }
}

/**
 * Re-renders the task card to update its content.
 *
 * @param {Event} event - The triggering event.
 */
function renderTaskCardAgain(event) {
  event.stopPropagation();
  loadTasksHTML();
}

/**
 * Updates the data category for a task and reloads the task list.
 *
 * @param {Event} event - The triggering event.
 * @param {string} category - The new target category for the task.
 * @param {number} index - The index of the task to be updated.
 */
function newDataCategory(event, category, index) {
  event.stopPropagation();

  if (category) {
    tasks[index]['status'] = category;
    setItem("tasks", tasks);
    loadTasksHTML();
  }
}