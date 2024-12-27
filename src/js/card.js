import { deleteCard, getCards, addCard, addLike, removeLike } from './api';
import { closePopup, openPopup } from './modal';

const container = document.querySelector('.places__list');
const popupDelete = document.querySelector('.popup_type_delete');
const formDeleteCard = document.querySelector('.popup__form[name="delete-card"]');
let activeDeleteCardId;

function createChild(data, handleDelete, handleLike, handleOpenImage) {
  const template = document.querySelector('#card-template').content.cloneNode(true);
  const card = template.querySelector('.card');
  card.id = data._id;

  const image = card.querySelector('.card__image');
  image.src = data.link;
  image.alt = data.name;
  const title = card.querySelector('.card__title');
  title.textContent = data.name;

  const deleteButton = card.querySelector('.card__delete-button');
  deleteButton.onclick = () => {
    activeDeleteCardId = data._id;
    openPopup(popupDelete)
  };

  const amount = card.querySelector('.card__like-amount');
  const likeButton = card.querySelector('.card__like-button');
  likeButton.onclick = async () => {await handleLike(data, likeButton, amount)};

  if (data.likes?.length) {amount.innerHTML = data.likes.length;}

  image.onclick = () => {handleOpenImage(data.name, data.link)};

  if (isHasLike(data)) {likeButton.classList.toggle('card__like-button_is-active');}

  return card;
}

function appendCard(item) {
  const card = createChild(
    item,
    handleDelete,
    handleLike,
    handleOpenImage
  );
  container.appendChild(card);
}

function removeItem(itemId) {
  container.querySelector(`[id="${itemId}"]`).remove();
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

function isHasLike(card) {
  const userId = window.userId;
  return !!card.likes.find(it => it._id === userId);
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
    });
   return;
  }

  await addLike(data._id).then(res => {
    if (!res) {return;}
    const isHas = isHasLike(res);
    amount.innerHTML = res.likes?.length || "";
    isHas && btn.classList.toggle('card__like-button_is-active');
  });
}

async function handleDelete(cardId) {
  await deleteCard(cardId).then((res) => res && removeItem(cardId));
}

export async function createCard(data) {
  await addCard(data).then((res) => res && addStartItem(res));
}

export async function loadCards() {
  const res = await getCards();
  appendItems(res);
}

const popup = document.querySelector('.popup_type_image');
const image = popup.querySelector('.popup__image');
const caption = popup.querySelector('.popup__caption');

function handleOpenImage(name, link) {
  image.src = link;
  image.alt = name;
  caption.textContent = name;
  openPopup(popup);
}

async function onSubmitDelete(e) {
  e.preventDefault();
  await handleDelete(activeDeleteCardId);
  activeDeleteCardId = null;
  closePopup(popupDelete)
}
formDeleteCard.onsubmit = async (e) => {await onSubmitDelete(e);};
