// Проверка отдельного поля ввода
function validateInput(input) {
  const errorElement = document.querySelector(`#${input.name}-error`);
  let isValid = true;

  if (!input.validity.valid) {
    // Стандартные браузерные сообщения
    errorElement.textContent = input.validationMessage;
    isValid = false;
  } else if (input.name === 'name') {
    // Проверка поля "Имя" для формы "Редактировать профиль"
    const namePattern = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,40}$/;
    if (input.value.length < 2 || input.value.length > 40) {
      errorElement.textContent = 'Имя должно содержать от 2 до 40 символов.';
      isValid = false;
    } else if (!namePattern.test(input.value)) {
      errorElement.textContent =
        'Имя должно содержать только буквы, пробелы и дефисы.';
      isValid = false;
    } else {
      errorElement.textContent = '';
    }
  } else if (input.name === 'description') {
    // Проверка поля "О себе"
    const descriptionPattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
    if (input.value.length < 2 || input.value.length > 200) {
      errorElement.textContent =
        'Описание должно содержать от 2 до 200 символов.';
      isValid = false;
    } else if (!descriptionPattern.test(input.value)) {
      errorElement.textContent =
        'Описание должно содержать только буквы, пробелы и дефисы.';
      isValid = false;
    } else {
      errorElement.textContent = '';
    }
  } else if (input.name === 'place-name') {
    // Проверка поля "Название" для формы "Новое место"
    const placeNamePattern = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,30}$/;
    if (input.value.length < 2 || input.value.length > 30) {
      errorElement.textContent =
        'Название должно содержать от 2 до 30 символов.';
      isValid = false;
    } else if (!placeNamePattern.test(input.value)) {
      errorElement.textContent =
        'Название должно содержать только буквы, пробелы и дефисы.';
      isValid = false;
    } else {
      errorElement.textContent = '';
    }
  } else if (input.name === 'link') {
    // Проверка поля "Ссылка на картинку"
    const urlPattern =
      /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,6}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (!urlPattern.test(input.value)) {
      errorElement.textContent = 'Введите корректный URL.';
      isValid = false;
    } else {
      errorElement.textContent = '';
    }
  } else {
    errorElement.textContent = ''; // Нет ошибок для остальных полей
  }

  // Показ или скрытие сообщения об ошибке
  errorElement.classList.toggle(
    'popup__input-error_active',
    errorElement.textContent !== ''
  );

  return isValid;
}

// Активация/деактивация кнопки
function toggleSubmitButton(form, button) {
  const inputs = Array.from(form.querySelectorAll('.popup__input'));
  const isFormValid = inputs.every(
    (input) => input.value && validateInput(input)
  ); // Проверяем все поля

  if (!isFormValid) {
    button.setAttribute('disabled', true);
    button.classList.add('popup__button_disabled');
  } else {
    button.removeAttribute('disabled');
    button.classList.remove('popup__button_disabled');
  }
}

function setFormValidation(form) {
  const inputs = Array.from(form.querySelectorAll('.popup__input'));
  const submitButton = form.querySelector('.popup__button');

  // Инициализация кнопки в состоянии disabled
  toggleSubmitButton(form, submitButton);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      validateInput(input); 
      toggleSubmitButton(form, submitButton); // Обновляем кнопку
    });
  });
}

// Очистка ошибок и состояния формы
function resetValidation(form) {
  const errorElements = form.querySelectorAll('.popup__input-error');
  const inputs = form.querySelectorAll('.popup__input');
  const submitButton = form.querySelector('.popup__button');

  errorElements.forEach((error) => (error.textContent = ''));
  inputs.forEach((input) => {
    input.value = ''; // Сбрасываем поля
    input.classList.remove('popup__input-error_active');
  });

  toggleSubmitButton(form, submitButton); // Сбрасываем кнопку в disabled
}

export { setFormValidation, resetValidation, toggleSubmitButton };
