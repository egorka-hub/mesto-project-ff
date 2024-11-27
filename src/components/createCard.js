// ====== Imports ======
import { initialCards } from './cards.js';
import {
  openPopup,
  closePopup,
  popupImage,
  popupImageElement,
  popupCaption,
} from './modal.js';
import { setupEditProfile } from './editProfile.js';

// ====== Profile Editing ======
setupEditProfile(openPopup, closePopup);

// ====== DOM Elements ======
const cardContainer = document.querySelector('.places__list');
const formNewCard = document.querySelector('.popup__form[name="new-place"]');
const inputCardName = formNewCard.querySelector('.popup__input_type_card-name');
const inputCardLink = formNewCard.querySelector('.popup__input_type_url');

// ====== Utility Functions ======

// Handle like button toggle
const handleLikeCard = (likeButton) => {
  likeButton.classList.toggle('card__like-button_is-active'); // Toggle active class
};

// Open image popup
const openImagePopup = (name, link) => {
  popupImageElement.src = link;
  popupImageElement.alt = name;
  popupCaption.textContent = name;
  openPopup(popupImage);
};

// Handle card deletion
const handleDeleteCard = (cardElement) => {
  cardElement.remove();
};

// ====== Card Creation ======

// Create a card element
const createCard = (cardData, handleDelete, handleLike) => {
  const cardTemplate = document
    .querySelector('#card-template')
    .content.cloneNode(true);
  const cardElement = cardTemplate.querySelector('.card');

  // Set card values
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Add event listeners
  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => handleDelete(cardElement));

  const likeButton = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', () => handleLike(likeButton));

  cardImage.addEventListener('click', () =>
    openImagePopup(cardData.name, cardData.link)
  );

  return cardElement;
};

// ====== Card Rendering ======

// Render an array of cards
const renderCards = (cards) => {
  cards.forEach((cardData) => {
    const cardElement = createCard(cardData, handleDeleteCard, handleLikeCard);
    cardContainer.appendChild(cardElement);
  });
};

renderCards(initialCards);

// ====== Form Handling ======

// Handle new card submission
const handleNewCardSubmit = (evt) => {
  evt.preventDefault(); // Prevent default form submission

  // Get input values
  const cardName = inputCardName.value;
  const cardLink = inputCardLink.value;

  // Create and prepend the new card
  const newCard = createCard(
    { name: cardName, link: cardLink },
    handleDeleteCard,
    handleLikeCard
  );
  cardContainer.prepend(newCard);

  // Close popup and reset form
  closePopup(document.querySelector('.popup_type_new-card'));
  formNewCard.reset();
};

// Add event listener for new card form submission
formNewCard.addEventListener('submit', handleNewCardSubmit);
