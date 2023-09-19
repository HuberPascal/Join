/**
 * Asynchronously includes contact-specific HTML content into elements with the "include-html" attribute.
 * This function fetches HTML content from the specified file and updates the target elements' innerHTML.
 * It also performs additional actions such as scrolling, removing scroll, and adding event listeners.
 *
 * @param {string} type - The type of contact content to include ('addContact' or 'editContact').
 */
async function includeContactHTML(type) {
  let includeElements = document.querySelectorAll("[include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }

  window.scrollTo(0, 0);
  removeScrollFromBody();
  setTemplateTypeSpecificValues(type);
  addEventListenerToCloseElement();
}

/**
 * Event listener that handles clicks on the document.
 * Removes elements with a partial class name "add-contact" and adds scrolling to the body.
 *
 * @param {Event} event - The click event object.
 */
function addEventListenerToCloseElement() {
  document.addEventListener("click", function (event) {
    removeElementsByPartialClassName("add-contact");
    addScrollToBody();
  });
  stopClickEventPropagnationForElementById("contactCard");
}

/**
 * Sets template type-specific content for a contact form based on the provided 'type'.
 *
 * @param {string} type - The type of configuration to set ('addContact' or 'editContact').
 */
function setTemplateTypeSpecificValues(type) {
  getButtonsToSetConfig(type);
  getTextToSetConfig(type);
  setContactFormButtons(buttonsToSet);
  setContactFormText(textToSet);

  if (type == "editContact") {
    setContactCredentials();
    setCurrentContactValues();
  }
}

/**
 * Gets the title text based on the provided 'type'.
 *
 * @param {string} type - The type of configuration to retrieve ('addContact' or 'editContact').
 * @returns {Object} An object containing text configuration properties.
 */
function getTextToSetConfig(type) {
  if (type == "addContact") {
    textToSet = {
      contactTemplateTitle: "Add contact",
    };
  }

  if (type == "editContact") {
    textToSet = {
      contactTemplateTitle: "Edit contact",
    };
  }
}

/**
 * Gets an array of button configurations based on the provided 'type'.
 *
 * @param {string} type - The type of configuration to retrieve ('addContact' or 'editContact').
 * @returns {Array<Object>} An array of button configuration objects containing class, function, and inner HTML.
 */
function getButtonsToSetConfig(type) {
  if (type == "addContact") {
    buttonsToSet = [
      {
        class: "alternative-button clear-button",
        function: 'removeElementsByPartialClassName("add-contact")',
        innerHtml: "Clear",
      },
      {
        class: "default-button button-create-contact",
        function: "createContact()",
        innerHtml: "Create Contact",
      },
    ];
  }

  if (type == "editContact") {
    buttonsToSet = [
      {
        class: "alternative-button",
        function: "deleteContact()",
        innerHtml: "Delete",
      },
      {
        class: "default-button",
        function: "saveContact()",
        innerHtml: "Save",
      },
    ];
  }

  return buttonsToSet;
}

/**
 * Sets the input values in the contact form with the current contact's name, email, and phone.
 * This function retrieves the current contact's information from the 'contacts' array based on
 * the 'selectedContact' index and updates the respective input fields in the contact form.
 */
function setCurrentContactValues() {
  currentContact = contacts[selectedContact];
  let name = currentContact["name"];
  let mail = currentContact["mail"];
  let phone = currentContact["phone"];

  document.getElementById("contactNameInput").value = name;
  document.getElementById("contactMailInput").value = mail;
  document.getElementById("contactPhoneInput").value = phone;
}

/**
 * Sets the contact credentials for the selected contact element.
 * This function updates the content of an HTML element with the id 'contactCredentials'
 * based on the selected contact's data.
 */
function setContactCredentials() {
  if (selectedContact != null) {
    document.getElementById("contactCredentials").innerHTML =
      getContactIconHtml(contacts[selectedContact]);
  }
}

/**
 * Sets inner html values based on a provided object mapping element IDs to text content.
 *
 * @param {Object} textToSet - An object mapping element IDs to text content.
 */
function setContactFormText(textToSet) {
  let elementIds = Object.keys(textToSet);

  elementIds.forEach((elementId) => {
    document.getElementById(elementId).innerHTML = textToSet[elementId];
  });
}

/**
 * Sets click event handlers for HTML elements based on a provided object mapping element IDs to function names.
 *
 * @param {Object} buttonsToSet - An object mapping element IDs to function names.
 */
function setContactFormButtons(buttonsToSet) {
  elementToSet = document.getElementById("addContactFormActions");
  for (let i = 0; i < buttonsToSet.length; i++) {
    button = buttonsToSet[i];
    elementToSet.innerHTML += /*html*/ `
            <button 
            class='${button["class"]}' 
            onclick='${button["function"]}'>${button["innerHtml"]}
            </button>`;
  }
}

/**
 * Removes the "hide-overflow" class from the <body> element(s) to enable scrolling
 * when necessary. This function can be used to re-enable scrolling on the page.
 */
function removeScrollFromBody() {
  let elements = document.getElementsByTagName("body");
  Array.from(elements).forEach((element) => {
    element.classList.add("hide-overflow");
  });
}

/**
 * Adds the "hide-overflow" class to the <body> element(s) to disable scrolling
 * when necessary. This function can be used to prevent scrolling on the page.
 */
function addScrollToBody() {
  let elements = document.getElementsByTagName("body");
  Array.from(elements).forEach((element) => {
    element.classList.remove("hide-overflow");
  });
}


/**
 * Removes all elements whose class names contain a specified substring.
 *
 * @param {string} partialClassName - The partial class name to search for.
 */
function removeElementsByPartialClassName(partialClassName) {
  /**
   * @type {NodeListOf<HTMLElement>}
   */
  var elements = document.querySelectorAll(
    '[class*="' + partialClassName + '"]'
  );

  elements.forEach(function (element) {
    element.remove();
  });
}


/**
 * If we are on the contact.html, the contact list gonna updated.
 */
async function updateList() {
  let currentURL = window.location.href;

  if (currentURL.endsWith(`contact.html?name=${username}`)) {
    renderContacts();
  }
}


/**
 * Find the index of a contact in the global `contacts` array based on email, name, and phone number.
 *
 * @param {string} email - The email address to search for.
 * @param {string} name - The name to search for.
 * @param {string} phoneNumber - The phone number to search for.
 * @returns {number} - The index of the matching contact, or -1 if not found.
 */
function findContactIndex(email, name, phoneNumber) {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (
      contact.mail === email &&
      contact.name === name &&
      contact.phone === phoneNumber
    ) {
      return i; // Return the index when all criteria match
    }
  }
  return -1; // Return -1 if no match is found
}
