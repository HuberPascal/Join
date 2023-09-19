/**
 * Pushing user data to the remote storage.
 */
async function addUser(){
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let user={'username': username.value, 'email': email.value, 'password': password.value};
    users.push(user);
    setItem("users",users);
    signedUp();
};

/**
 * Starts several functions after the user added.
 */
function signedUp(){
    renderSignedUpMessage();
    displayNoneMessage();
}

/**
 * It renders a message that the user is signed up successfully.
 */
function renderSignedUpMessage(){
    renderLoginContainer();
    let container = document.getElementById('homepage');
    container.innerHTML += /*html*/ `
    <div id="message" class="signed-up-message">You Signed Up successfully</div>
    `
};

/**
 * The message becomes not visible after 4 seconds.
 */
function displayNoneMessage(){
    setTimeout(() => {
        let container = document.getElementById('message');
        container.classList.add('d-none');
    }, 4000);
}