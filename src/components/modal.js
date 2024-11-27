// ====== DOM Elements ======
// Common popups
const popups = document.querySelectorAll('.popup');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

// Popup Image and Caption
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

// Buttons for opening popups
const popupEditOpenButton = document.querySelector('.profile__edit-button');
const popupNewCardOpenButton = document.querySelector('.profile__add-button');

// ====== Functions ======

// Open popup
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
}

// Close popup
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
}

// Handle closing popup with Escape key
function handleEscape(event) {
  if (event.key === 'Escape') {
    const activePopup = document.querySelector('.popup_is-opened');
    if (activePopup) closePopup(activePopup);
  }
}

// Close popup on overlay click or close button
function setupPopupEventListeners() {
  popups.forEach((popup) => {
    popup.classList.add('popup_is-animated'); // Add animation class
    popup.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('popup') || // Click on overlay
        event.target.classList.contains('popup__close') // Click on close button
      ) {
        closePopup(popup);
      }
    });
  });
}

// ====== Event Listeners ======
setupPopupEventListeners(); // Initialize popup event listeners

// Open specific popups
popupEditOpenButton.addEventListener('click', () => openPopup(popupEdit));
popupNewCardOpenButton.addEventListener('click', () => openPopup(popupNewCard));

// ====== Exports ======
export { popupImage, popupImageElement, popupCaption, openPopup, closePopup };
