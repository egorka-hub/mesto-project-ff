// ====== Imports ======
import './pages/index.css';
import { createChild, handleLike, handleDelete } from './js/card';
import { openPopup, closePopup, setupPopupEventListeners } from './js/modal.js';
import { enableValidation, clearValidation } from './js/validation.js';
import {
  getCards,
  updateUser,
  addCard,
  getUser,
  updateAvatar
} from './js/api';
import { renderLoading } from './js/utils';

// ====== DOM Elements ======
const container = document.querySelector('.places__list');

const popups = document.querySelectorAll('.popup');
const popupDelete = document.querySelector('.popup_type_delete');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupNewCardOpenButton = document.querySelector('.profile__add-button');
const popupEditOpenButton = document.querySelector('.profile__edit-button');
const popupAvatar = document.querySelector('.popup_type_avatar');

const formNewCard = document.querySelector('.popup__form[name="new-place"]');
const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formDeleteCard = document.querySelector('.popup__form[name="delete-card"]');
const formUpdateAvatar = document.querySelector('.popup__form[name="update-avatar"]');

export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_error',
  errorClass: 'popup__input-error_active',
  errorSelector: '.popup__input-error',
};

const avatar = document.querySelector('.profile__image');

function setUserInfo(user) {
  const title = document.querySelector('.profile__title');
  const description = document.querySelector('.profile__description');

  title.textContent = user.name;
  description.textContent = user.about;
  avatar.style.backgroundImage = `url(\"${user.avatar}\")`;
}

async function onSubmitAvatar(e) {
  e.preventDefault();
  const link = formUpdateAvatar.querySelector('.popup__input_type_avatar').value;
  if (!link) {return;}

  renderLoadingPopup(popupAvatar, true);
  await updateAvatar(link)
    .then((res) => {
      avatar.style.backgroundImage = `url(\"${res.avatar}\")`;
      closePopup(popupAvatar);
      clearValidation(formUpdateAvatar, validationConfig);
    })
    .catch(e => console.error(`Ошибка при выполнении запроса: ${e}`))
    .finally(() => {
      renderLoadingPopup(popupAvatar, false);
    });
}

formUpdateAvatar.onsubmit = async (e) => {await onSubmitAvatar(e);};

async function submitEditProfile(evt) {
  evt.preventDefault();
  const name = formEditProfile.querySelector('.popup__input_type_name').value;
  const about = formEditProfile.querySelector('.popup__input_type_description').value;

  renderLoadingPopup(popupEdit, true);
  await updateUser({name, about}).then(res => {
      if (res) {
        setUserInfo(res);
        closePopup(popupEdit);
        clearValidation(formEditProfile, validationConfig);
      }
    })
  .catch(e => console.error(`Ошибка при выполнении запроса: ${e}`))
  .finally(() => renderLoadingPopup(popupEdit, false));
}

async function submitNewCard(evt) {
  evt.preventDefault();
  const name = formNewCard.querySelector('.popup__input_type_card-name').value;
  const link = formNewCard.querySelector('.popup__input_type_url').value;

  renderLoadingPopup(popupNewCard, true);
  await addCard({name, link})
    .then(res => {
      if (res) {
        const card = createChild(res, res.owner._id, callbacks);
        container.prepend(card);
        renderLoadingPopup(popupNewCard, false);
        closePopup(popupNewCard);
        clearValidation(formNewCard, validationConfig);
      }
    })
    .catch(e => console.error(`Ошибка при выполнение запросов: ${e}`));
}

// Карточки
const callbacks = {
  like: handleLike,
  delete: handleOpenDeleteCard,
  openImage: handleOpenImage
}

async function onSubmitDelete(e, cardId) {
  e.preventDefault();
  await handleDelete(e, cardId)
    .then(() => {
      closePopup(popupDelete);
      formDeleteCard.onsubmit = null;
  })
    .catch(e => console.error(`Ошибка при выполнение запросов: ${e}`));
}

export function handleOpenDeleteCard(e, cardId) {
  openPopup(popupDelete);
  formDeleteCard.onsubmit = async (event) => {
    event.preventDefault();
    await onSubmitDelete(e, cardId);
  };
}

function handleOpenImage(name, link) {
  const popupImage = document.querySelector('.popup_type_image');
  const image = popupImage.querySelector('.popup__image');
  const caption = popupImage.querySelector('.popup__caption');

  image.src = link;
  image.alt = name;
  caption.textContent = name;
  openPopup(popupImage);
}

function updateEditFormData() {
  const currentName = document.querySelector('.profile__title').textContent;
  const currentAbout = document.querySelector('.profile__description').textContent;
  const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
  const nameInput = formEditProfile.querySelector('.popup__input_type_name');
  const aboutInput = formEditProfile.querySelector('.popup__input_type_description');

  nameInput.value = currentName;
  aboutInput.value = currentAbout;
}

popupEditOpenButton.onclick = () => {openFormPopup(popupEdit, updateEditFormData);};
popupNewCardOpenButton.onclick = () => {openFormPopup(popupNewCard);};
avatar.onclick = () => {openFormPopup(popupAvatar);};

const openFormPopup = (popup, cb) => {
  const form = popup.querySelector("form");
  if (cb) {
    cb();
  } else {
    form.reset();
  }
  clearValidation(form, validationConfig);
  openPopup(popup);
};

formEditProfile.onsubmit = async (e) => {await submitEditProfile(e)};
formNewCard.onsubmit = async (e) => {await submitNewCard(e)};

setupPopupEventListeners(popups);

Promise.all([getUser(), getCards()])
  .then(res => {
    const userData = res[0];
    const initialData = res[1];

    setUserInfo(userData)
    initialData.forEach(it => {
      container.append(createChild(it, userData._id, callbacks));
    })
  })
  .catch(e => console.error(`Ошибка при выполнение запросов: ${e}`));

export function renderLoadingPopup(popup, isLoading) {
  const submitButton = popup.querySelector("button[type='submit']");
  if (submitButton !== null) {
    renderLoading(submitButton, isLoading);
  }
}

enableValidation(validationConfig);

