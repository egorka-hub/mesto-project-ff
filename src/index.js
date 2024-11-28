// index.js

// ====== Imports ======
import './pages/index.css';
import { initialCards } from './components/cards.js';
import {
  createCard,
  handleLikeCard,
  handleDeleteCard,
} from './components/createCard.js';
import {
  openPopup,
  closePopup,
  setupPopupEventListeners,
} from './components/modal.js';

// ====== DOM Elements ======
const popups = document.querySelectorAll('.popup');
const cardContainer = document.querySelector('.places__list');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');
const popupEditOpenButton = document.querySelector('.profile__edit-button');
const popupNewCardOpenButton = document.querySelector('.profile__add-button');
const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formNewCard = document.querySelector('.popup__form[name="new-place"]');
const inputCardName = formNewCard.querySelector('.popup__input_type_card-name');
const inputCardLink = formNewCard.querySelector('.popup__input_type_url');

// ====== Utility Functions ======

// Open image popup
function openImagePopup(name, link) {
  popupImageElement.src = link;
  popupImageElement.alt = name;
  popupCaption.textContent = name;
  openPopup(popupImage);
}

// Render cards
function renderCards(cards) {
  cards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      handleDeleteCard,
      handleLikeCard,
      openImagePopup
    );
    cardContainer.appendChild(cardElement);
  });
}

// Handle edit profile form submission
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closePopup(popupEdit);
}

// Handle new card form submission
function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const newCard = createCard(
    { name: inputCardName.value, link: inputCardLink.value },
    handleDeleteCard,
    handleLikeCard,
    openImagePopup
  );
  cardContainer.prepend(newCard);

  closePopup(popupNewCard);
  formNewCard.reset();
}

// ====== Initialization ======

// Add animation class to popups
popups.forEach((popup) => popup.classList.add('popup_is-animated'));

// Add event listeners
popupEditOpenButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupEdit);
});

popupNewCardOpenButton.addEventListener('click', () => openPopup(popupNewCard));

formElement.addEventListener('submit', handleEditProfileSubmit);
formNewCard.addEventListener('submit', handleNewCardSubmit);

// Setup popup event listeners
setupPopupEventListeners(popups);

// Render initial cards
renderCards(initialCards);
