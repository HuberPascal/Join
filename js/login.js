let loginContainer = document.getElementById("login-container");
let hasExecuted = false;

async function loginInit() {
    await init();
    renderLoginContainer();
}

function renderLoginContainer() {
    loginContainer.innerHTML = renderLoginContainerTemplate();
    removeAnimationClass();
}

function renderLoginContainerTemplate() {
    return /*html*/ `
  <div id="sign-up-btn-container" class="animation">
    <span class="sign-up-text">Not a Join user?</span>
    <span onclick="renderSignUpForm()" class=sign-up-btn>Sign up</span>
  </div>
  <form id="login-form" class="animation" onsubmit="login(); return false">
    <div class="heading-seperator">
      <h2 class="login-heading">Log in</h2>
      <div class="seperator"></div>
    </div>
    <input required id="login-email" class="input-login email" type="email" placeholder="Email">
    <input required id="login-password" class="input-login password" type="password" placeholder="Password">
    <span style="color: red" id="login-message"></span><div class="checkbox-container">
    <div class="login-checkbox-container"><input class="login-checkbox" id="checkbox" type="checkbox">
      <label class="checkbox-label" for="checkbox">Remember me</label></div>
      <span onclick="renderForgotPasswordForm()" class="forgot-password-span">I forgot my Password</span></div> 
      <div class="login-button-container"><button type="submit" class="login-button">Log in</button>
      <button onclick="guestLogin()" class="guest-button">Guest Log in</button>
    </div>
  </form>`;
}

function renderSignUpForm() {
    loginContainer.innerHTML = /*html*/ ` 
  <form onsubmit="checkPassword(); return false" class="sign-up-form">
  <img onclick="renderLoginContainer()" class="sign-up-arrow arrow" src="./assets/image/arrow-left-line.png">
  <div class="heading-seperator"><h2 class="login-heading">Sign up</h2>
  <div class="seperator"></div></div><div class="input-container">
  <input required id="username" class="input-login person" type="text" placeholder="Name">
  <input required id="email" class="input-login email" type="email" placeholder="Email">
  <input required id="password" minlength="6" class="input-login password" type="password" placeholder="Password">
  <input required id="confirmPassword" class="input-login password" type="password" placeholder="Confirm Password"></div>
  <span id="info"></span>
  <div class="accept-terms-checkbox"><input required class="login-checkbox" id="checkbox" type="checkbox">
  <span>I accept the <a target="_blank" href="./legal-notice.html" class="forgot-password-span">Privacy policy</a></span></div>
  <button id="sign-up-btn-form" type='submit'>Sign up</button>
  </form>`;
}

function renderForgotPasswordForm() {
    loginContainer.innerHTML = /*html*/ `
  <form onsubmit="onSubmit(event)" class="forgot-password-form">
  <img onclick="renderLoginContainer()" class="forgot-password-arrow arrow" src="./assets/image/arrow-left-line.png">
  <div class="heading-seperator"><h2 class="login-heading">I forgot my Password</h2><div class="seperator"></div></div>
  <p class="form-text">Don't worry! We will send you an email with the instructions to reset your password.</p>
  <input required name="email" id ="forgot-password-email" class="input-login email" name='forgot-password-email' type="email" placeholder="Email">
  <span id="forgot-password-info" style="color: red"></span>
  <button type="submit" class="send-email-btn">Send me the email</button>
  </form>
  `;
}

/**
 * Remove the class animation from the form and sign up button.
 */
function removeAnimationClass() {
    if (hasExecuted) {
        let button = document.getElementById("sign-up-btn-container");
        let form = document.getElementById("login-form");
        form.classList.remove("animation");
        button.classList.remove("animation");
    }
    hasExecuted = true;
}

/**
 * Check's if the passwords match.
 *
 * @returns a boolean
 */
function checkPassword() {
    let password1 = document.getElementById("password").value;
    let password2 = document.getElementById("confirmPassword").value;
    let info = document.getElementById("info");

    if (password1 === password2) {
        addUser();
        return true;
    } else {
        info.innerHTML = "<span style='color: red'>Your password don't match</span>";
        return false;
    }
}

/**
 * Check's if the user is registred, if not a message is displayed.
 */
function login() {
    let message = document.getElementById("login-message");
    let email = document.getElementById("login-email");
    console.log(email);
    let password = document.getElementById("login-password");
    let user = users.find((u) => u.email == email.value && u.password == password.value);

    if (user) {
        window.location.href = `./summary.html?name=${user.username}`;
    } else {
        message.innerHTML = "Wrong password or email! Try again.";
    }

    localStorage.setItem("loginMessageDisplayed", true);
}

/**
 * Check's if the user is registred, if not a message is displayed.
 */
function checkEmail(event) {
    let message = document.getElementById("forgot-password-message");
    let messageNotFound = document.getElementById("forgot-password-info");
    let email = document.getElementById("forgot-password-email");
    let user = users.find((u) => u.email == email.value);
    if (user == undefined) {
        messageNotFound.classList.remove("d-none");
        messageNotFound.innerHTML = "This email is not registered.";
    } else {
        messageNotFound.innerHTML = "";
        checkEmailTemplate(message, user);
    }
}

async function checkEmailTemplate(message, user) {
    if (user) {
        try {
            // Extrahiere die E-Mail-Adresse aus dem user-Objekt
            let email = user.email;

            // Erstelle ein FormData-Objekt und füge die E-Mail-Adresse hinzu
            let formData = new FormData();
            formData.append("email", email);

            let response = await action(formData);

            if (response !== null && response.ok) {
                showMessage(message);
            } else {
                console.log("Error in response:", response);
                message.innerHTML = "An error occurred. Please try again later.";
            }
        } catch (error) {
            console.error("An error occurred:", error);
            messageNotFound.innerHTML = "An error occurred. Please try again later.";
        }
    }
}

/**
 * Displays a message element for a brief period.
 *
 * @param {HTMLElement} message - The HTML element to display.
 */
function showMessage(message) {
    message.classList.remove("d-none");

    setTimeout(() => {
        message.classList.add("d-none");
    }, 4000);
}

/**
 * Handles form submission by preventing the default behavior and calling checkEmail.
 *
 * @param {Event} event - The submit event.
 */
async function onSubmit(event) {
    event.preventDefault();
    checkEmail(event);
}

/**
 * Performs an asynchronous action by sending a POST request with form data.
 *
 * @param {FormData} formData - The form data to send in the request.
 * @returns {Promise<Response>} - A promise that resolves to the fetch response.
 */
async function action(formData) {
    const input = "https://pascal-huber.developerakademie.net/Join-Privat/send_mail.php";
    const requestInit = { method: "post", body: formData };
    console.log(formData);
    const response = await fetch(input, requestInit);

    if (response.ok) return response;

    console.error("Response not OK:", response);
    return null; // Return null when response is not OK
}

/**
 * Redirects the user to a guest login page.
 */
function guestLogin() {
    window.location.href = `./summary.html?name=Guest`;
}
