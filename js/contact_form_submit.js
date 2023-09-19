/**
 * Renders a notification element for a contact creation event.
 * The notification displays a "Created" message and automatically fades out
 * and removes itself after 2 seconds.
 */
async function renderContactCreatedElement() {
    await renderNotificationLayout();
    setNotificationValue("Created");
    setTimeout(function () {
        removeNotificationLayout();
    }, 2000);
}

/**
 * Renders a notification element for a contact save (change) event.
 * The notification displays a "Changed" message and automatically fades out
 * and removes itself after 2 seconds.
 */
async function renderContactSavedElement() {
    await renderNotificationLayout();
    setNotificationValue("Changed");
    setTimeout(function () {
        removeNotificationLayout();
    }, 2000);
}

/**
 * Renders a notification element for a contact delete event.
 * The notification displays a "Delete" message and automatically fades out
 * and removes itself after 2 seconds.
 */
async function renderContactDeleteElement() {
    await renderNotificationLayout();
    setNotificationValue("Delete");

    setTimeout(function () {
        removeNotificationLayout();
    }, 2000);
}

/**
 * Removes the notification layout by adding the "shift-out" class to
 * the notification container element and then removing it from the DOM
 * after 1 second. This function is typically called after the notification
 * has served its purpose and should be hidden.
 */
function removeNotificationLayout() {
    document.getElementById("contactChangeNotificationContainer").classList.add('shift-out');
    setTimeout(function () {
        document.getElementById("contactChangeNotificationContainer").remove()
    }, 1000);
}

/**
 * Sets the notification text based on the provided input.
 *
 * @param {string} input - The input string that determines the notification message.
 */
function setNotificationValue(input) {
    const notifications = document.getElementsByClassName("change-contact-notification-text");
    for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        console.log(notification);
        switch (input) {
            case 'Created': notification.innerHTML = "Contact successfully created";
                break;
            case 'Changed': notification.innerHTML = "Contact changes saved";
                break;
            case 'Delete': notification.innerHTML = "Contact deleted";
                break;
            default: notification.innerHTML = "Error adapting contact";
        }}}

/**
 * Renders the notification layout within the selected contact container
 * or add task container if available.
 */
function renderNotificationLayout() {
    let newDiv = document.createElement("div");
    newDiv.innerHTML +=/*html*/`
    <div class="contact-change-notification-container shift-in" id="contactChangeNotificationContainer">
        <div class="contact-change-notification"><p class='change-contact-notification-text'></p></div>
    </div>`;
    if (document.getElementById("selectedContactContainer") != null) {
        document.getElementById("selectedContactContainer").appendChild(newDiv);
    } else if (document.getElementById("addTaskContainer")) {
        document.getElementById("addTaskContainer").appendChild(newDiv);
    }
}

/**
 * Asynchronously creates a new contact by retrieving input values from the contact form
 * and updating the contacts array with the new contact information.
 * If the form is valid, it removes the form elements, renders a message indicating
 * the contact creation, and then updates the contacts array.
 * Finally, it renders the contact page of the current contact.
 */
async function createContact() {
    if (document.getElementById("changeContact").reportValidity()) {
        let contactName = document.getElementById("contactNameInput").value;
        let contactMail = document.getElementById("contactMailInput").value;
        let contactPhone = document.getElementById("contactPhoneInput").value;
        let color = getNewContactColor();

        removeElementsByPartialClassName("add-contact");
        await updateContactsArray(contactName, contactMail, contactPhone, color);
        updateList();
        renderContactCreatedElement();
    }
}

/**
 * Saves changes made to a contact by updating its information in the contacts array.
 * If the contact form is valid, it retrieves the input values, updates the selected contact's
 * information, and then updates the contacts array in local storage.
 * Finally, it re-renders the contact list, removes the form elements, and renders the selected
 * contact's body along with a message indicating the contact was saved.
 */
function saveContact() {
    if (document.getElementById("changeContact").reportValidity()) {
        let contactName = document.getElementById("contactNameInput").value;
        let contactMail = document.getElementById("contactMailInput").value;
        let contactPhone = document.getElementById("contactPhoneInput").value;
        let color = contacts[selectedContact]["color"];
        let contact = { "name": contactName, "mail": contactMail, "phone": contactPhone, "color": color };
        contacts[selectedContact] = contact;
        setItem("contacts", contacts);
        renderContacts();
        removeElementsByPartialClassName("add-contact");
        renderSelectedContactBody();
        renderContactSavedElement();
    }
}

/**
 * Updates the contacts array with a new contact if the provided contact information is not empty.
 * Sorts the updated contacts array by user name and stores it in local storage.
 *
 * @param {string} contactName - The name of the contact to add.
 * @param {string} contactMail - The email address of the contact to add.
 * @param {string} contactPhone - The phone number of the contact to add.
 * @param {string} color - The color associated with the contact.
 */
function updateContactsArray(contactName, contactMail, contactPhone, color) {
    if (contactName != "" & contactMail != "" & contactPhone != "") {
        let contact = { "name": contactName, "mail": contactMail, "phone": contactPhone, "color": color };
        contacts.push(contact);
    }

    contacts = sortByUserName(contacts)
    setItem("contacts", contacts);
}