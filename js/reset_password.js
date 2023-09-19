let email = "";

/**
 * The variable email get a value on page laod.
 */
async function resetPasswordInit() {
  await init();
  email = getEmailUrlParameter();
}

/**
 * We get the email from the Url.
 * 
 * @returns the email
 */
function getEmailUrlParameter() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get("email");
  return email;
}

/**
 * On Submit we start a function that start's several functions.
 * 
 * @param {*} event 
 */
function onSubmit(event) {
  event.preventDefault();
  checkPassword();
}

/**
 * The password value from the user get the value from the inputfield.
 * 
 * @param {value} password1 the first inputfield
 * @param {value} password2 the second inputfield
 */
function resetPassword(password1, password2) {
  let user = users.find((u) => u.email == email);
  user.password = password1.value;

  password1.value = "";
  password2.value = "";
}

/**
 * Check's if the Password match.
 */
function checkPassword() {
  let password1 = document.getElementById("reset-password-input1");
  let password2 = document.getElementById("reset-password-input2");
  let message = document.getElementById("reset-password-message");

  if (password1.value === password2.value) {
    resetPassword(password1, password2);
    message.innerHTML = renderMessage();
  } else {
    message.innerHTML =
      "<span style='color: red'>Password doesn't match</span>";
  }
}

function renderMessage() {
  return `<div class="reset-password-message">
          <span class="reset-password-message-text">You reset your password</span>
          </div>`;
}