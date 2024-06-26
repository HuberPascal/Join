/**
 * Represents the priority level selected for a task.
 * @type {string|null} - Can be "urgent", "medium", "low", or null if not set.
 */
let selectedTaskPriority = null;

/**
 * Indicates whether assigned contacts are currently displayed.
 * @type {boolean} - True if assigned contacts are displayed, false otherwise.
 */
let showAssignedContacts = false;

/**
 * An array containing the unique identifiers of assigned contacts for a task.
 * @type {string[]}
 */
let assignedContacts = [];

/**
 * An array containing subtasks associated with a task.
 * @type {Object[]}
 */
let subTasks = [];

/**
 * Represents data for an unfinished task;
 * @type {Object}
 */
let unfinishedTaskData = {};

/**
 * An array containing the IDs of direct input fields in the Add Task form.
 * @type {string[]}
 */
let directInputFieldIds = [
  "newTaskTitle",
  "newTaskDescription",
  "newTaskDate",
  "selectCategory",
];

/**
 * Asynchronously includes HTML content from specified files into elements with the 'include-tasks-html' attribute.
 * Fetches and inserts the HTML content, displaying 'Page not found' on fetch failure.
 * Initializes the 'initAddTasks' function after including the HTML content.
 * @param {string} [status="toDo"] - The status of the tasks.
 * @returns {Promise<void>} Resolves when HTML content is included.
 * @throws {Error} Throws an error on fetch failure.
 */
async function includeTasksHtml(status = "toDo") {
  let includeElements = document.querySelectorAll("[include-tasks-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("include-tasks-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  initAddTasks(status);
}

/**
 * Initializes the process of adding a task.
 * Includes HTML content for task creation and tasks display.
 * Sets the user header initials.
 * @returns {Promise<void>} Resolves when initialization is complete.
 */
async function addTaskInit() {
  await includeHTML(1);
  await includeTasksHtml();
  setUserHeaderInitials();
}

/**
 * Asynchronously initializes the Add Tasks module.
 * It checks if user data is available (not an empty array), retrieves storage data if available,
 * loads event listeners for the Add Tasks module, and renders the contact assignment dropdown.
 *
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initAddTasks(status) {
  if (users != []) {
    await getStorageData();
  }
  loadTaskEventListeners();
  renderContactAssignmentDropDown();
  unfinishedTaskData = { status: status };
}

/**
 * Loads and sets up various event listeners for the Add Tasks module.
 * It calls functions to set event listeners for selecting contacts, managing subtasks,
 * showing available contacts, and interacting with the selected category dropdown.
 *
 * @returns {void}
 */
function loadTaskEventListeners() {
  setSelectContactEventListeners();
  setShowAvailableContactsEventListener();
  setSubTaskEventListeners();
  setSelectedCategoryEventListeners();
}

/**
 * Sets event listeners for interacting with the selected category dropdown.
 * When the "selectCategory" element is clicked, it toggles the rotation of the
 * "dropdownIcon" to visually indicate the opening or closing of the dropdown.
 *
 * @returns {void}
 */
function setSelectedCategoryEventListeners() {
  const selectCategory = document.getElementById("selectCategory");
  const dropdownIcon = document.querySelector(".dropdown-icon");

  selectCategory.addEventListener("click", function () {
    dropdownIcon.classList.toggle("rotate-180");
  });
}

/**
 * Sets an event listener on the input field with the ID "dropDownContactsTextFieldInput"
 * to dynamically filter and display available contacts as the user types.
 * When the user enters text into the input field, it triggers the "showAvailableContacts" function
 * with the entered text as the input to filter and display matching contacts.
 *
 * @returns {void}
 */
function setShowAvailableContactsEventListener() {
  let inputField = document.getElementById("dropDownContactsTextFieldInput");
  inputField.addEventListener("input", function () {
    showAvailableContacts(inputField.value);
  });
}

/**
 * Sets event listeners for interacting with the select contact dropdown menu.
 * Toggles visibility of the dropdown menu on input focus and hides it on external clicks.
 * @returns {void}
 */
function setSelectContactEventListeners() {
  const element = document.getElementById("dropDownContactsTextFieldInput");
  const elementToShow = document.getElementById(
    "assignedContactsDropDownContent"
  );

  // Show/hide the dropdown menu on focus
  element.addEventListener("focus", function (event) {
    elementToShow.classList.toggle("show-flex");
  });

  // Hide the dropdown menu when clicking outside of it
  document.addEventListener("click", function (event) {
    if (!elementToShow.contains(event.target) && event.target !== element) {
      elementToShow.classList.remove("show-flex");
    }
  });
}

/**
 * Sets the minimum date to choose.
 */
function setMinDate() {
  let today = new Date().toISOString().split("T")[0];
  document.getElementById("newTaskDate").setAttribute("min", today);
}
