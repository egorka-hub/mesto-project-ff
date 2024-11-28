// createCard.js

// ====== Functions ======

// Creates a card element
export function createCard(cardData, handleDelete, handleLike, openImagePopup) {
  const cardTemplate = document
    .querySelector('#card-template')
    .content.cloneNode(true);
  const cardElement = cardTemplate.querySelector('.card');

  // Set card data
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
}

// Toggles the like button state
export function handleLikeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

// Deletes the card element
export function handleDeleteCard(cardElement) {
  cardElement.remove();
}
