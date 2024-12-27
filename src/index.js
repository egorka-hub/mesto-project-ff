// ====== Imports ======
import './pages/index.css';
import {
  createCard,
  loadCards
} from './js/card';
import { openPopup, closePopup, setupPopupEventListeners } from './js/modal.js';
import { enableValidation, clearValidation, uninstallFormValidation } from './js/validation.js';
import { updateUser } from './js/api';
import {
  loadUserInfo,
  setUserInfo
} from './js/user';

// ====== DOM Elements ======
const popups = document.querySelectorAll('.popup');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupNewCardOpenButton = document.querySelector('.profile__add-button');

const formNewCard = document.querySelector('.popup__form[name="new-place"]');

const popupEditOpenButton = document.querySelector('.profile__edit-button');
const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');

export const validationConfig = {
  inputSelector: '.popup__input',
  errorClass: 'popup__input-error_active',
  submitButtonSelector: '.popup__button',
};

async function submitEditProfile(evt) {
  evt.preventDefault();
  const name = formEditProfile.querySelector('.popup__input_type_name').value;
  const about = formEditProfile.querySelector('.popup__input_type_description').value;

  const res = await updateUser({name, about});

  setUserInfo(res.name, res.about);

  closePopup(popupEdit);
  uninstallFormValidation(formEditProfile, validationConfig);
}

async function submitNewCard(evt) {
  evt.preventDefault();
  const name = formNewCard.querySelector('.popup__input_type_card-name').value;
  const link = formNewCard.querySelector('.popup__input_type_url').value;

  await createCard({name, link});

  closePopup(popupNewCard);
  uninstallFormValidation(formNewCard, validationConfig);
}

// Add animation class to popups
popups.forEach((popup) => popup.classList.add('popup_is-animated'));

// Add event listeners
popupEditOpenButton.onclick = () => {
  openPopup(popupEdit);
};

popupNewCardOpenButton.onclick = () => {
  openPopup(popupNewCard);
};

formEditProfile.onsubmit = async (e) => {await submitEditProfile(e)};
formNewCard.onsubmit = async (e) => {await submitNewCard(e)};

setupPopupEventListeners(popups);

await Promise.all([loadUserInfo(), loadCards()]);

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_error',
  errorClass: 'popup__input-error_active',
  errorSelector: '.popup__input-error',
});

