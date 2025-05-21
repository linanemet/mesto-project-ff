const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

// отображение ошибок
const showInputError = ({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
  errorMessage,
}) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  errorElement.classList.add(errorClass);
  errorElement.textContent = errorMessage;

  inputElement.classList.add(inputErrorClass);
};

// скрытие ошибок
const hideInputError = ({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
}) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";

  inputElement.classList.remove(inputErrorClass);
};

// проверка валидности инпутов
const checkInputValidity = ({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
}) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError({
      formElement,
      inputElement,
      errorMessage: inputElement.validationMessage,
      errorClass,
      inputErrorClass,
    });
  } else {
    hideInputError({
      formElement,
      inputElement,
      errorClass,
      inputErrorClass,
    });
  }
};

// управление состоянием кнопки отправки
const toggleButtonState = ({
  inputList,
  submitButtonElement,
  inactiveButtonClass,
}) => {
  if (hasInvalidInput(inputList)) {
    submitButtonElement.disabled = true;
    submitButtonElement.classList.add(inactiveButtonClass);
  } else {
    submitButtonElement.disabled = false;
    submitButtonElement.classList.remove(inactiveButtonClass);
  }
};

// навешивание слушателей событий
const setEventListeners = ({
  formElement,
  inputSelector,
  inputErrorClass,
  submitButtonSelector,
  inactiveButtonClass,
  errorClass,
}) => {
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  const submitButtonElement = formElement.querySelector(submitButtonSelector);

  toggleButtonState({
    inputList,
    submitButtonElement,
    inactiveButtonClass,
  });
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity({
        formElement,
        inputElement,
        inputErrorClass,
        errorClass,
      });
      toggleButtonState({
        inputList,
        submitButtonElement,
        inactiveButtonClass,
      });
    });
  });
};

// инициализация валидации
export const enableValidation = ({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass,
}) => {
  const formList = document.querySelectorAll(formSelector);

  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    setEventListeners({
      formElement,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
      inputErrorClass,
      errorClass,
    });
  });
};

// очистка ошибок и обновление состояния кнопки
export const clearValidation = (
  formElement,
  {
    submitButtonSelector,
    inactiveButtonClass,
    inputSelector,
    inputErrorClass,
    errorClass,
  }
) => {
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  const submitButtonElement = formElement.querySelector(submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError({
      formElement,
      inputElement,
      inputErrorClass,
      errorClass,
    });
  });

  toggleButtonState({
    inputList,
    submitButtonElement,
    inactiveButtonClass,
  });
};
