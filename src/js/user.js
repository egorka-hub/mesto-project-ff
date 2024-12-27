import { getUser, updateAvatar } from './api';
import { closePopup, openPopup } from './modal';
import {
  clearValidation,
  uninstallFormValidation
} from './validation';
import { validationConfig } from '../index.js';

const avatar = document.querySelector('.profile__image');

const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const aboutInput = formEditProfile.querySelector('.popup__input_type_description');

const popupAvatar = document.querySelector('.popup_type_avatar');
const formUpdateAvatar = document.querySelector('.popup__form[name="update-avatar"]');

export async function loadUserInfo() {
  const user = await getUser();
  window.userId = user._id;

  setUserInfo(user.name, user.about);
  setAvatarImage(user.avatar);

  nameInput.value = user.name;
  aboutInput.value = user.about;
}

avatar.onclick = () => {
  clearValidation(formUpdateAvatar, validationConfig);
  openPopup(popupAvatar);
};

function setAvatarImage(url) {
  avatar.style.backgroundImage = `url(\"${url}\")`;
}

export function setUserInfo(name, about) {
  const title = document.querySelector('.profile__title');
  const description = document.querySelector('.profile__description');

  title.textContent = name;
  description.textContent = about;
}

async function onSubmitAvatar(e) {
  e.preventDefault();
  const link = formUpdateAvatar.querySelector('.popup__input_type_url').value;

  await updateAvatar(link).then((res) => {
    setAvatarImage(res.avatar);
  });

  closePopup(popupAvatar);
  uninstallFormValidation(formUpdateAvatar, validationConfig);
}

formUpdateAvatar.onsubmit = async (e) => {await onSubmitAvatar(e);};

