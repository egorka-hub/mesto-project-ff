// Открыть Popup
export function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
}

// Закрыть Popup
export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
}

// Закрыть Popup по нажатию на escape
export function handleEscape(event) {
  if (event.key === 'Escape') {
    const activePopup = document.querySelector('.popup_is-opened');
    if (activePopup) closePopup(activePopup);
  }
}

// Закрытие Popup по клику вне окна
export function setupPopupEventListeners(popups) {
  popups.forEach((popup) => {
    popup.onclick = (event) => {
      if (event.target.classList.contains('popup') || event.target.classList.contains('popup__close')) {closePopup(popup);}
    };
  });
}
