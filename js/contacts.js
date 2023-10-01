let selectedContact = null;
let selectedContactListElement = null;

/**
 * Initializes the contacts application, including data initialization, rendering the contact list,
 * and setting the current mobile display class.
 * This function ensures that the application is properly initialized and ready to display contacts.
 */
async function initContacts() {
  await init();
  renderContacts();
  setCurrentShownMobileClass();
}

async function contactInit() {
  await includeHTML(3);
  initContacts();
  setUserHeaderInitials();
}

/**
 * Renders the list of contacts by iterating through the 'contacts' array.
 * The contacts are grouped by the first letter of their names, and a letter header
 * is displayed for each group. Each contact item is rendered using 'renderContactListItem'.
 * If a selected contact element is defined, it is marked as selected.
 */
function renderContacts() {
  let currentLetter = "";
  let list = document.getElementById("contactList");
  list.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let thisCurrentLetter = contacts[i]["name"].charAt(0).toUpperCase();
    if (currentLetter != thisCurrentLetter) {
      currentLetter = thisCurrentLetter;
      renderLetterHeader(list, currentLetter);}
    renderContactListItem(list, i);
  }
  if (selectedContactListElement != null) {
    markContactElementAsSelected(selectedContactListElement);
  }
}

/**
 * Renders the body of the selected contact in the contact details view.
 * This function populates the selected contact's name, icon, email, and phone information,
 * and adds edit and delete options to the contact menu.
 */
function renderSelectedContactBody() {
  let contactElement = document.getElementById("selectedContactBody");
  let contact = contacts[selectedContact];
  let contactIcon = getContactIconHtml(contact);
  let contactName = contact["name"];
  let contactMail = contact["mail"];
  let contactPhone = contact["phone"];

  contactElement.innerHTML = renderSelectedContactBodyTemplate(contactIcon, contactName, contactMail, contactPhone);
}

function renderSelectedContactBodyTemplate(contactIcon, contactName, contactMail, contactPhone) {
  return /*html*/ `
  <div class="contact-detail-area">
      <div class='contact-name-row'>
          ${contactIcon}
          <div class="contacts-detail-container">
              <h2>  ${contactName}</h2>
              <div class="contact-menu">
                  <div id="editField" onclick='includeContactHTML("editContact")'>
                      <img src="./assets/icons/pen-icon.svg">
                      Edit
                  </div>
                  <div id="deleteField" onclick='deleteContact(selectedContact)'>
                      <img src="./assets/icons/trashcan-icon.svg">
                      Delete
                  </div>
              </div>
          </div>
      </div>

      <div class="contact-information-container">
          <p>Contact Information</p>
      </div> 

      <div class="contact-details">
          <div class="mail">
              <p><b>Email</b></p>
              <p class="mail-text">${contactMail}</p>
          </div>
          <div class="phone">
              <p><b>Phone</b></p>
              <p>${contactPhone}</p>
          </div>
      </div> 
  </div>
  `;
}

/**
 * Empties the content of the selected contact's body in the contact details view.
 * This function clears the innerHTML of the element with the ID "selectedContactBody,"
 * effectively removing any previously displayed contact information.
 */
function emptySelectedContactBody() {
  let contactElement = document.getElementById("selectedContactBody");
  contactElement.innerHTML = "";
}

/**
 * Selects a contact based on its index and updates the display accordingly.
 *
 * @param {number} contactIndex - The index of the contact to be selected.
 */
function selectContact(contactIndex) {
  selectedContact = contactIndex;
  setCurrentShownMobileClass();
  renderSelectedContactBody();
}

/**
 * Deletes a contact from the 'contacts' array, updates local storage, and refreshes the display.
 *
 * @param {number} contactIndex - The index of the contact to be deleted.
 */
function deleteContact(contactIndex) {
  contacts.splice(contactIndex, 1);
  setItem("contacts", contacts);
  renderContacts();
  emptySelectedContactBody();
  removeElementsByPartialClassName("add-contact");
  renderContactDeleteElement();
}

/**
 * Removes the "selected" class from all user elements in the document.
 * This function searches for elements with the "selected" class and removes the class from each element.
 */
function unmarkAllUserElements() {
  selectedElements = document.getElementsByClassName("selected");
  if (selectedElements.length > 0) {
    for (let index = 0; index < selectedElements.length; index++) {
      const selectedElement = selectedElements[index];
      selectedElement.classList.remove("selected");
    }
  }
}

/**
 * Marks a contact element as selected by adding the "selected" class.
 * This function unmarks all other user elements, adds the "selected" class to the specified element,
 * and updates the reference to the selected contact list element.
 *
 * @param {HTMLElement} element - The contact element to be marked as selected.
 */
function markContactElementAsSelected(element) {
  unmarkAllUserElements();
  element.classList.add("selected");
  selectedContactListElement = element;
}

/**
 * Renders a letter header and a horizontal line in the specified list element.
 *
 * @param {HTMLElement} list - The list element where the letter header and line will be added.
 * @param {string} currentLetter - The letter to display in the header.
 */
