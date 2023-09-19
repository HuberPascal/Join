const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let toDo = [];
let tasksInProgress = [];
let awaitingFeedback = [];
let done = [];

const today = new Date();

async function initSummary() {
  await init();
  await includeHTML(0);
  greetUser();
  filterTasks();
  todaysDate();
  setUserHeaderInitials();
}

function greetUser() {
  greetingTime();
  greetingUser();
}

/**
 * Displays a greeting message based on the current time of day.
 */
function greetingTime() {
  let greetingTime = document.getElementById("greeting-time");
  let hour = new Date().getHours();
  let greetingText = "";

  if (hour >= 5 && hour < 12) {
    greetingText = "Good morning,";
  } else if (hour >= 12 && hour < 18) {
    greetingText = "Good afternoon,";
  } else {
    greetingText = "Good evening,";
  }

  greetingTime.innerHTML = greetingText;
}

/**
 * Greet's the user by his username.
 */
function greetingUser() {
  let greetingName = document.getElementById("greeting-name");
  greetingName.innerHTML = username;
}

/**
 * Change the image on hover.
 */
function hoverRightButton() {
  let circle = document.getElementById("button-right-hover1");
  let check = document.getElementById("button-right-hover2");
  circle.src = "assets/image/Summary/white-button.svg";
  check.src = "assets/image/Summary/check-icon-blue.svg";
}

/**
 * Change the image on hover.
 */
function hoverOffRightButton() {
  let circle = document.getElementById("button-right-hover1");
  let check = document.getElementById("button-right-hover2");
  circle.src = "assets/image/Summary/blue-button-summary.svg";
  check.src = "assets/image/Summary/check-icon-white.svg";
}

/**
 * Change the image on hover.
 */
function hoverLeftButton() {
  let circle = document.getElementById("button-left-hover1");
  let check = document.getElementById("button-left-hover2");
  circle.src = "assets/image/Summary/white-button.svg";
  check.src = "assets/image/Summary/pencil-blue.svg";
}

/**
 * Change the image on hover.
 */
function hoverOffLeftButton() {
  let circle = document.getElementById("button-left-hover1");
  let check = document.getElementById("button-left-hover2");
  circle.src = "assets/image/Summary/blue-button-summary.svg";
  check.src = "assets/image/Summary/pencil-1.svg";
}

/**
 * Formats a date object into a human-readable date string.
 *
 * @param {Date} date - The date object to be formatted.
 * @returns {string} - The formatted date string (e.g., "September 10, 2023").
 */
function formatDate(date) {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
}

function todaysDate() {
  document.getElementById("upcoming-deadline").textContent = formatDate(today);
}

/**
 * Inserts the length of the respective array into the respective div.
 */
function setNumber() {
  let boardContainer = document.getElementById("tasks-in-board");
  let progressContainer = document.getElementById("tasks-in-progress");
  let awaitingContainer = document.getElementById("awaiting-feedback");
  let urgentContainer = document.getElementById("urgent");
  let toDoContainer = document.getElementById("to-do");
  let doneContainer = document.getElementById("done");
  boardContainer.innerHTML = tasks.length;
  progressContainer.innerHTML = tasksInProgress.length;
  awaitingContainer.innerHTML = awaitingFeedback.length;
  urgentContainer.innerHTML = toDo.length;
  toDoContainer.innerHTML = toDo.length;
  doneContainer.innerHTML = done.length;
}

/**
 * Filters tasks by the specified status and pushes them into the corresponding variable.
 *
 * @param {string} status - The status to filter tasks by ('toDo', 'inProgress', 'awaitFeedback', or 'done').
 * @returns {void}
 */
function filterAndPushTasksByStatus(status) {
  const filteredTasks = tasks.filter((task) => task.status === status);
  switch (status) {
    case "toDo":
      toDo.push(...filteredTasks);
      break;
    case "inProgress":
      tasksInProgress.push(...filteredTasks);
      break;
    case "awaitFeedback":
      awaitingFeedback.push(...filteredTasks);
      break;
    case "done":
      done.push(...filteredTasks);
      break;
    default:
      break;
  }
}

function filterTasks() {
  filterAndPushTasksByStatus("toDo");
  filterAndPushTasksByStatus("inProgress");
  filterAndPushTasksByStatus("awaitFeedback");
  filterAndPushTasksByStatus("done");
  setNumber();
}
