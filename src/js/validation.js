// Активация/деактивация кнопки
function validateSubmitButton(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);
  const hasInvalidInput = inputs.some(input => !input.validity.valid);

  if (hasInvalidInput) {
    disableButton(button);
  } else {
    activateButton(button);
  }
}

const activateButton = (button, inactivateClass) => {
  button.classList.remove(inactivateClass);
  button.disabled = false;
};

const disableButton = (button, inactivateClass) => {
  button.classList.add(inactivateClass);
  button.disabled = true;
};

function installFormValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      validateInput(form, input, config);
      validateSubmitButton(form, config);
    });
  });
}

const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {installFormValidation(form, config);});
};

const clearValidation = (form, config) => {
  const inputList = Array.from(
    form.querySelectorAll(config.inputSelector)
  );
  const button = form.querySelector(
    config.submitButtonSelector
  );
  inputList.forEach((inputElement) => {
    hideError(form, inputElement, config);
    inputElement.setCustomValidity("");
  });
  disableButton(button, config.inactiveButtonClass);
};

const validateInput = (form, input, config) => {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.error);
  } else {
    input.setCustomValidity("");
  }
  if (!input.validity.valid) {
    showError(form, input, config);
  } else {
    hideError(form, input, config);
  }
};

const hideError = (form, input, config) => {
  const errorElement = form.querySelector(`#${input.name}-error`);
  input.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
};

const showError = (form, input, config) => {
  const errorElement = form.querySelector(`#${input.name}-error`);
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = input.validationMessage;
  errorElement.classList.add(config.errorClass);
};

export { enableValidation, clearValidation };
