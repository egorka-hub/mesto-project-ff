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

  button.classList.add(config.inactiveButtonClass);
}

// Включение валидации
function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    installFormValidation(form, config);
  });
}

export function validateInput(input, config) {
  const errorElement = input.closest('form').querySelector(`#${input.name}-error`);
  let error = '';

  const { name, value } = input;

  if (name === 'name') {
    error = 'Длина должна быть 2-40 симоволов. Обязательное поле.'
  } else if (name === 'place-name') {
    error = 'Длина должна быть 2-30 симоволов. Обязательное поле.';
  } else if (name === 'description') {
    error = 'Длина должна быть 2-200 симоволов. Обязательное поле.';
  } else if (name === 'link') {
    error = 'Неверный формат ссылки.';
  }

  if (!input.validity.valid && errorElement && value) {
    errorElement.textContent = error || '';
    errorElement.classList.toggle(config.errorClass, true);
    input.classList.toggle(config.inputErrorClass, true);
  }
  if (input.validity.valid && errorElement && value) {
    errorElement.textContent = '';
    errorElement.classList.toggle(config.errorClass, false);
    input.classList.toggle(config.inputErrorClass, false);
  }

  return input.validity.valid;
}

export { enableValidation, clearValidation };