function renderLetterHeader(list, currentLetter) {
  list.innerHTML += /*html*/ `
    <div class='contact-list-letter-header'>
        <p>${currentLetter}</p>
    </div>
    <div class='contact-list-horizontal-line'>

    </div>`;
}

/**
 * Renders a contact list item and adds it to the specified list element.
 *
 * @param {HTMLElement} list - The list element where the contact item will be added.
 * @param {number} contactIndex - The index of the contact to render from the contacts array.
 */
function renderContactListItem(list, contactIndex) {
  contacts = sortByUserName(contacts);
  let contact = contacts[contactIndex];
  contactName = contact["name"];
  contactMail = contact["mail"];
  let userIcon = getContactIconHtml(contact);
  list.innerHTML += renderContactListItemTemplate(contactIndex, contactName, contactMail, userIcon);
  getContactIconHtml(contact);
}

function renderContactListItemTemplate(contactIndex, contactName, contactMail, userIcon) {
  return /*html*/ `
  <div class="contact-element" onclick='selectContact("${contactIndex}");markContactElementAsSelected(this)'>
      ${userIcon}
      <div class="contact-info">
          <p class="contact-name">${contactName}</p>
          <div class='contact-list-mail-text'>${contactMail}</div>
      </div>
  </div>
  `;
}

/**
 * Sorts an array of contacts by their name in alphabetical order.
 * @param {Array} contacts - The array of contacts to be sorted.
 * @returns {Array} A new array containing the sorted contacts.
 */
function sortByUserName(contacts) {
  return contacts.slice().sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

/**
 * Sets the appropriate CSS class to show or hide contact-related elements on mobile devices.
 * If no contact is selected (selectedContact is null), it hides the selected contact container
 * and shows the contact list section on mobile. If a contact is selected, it does the opposite.
 */
function setCurrentShownMobileClass() {
  if (selectedContact == null) {
    document.getElementById("selectedContactContainer")
      .classList.add("contact-hide-on-mobile");
    document.getElementById("contactListSection")
      .classList.remove("contact-hide-on-mobile");
  } else {
    document.getElementById("selectedContactContainer")
      .classList.remove("contact-hide-on-mobile");
    document.getElementById("contactListSection")
      .classList.add("contact-hide-on-mobile");
  }
}

/**
 * Unsets the selected contact, unmarks all user elements, and sets the current shown mobile class.
 */
function unsetSelectedContact() {
  selectedContact = null;
  unmarkAllUserElements();
  setCurrentShownMobileClass();
}

/**
 * Toggles the mobile responsive contact menu.
 * If the menu is empty, it populates it with edit and delete options.
 * If the menu is already populated, it removes the menu.
 */
function toggleEditContactMenu() {
  let container = document.getElementById("responsiveMenuContainer");
  if (container.innerHTML == "") {
    toggleEditContactMenuTemplate(container);
  } else {
    removeMobileContactMenu(container);
  }
}

function toggleEditContactMenuTemplate(container) {
  container.innerHTML = /*html*/ `
  <div class='responsive-contact-menu-container'>
  <div onclick='includeContactHTML("editContact")' class="responsive-menu" onmouseover="changeImage('assets/icons/edit-blue.svg', 'editImageResponsive')" onmouseout="changeImage('assets/icons/pen-icon.svg', 'editImageResponsive')">
    <img id="editImageResponsive" src="assets/icons/pen-icon.svg" alt="Edit Icon">
      <div>Edit</div>
  </div>
  <div onclick="deleteContact(selectedContact)" class="responsive-menu" onmouseover="changeImage('assets/icons/delete-blue.svg', 'trashImageResponsive')" onmouseout="changeImage('assets/icons/trashcan-icon.svg', 'trashImageResponsive')">
    <img id="trashImageResponsive" src="assets/icons/trashcan-icon.svg" alt="Delete Icon">
      <div>Delete</div>
  </div></div>`;
}

/**
 * Removes the mobile contact menu with a transition effect.
 * @param {HTMLElement} container - The container element to remove the menu from.
 */
function removeMobileContactMenu(container) {
  container.classList.add("let-contact-menu-disappear");
  setTimeout(() => {
    container.innerHTML = "";
  }, 500);
}

/**
 * Renders the contact menu within the specified container.
 * @param {HTMLElement} container - The container element to render the menu in.
 */
function renderContactMenu(container) {
  container.innerHTML = /*html*/ `
  <div class='responsive-contact-menu-container'>
    <div onclick='includeContactHTML("editContact")' class="responsive-menu" onmouseover="changeImage('assets/icons/edit-blue.svg', 'editImageResponsive')" onmouseout="changeImage('assets/icons/pen-icon.svg', 'editImageResponsive')">
      <img id="editImageResponsive" src="assets/icons/pen-icon.svg" alt="Edit Icon">
      <div>Edit</div>
    </div>
    <div onclick="deleteContact(selectedContact)" class="responsive-menu" onmouseover="changeImage('assets/icons/delete-blue.svg', 'trashImageResponsive')" onmouseout="changeImage('assets/icons/trashcan-icon.svg', 'trashImageResponsive')">
      <img id="trashImageResponsive" src="assets/icons/trashcan-icon.svg" alt="Delete Icon">
      <div>Delete</div>
    </div>
  </div>`;
}