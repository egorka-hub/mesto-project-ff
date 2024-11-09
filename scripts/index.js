const cardContainer = document.querySelector('.places__list');

// @todo: Темплейт карточки

// @todo: DOM узлы

// Create card function
const createCard = function (cardData, handleDelete) {
  // Find and clone the card template
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

  // Adding a handler for the delete button
  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => handleDelete(cardElement));

  return cardElement;
};

// Delete card function
const handleDeleteCard = (cardElement) => {
  cardElement.remove();
};

// Render cards on the page

const renderCards = function (cards) {
  cards.forEach((cardData) => {
    const cardElement = createCard(cardData, handleDeleteCard);
    cardContainer.appendChild(cardElement);
  });
};

renderCards(initialCards);
