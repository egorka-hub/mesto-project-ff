// modal.js

// ====== Functions ======

// Opens a popup
export function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  popup.style.visibility = 'visible';
  popup.style.opacity = '1';
  document.addEventListener('keydown', handleEscape);
}

// Closes a popup
export function closePopup(popup) {
  popup.style.opacity = '0';
  setTimeout(() => {
    popup.style.visibility = 'hidden';
    popup.classList.remove('popup_is-opened');
  }, 600); // Matches CSS transition duration
  document.removeEventListener('keydown', handleEscape);
}

// Closes popup with the Escape key
export function handleEscape(event) {
  if (event.key === 'Escape') {
    const activePopup = document.querySelector('.popup_is-opened');
    if (activePopup) closePopup(activePopup);
  }
}

// Adds event listeners to close popups on overlay or close button click
export function setupPopupEventListeners(popups) {
  popups.forEach((popup) => {
    popup.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('popup') ||
        event.target.classList.contains('popup__close')
      ) {
        closePopup(popup);
      }
    });
  });
}
