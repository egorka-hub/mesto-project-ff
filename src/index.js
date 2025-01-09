// ====== Imports ======
import './pages/index.css';
import {
  addCardDeleteButton,
  createCard,
  isHasLike
} from './js/card';
import { openPopup, closePopup, setupPopupEventListeners } from './js/modal.js';
import { enableValidation, clearValidation } from './js/validation.js';
import { loadUserInfo, setUserInfo } from './js/user';
import { deleteCard, getCards, addLike, removeLike, updateUser } from './js/api';

// ====== DOM Elements ======
const container = document.querySelector('.places__list');
const popupDelete = document.querySelector('.popup_type_delete');
const formDeleteCard = document.querySelector('.popup__form[name="delete-card"]');

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

  const res = await updateUser({name, about}).catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));

  setUserInfo(res.name, res.about);

  closePopup(popupEdit);
  clearValidation(formEditProfile, validationConfig);
}

async function submitNewCard(evt) {
  evt.preventDefault();
  const name = formNewCard.querySelector('.popup__input_type_card-name').value;
  const link = formNewCard.querySelector('.popup__input_type_url').value;

  await createCard({name, link}, addStartItem);

  closePopup(popupNewCard);
  clearValidation(formNewCard, validationConfig);
}

// Карточки

function appendCard(item) {
  const card = createChild(
    item,
    handleDelete,
    handleLike,
    handleOpenImage
  );
  container.appendChild(card);
}

function addStartItem(item) {
  const card = createChild(item, handleDelete, handleLike, handleOpenImage);
  const first= container.querySelectorAll('.card')?.[0];
  if (first) {
    container.insertBefore(card, first);
  } else {
    container.appendChild(card);
  }
}

export function removeItem(itemId) {
  container.querySelector(`[id="${itemId}"]`).remove();
}

function appendItems(items) {
  items.forEach((item) => appendCard(item));
}

async function handleLike(data, btn, amount) {
  const isLiked = btn.classList.contains('card__like-button_is-active');

  if (isLiked) {
    await removeLike(data._id).then(res => {
      if (!res) {return;}
      const isNotHas = !isHasLike(res);
      amount.innerHTML = res.likes?.length || "";
      isNotHas && btn.classList.toggle('card__like-button_is-active');
    }).catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));
    return;
  }

  await addLike(data._id).then(res => {
    if (!res) {return;}
    const isHas = isHasLike(res);
    amount.innerHTML = res.likes?.length || "";
    isHas && btn.classList.toggle('card__like-button_is-active');
  }).catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));
}

async function handleDelete(cardId) {
  await deleteCard(cardId).then((res) => res && removeItem(cardId)).catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));
}

function createChild(data, handleDelete, handleLike, handleOpenImage) {
  const template = document.querySelector('#card-template').content.cloneNode(true);
  const card = template.querySelector('.card');
  card.id = data._id;

  const image = card.querySelector('.card__image');
  image.src = data.link;
  image.alt = data.name;
  const title = card.querySelector('.card__title');
  title.textContent = data.name;

  const amount = card.querySelector('.card__like-amount');
  const likeButton = card.querySelector('.card__like-button');
  likeButton.onclick = async () => {await handleLike(data, likeButton, amount)};

  if (data.likes?.length) {amount.innerHTML = data.likes.length;}

  image.onclick = () => {handleOpenImage(data.name, data.link)};

  if (isHasLike(data)) {likeButton.classList.toggle('card__like-button_is-active');}

  addCardDeleteButton(card, data, handleOpenDeleteCard);

  return card;
}

async function onSubmitDelete(e, cardId) {
  e.preventDefault();
  await handleDelete(cardId).then(() => {
    closePopup(popupDelete);
    formDeleteCard.onsubmit = null;
  });
}

function handleOpenDeleteCard(cardId) {
  openPopup(popupDelete);
  formDeleteCard.onsubmit = async (e) => {await onSubmitDelete(e, cardId);};
}

export async function loadCards() {
  const res = await getCards().catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));
  appendItems(res);
}

const popupImage = document.querySelector('.popup_type_image');
const image = popupImage.querySelector('.popup__image');
const caption = popupImage.querySelector('.popup__caption');

function handleOpenImage(name, link) {
  image.src = link;
  image.alt = name;
  caption.textContent = name;
  openPopup(popupImage);
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

await Promise.all([loadUserInfo(), loadCards()]).catch(e => console.error(`Ошибка при выполнение запросов: ${e}`));

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_error',
  errorClass: 'popup__input-error_active',
  errorSelector: '.popup__input-error',
});

