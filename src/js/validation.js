import { plural } from './utils';

const STR_REGEXP = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
const URL_REGEXP =  /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,6}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
const BTN_DISABLED_ATTR = 'disabled';

// Активация/деактивация кнопки
function validateSubmitButton(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);
  const isValid = inputs.every(input => validateInput(input, config));

  if (isValid) {
    button.removeAttribute(BTN_DISABLED_ATTR);
    button.classList.remove(config.inactiveButtonClass);
  } else {
    button.setAttribute(BTN_DISABLED_ATTR, 'true');
    button.classList.add(config.inactiveButtonClass);
  }
}

// Добавление слушателей событий
function installFormValidation(form, config) {
  clearValidation(form, config);

  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  inputs.forEach((input) => {
    const validateHandler = () => {
      validateInput(input, config);
      validateSubmitButton(form, config);
    };
    input.addEventListener('input', validateHandler);
    input._validateHandler = validateHandler;
  });

  validateSubmitButton(form, config);
}

// Удаление слушателей событий
export function uninstallFormValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  inputs.forEach((input) => {
    if (input._validateHandler) {
      input.removeEventListener('input', input._validateHandler);
      input.value = '';
      delete input._validateHandler;
    }
  });

  clearValidation(form, config);
}

// Сброс ошибок и состояния формы
function clearValidation(form, config) {
  const button = form.querySelector(config.submitButtonSelector);
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));

  inputs.forEach((input) => {
    const errorElement = form.querySelector(`#${input.name}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove(config.errorClass);
    }
  });

  button.setAttribute(BTN_DISABLED_ATTR, 'true');
  button.classList.add(config.inactiveButtonClass);
}

// Включение валидации
function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    form.setAttribute('novalidate', 'true');
    installFormValidation(form, config);
  });
}

export function validateInput(input, config) {
  const errorElement = input.closest('form').querySelector(`#${input.name}-error`);
  let error = '';

  const { name, value } = input;

  if (name === 'name') {
    error = validateStr(value, true, 2, 40);
  } else if (name === 'place-name') {
    error = validateStr(value, true, 2, 30);
  } else if (name === 'description') {
    error = validateStr(value, false, 2, 200);
  } else if (name === 'link' || name === 'avatar') {
    error = validateUrl(value);
  }

  if (errorElement && value) {
    errorElement.textContent = error || '';
    errorElement.classList.toggle(config.errorClass, !!error);
    input.classList.toggle(config.inputErrorClass, !!error);
  }

  return !error;
}

const validateStr = (value, required, min, max) => {
  if (required && !value) {
    return 'Обязательное поле.'
  }
  if (min && value.length < min) {
    return `Минимальная длина ${min} ${plural(min, ['символ', 'символа', 'символов'])}.`;
  }
  if (max && value.length > max) {
    return `Минимальная длина ${max} ${plural(max, ['символ', 'символа', 'символов'])}.`;
  }
  if (!STR_REGEXP.test(value)) {
    return 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.'
  }
  return null;
}

const validateUrl = (value) => {
  if (!URL_REGEXP.test(value)) {
    return 'Введите корректный URL.';
  }
  return null;
}

export { enableValidation, clearValidation };
