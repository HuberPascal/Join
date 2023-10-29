/**
 * Renders the contact assignment dropdown list by populating it with contact options.
 * This function dynamically generates HTML for each contact option, including the contact's icon and name,
 * and appends it to the 'selectAssignedContactList' element. It also assigns an 'onclick' event
 * to each contact option to handle selection.
 *
 * @returns {void}
 */
function renderContactAssignmentDropDown() {
    const contactList = document.getElementById("selectAssignedContactList");

    // Nur fortfahren, wenn das Element vorhanden ist
    if (contactList) {
        contactList.innerHTML = "";

        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            let contactName = contact["name"];
            let contactIcon = getContactIconHtml(contact);

            contactList.innerHTML += /*html*/ `
            <div onclick='selectTaskContact(this)' id='assignableContact${i}' class='assign-contact-option'>
                <div class='contact-information'>
                    ${contactIcon}
                    ${contactName}
                </div>
                <img src="./assets/icons/checkbox-empty.svg" id="selectedContactCheckBox${i}" class="selected-contact-checkbox">
            </div>`;
        }
    }
}

/**
 * Shows or hides assignable contacts in the UI based on the input provided.
 * It iterates through the 'contacts' array and checks if each contact's name starts with the given input.
 * Contacts whose names match the input are displayed, while others are hidden.
 * After processing, it ensures that the visible contacts are made visible in the UI.
 *
 * @param {string} input - The input string to filter contacts by.
 * @returns {void}
 */
function showAvailableContacts(input) {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if (contact["name"].toLowerCase().startsWith(input)) {
            document.getElementById("assignableContact" + i).classList.remove("hide");
        } else {
            document.getElementById("assignableContact" + i).classList.add("hide");
        }
    }
}

/**
 * Renders and updates the list of selected contact icons in the 'assignedContactList' element.
 * It generates HTML markup for the selected contact icons based on the 'assignedContacts' array
 * and replaces the content of the 'assignedContactList' element with the generated HTML.
 *
 * @returns {void}
 */
function renderSelectedContactIcons() {
    let html = "";
    for (let i = 0; i < assignedContacts.length; i++) {
        const id = assignedContacts[i];
        html += getContactIconHtml(contacts[id]);
    }
    document.getElementById("assignedContactList").innerHTML = html;
}

/**
 * Handles the selection of a task contact row by adding it to the 'assignedContacts' array
 * and updating the UI to reflect the selection.
 *
 * @param {HTMLElement} row - The HTML element representing the contact row to be selected.
 * @returns {void}
 */
function selectTaskContact(row) {
    let contactId = row.getAttribute("id").replace("assignableContact", "");

    if (assignedContacts.indexOf(contactId) === -1) {
        assignedContacts.push(contactId);
        row.onclick = () => unselectTaskContact(row);

        renderSelectionOfContactFromTask(row, contactId);
        renderSelectedContactIcons();
        assignedContact();
        unfinishedTaskData["assignedContacts"] = assignedContacts;
    } else {
        indexAvailable();
        renderSelectedContactIcons();
        hideContactAvailableMessage();
    }

    /**
     * Removes the contact ID from the 'assignedContacts' array if it is already present.
     *
     * @returns {void}
     */
    function indexAvailable() {
        let index = assignedContacts.indexOf(contactId);
        if (index !== -1) {
            assignedContacts.splice(index, 1);
        }
    }

    /**
     * Displays the 'contactAvailable' message and hides it after 3 seconds.
     *
     * @returns {void}
     */
    function hideContactAvailableMessage() {
        document.getElementById("contactAvailable").classList.remove("dNone");
        setTimeout(function () {
            hideContactAvailable();
        }, 3000);
    }

    /**
     * Hides the 'contactAvailable' message.
     *
     * @returns {void}
     */
    function hideContactAvailable() {
        document.getElementById("contactAvailable").classList.add("dNone");
    }

    /**
     * Updates the 'assignedContacts' property in 'unfinishedTaskData' and returns the modified data.
     *
     * @returns {Object} - The updated 'unfinishedTaskData' object.
     */
    function assignedContact() {
        unfinishedTaskData["assignedContacts"] = assignedContacts;
        return unfinishedTaskData;
    }
}

/**
 * Handles the unselection of a task contact row by removing it from the 'assignedContacts' array
 * and updating the UI to reflect the unselection.
 *
 * @param {HTMLElement} row - The HTML element representing the contact row to be unselected.
 * @returns {void}
 */
function unselectTaskContact(row) {
    let contactId = row.getAttribute("id").replace("assignableContact", "");

    const indexToRemove = assignedContacts.indexOf(contactId);
    if (indexToRemove !== -1) {
        assignedContacts.splice(indexToRemove, 1);
    }
    row.onclick = () => selectTaskContact(row);

    renderUnselectionOfContactFromTask(row, contactId);

    renderSelectedContactIcons();
    unfinishedTaskData["assignedContacts"] = assignedContacts;
}

/**
 * Adds the selection styling and updates the checkbox icon for a contact row in a task.
 *
 * @param {HTMLElement} row - The HTML element representing the contact row.
 * @param {string} contactId - The unique identifier of the contact.
 * @returns {void}
 */
function renderSelectionOfContactFromTask(row, contactId) {
    row.classList.add("selected-option");
    document.getElementById("selectedContactCheckBox" + contactId).src = "./assets/icons/checkbox-filled.svg";
    document.getElementById("selectedContactCheckBox" + contactId).classList.add("white-symbol");
}

/**
 * Removes the selection styling and updates the checkbox icon for a contact row in a task.
 *
 * @param {HTMLElement} row - The HTML element representing the contact row.
 * @param {string} contactId - The unique identifier of the contact.
 * @returns {void}
 */
function renderUnselectionOfContactFromTask(row, contactId) {
    row.classList.remove("selected-option");
    document.getElementById("selectedContactCheckBox" + contactId).src = "./assets/icons/checkbox-empty.svg";
    document.getElementById("selectedContactCheckBox" + contactId).classList.remove("white-symbol");
}

/**
 * Sets the selected task priority to the provided value and updates the unfinished task data.
 *
 * @param {string} currentButtonValue - The priority value to set for the task.
 * @returns {void}
 */
function setTaskPrio(currentButtonValue) {
    selectedTaskPriority = currentButtonValue;
    unfinishedTaskData["priority"] = currentButtonValue;
}
