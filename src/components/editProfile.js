// ====== Imports ======
import { closePopup } from './modal.js';

// ====== DOM Elements ======
// Form and input fields
const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

// Profile elements
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// ====== Utility Functions ======

// Handle form submission
function handleFormSubmit(evt) {
  evt.preventDefault(); // Prevent default form submission behavior

  // Get input values
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  // Update profile with new values
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;

  // Close the popup
  closePopup(document.querySelector('.popup_type_edit'));
}

// ====== Profile Editing Setup ======

// Initialize profile editing functionality
function setupEditProfile(openPopup) {
  // Button to open the edit popup
  const popupEditOpenButton = document.querySelector('.profile__edit-button');

  popupEditOpenButton.addEventListener('click', () => {
    // Pre-fill form inputs with current profile data
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;

    // Open the edit popup
    openPopup(document.querySelector('.popup_type_edit'));
  });

  // Attach submit event handler to the form
  formElement.addEventListener('submit', handleFormSubmit);
}

// ====== Exports ======
export { setupEditProfile };
