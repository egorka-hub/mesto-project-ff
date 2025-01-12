import { deleteCard, addLike, removeLike }   from './api';

const template = document.querySelector("#card-template").content;
const card = template.querySelector(".card");
const activeLikeClass = "card__like-button_is-active";

function createChild(data, userId, callbacks) {
  const clone = card.cloneNode(true);
  const title = clone.querySelector('.card__title');
  const image = clone.querySelector('.card__image');
  const amountLikes = clone.querySelector('.card__like-amount');
  const likeButton = clone.querySelector('.card__like-button');
  const deleteButton = clone.querySelector('.card__delete-button');

  title.textContent = data.name;
  image.src = data.link;
  image.alt = data.name;

  if (data.likes?.length) {
    amountLikes.innerHTML = data.likes.length;
  }
  if (hasLike(data, userId)) {
    likeButton.classList.add(activeLikeClass);
  }
  likeButton.onclick = async (e) => {await callbacks.like(e, data)};
  image.onclick = () => {callbacks.openImage(data.name, data.link)};
  if (userId === data.owner._id) {
    deleteButton.onclick = async (e) => {callbacks.delete(e, data._id);};
    deleteButton.classList.add("card__delete-button_is-active");
  }

  return clone;
}

export function hasLike(card, userId) {
  return !!card.likes.find(it => it._id === userId);
}

async function handleLike(event, data) {
  const btn = event.target;
  const amount = event.target.closest(".card__likes").querySelector(".card__like-amount");
  const fn = btn.classList.contains(activeLikeClass) ? removeLike : addLike;

  await fn(data._id)
    .then(res => {
      if (!res) {return;}
      amount.innerHTML = res.likes?.length || "";
      btn.classList.toggle(activeLikeClass);
    })
    .catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));
}

async function handleDelete(event, cardId) {
  const card = event.target.closest(".card");
  await deleteCard(cardId)
    .then((res) => res && card.remove())
    .catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));
}

export {createChild, handleDelete, handleLike}
