import "./pages/index.css";
import { createCard } from "./scripts/card.js";
import { openModal, closeModal } from "./scripts/modal.js";
import { clearValidation, enableValidation } from "./scripts/validation.js";
import {
  getInitialCards as APIGetInitialCards,
  createCard as APICreateCard,
  deleteCard as APIDeleteCard,
  getUserInfo as APIGetUserInfo,
  updateUserInfo as APIUpdateUserInfo,
  likeCard as APILikeCard,
  unLikeCard as APIUnLikeCard,
  updateUserAvatar as APIUpdateUserAvatar,
} from "./scripts/api.js";

// для валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

//// константы

// общее
const cardList = document.querySelector(".places__list");
const modalsAll = document.querySelectorAll(".popup");
const closeButtons = document.querySelectorAll(".popup__close");

// попап увеличение картинок
const imgPopup = document.querySelector(".popup_type_image");
const closeImgButton = imgPopup.querySelector(".popup__close");
const zoomedPopupImage = imgPopup.querySelector(".popup__image");
const imgPopupCaption = imgPopup.querySelector(".popup__caption");

// добавление карточек
const cardTemplate = document.querySelector("#card-template").content;
const cardForm = document.forms["new-place"];
const cardFormSubmitButton = cardForm.querySelector(".popup__button");
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;
const popupCard = document.querySelector(".popup_type_new-card");
const popupCardButtonOpen = document.querySelector(".profile__add-button");

// редактирование аватара
const profileImageForm = document.forms["edit-avatar"];
const profileImageInput = profileImageForm.elements.avatar;
const profileImageFormSubmitButton =
  profileImageForm.querySelector(".popup__button");
const popupProfileImage = document.querySelector(".popup_type_edit-avatar");

// редактирование профиля
const profileImage = document.querySelector(".profile__image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileForm = document.forms["edit-profile"];
const profileFormSubmitButton = profileForm.querySelector(".popup__button");
const profileNameInput = profileForm.elements.name;
const profileDescriptionInput = profileForm.elements.description;
const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileButtonOpen = document.querySelector(".profile__edit-button");

const setProfile = ({ name, description, avatar }) => {
  profileTitle.textContent = name;
  profileDescription.textContent = description;
  profileImage.style.backgroundImage = `url(${avatar})`;
};

const renderLoading = ({ buttonElement, isLoading }) => {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
  } else {
    buttonElement.textContent = "Сохранить";
  }
};

// плавное открытие попапов
modalsAll.forEach((elem) => {
  elem.classList.add("popup_is-animated");
});

// закрытие попапов по крестику
closeButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    const popup = evt.target.closest(".popup");
    if (popup) {
      closeModal(popup);
    }
  });
});

//// КАРТОЧКИ
//попап добавления карточки
const handlePopupCardButtonOpenClick = () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModal(popupCard);
};
popupCardButtonOpen.addEventListener("click", handlePopupCardButtonOpenClick);

// попап увеличения картинки
const handleShowImgPopup = ({ cardName, cardLink }) => {
  zoomedPopupImage.src = cardLink;
  zoomedPopupImage.alt = cardName;
  imgPopupCaption.textContent = cardName;
  openModal(imgPopup);
};

//Закрытие попапа изображения
closeImgButton.addEventListener("click", () => {
  closeModal(imgPopup);
});

// обработчик отправки формы создания карточки
const handleCardFormSubmit = (event) => {
  event.preventDefault();
  renderLoading({
    buttonElement: cardFormSubmitButton,
    isLoading: true,
  });
  APICreateCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      cardList.prepend(
        createCard({
          currentUserId: cardData.owner["_id"],
          template: cardTemplate,
          cardInfo: cardData,
          deleteCard: handleCardDelete,
          likeCard: handleCardLike,
          showImgPopup: handleShowImgPopup,
        })
      );
      cardForm.reset();
      closeModal(popupCard);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      renderLoading({
        buttonElement: cardFormSubmitButton,
        isLoading: false,
      });
    });
};

// обработчик лайка карточки
const handleCardLike = ({ cardId, buttonElement, counterElement }) => {
  buttonElement.disabled = true;

  if (buttonElement.classList.contains("card__like-button_is-active")) {
    APIUnLikeCard(cardId)
      .then(({ likes }) => {
        buttonElement.classList.remove("card__like-button_is-active");

        if (likes.length) {
          counterElement.classList.add("card__like-counter_is-active");
          counterElement.textContent = likes.length;
        } else {
          counterElement.classList.remove("card__like-counter_is-active");
          counterElement.textContent = "";
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        buttonElement.disabled = false;
      });
  } else {
    APILikeCard(cardId)
      .then(({ likes }) => {
        buttonElement.classList.add("card__like-button_is-active");
        counterElement.classList.add("card__like-counter_is-active");
        counterElement.textContent = likes.length;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        buttonElement.disabled = false;
      });
  }
};
//Обработка отправки формы карточки
cardForm.addEventListener("submit", handleCardFormSubmit);

// обработчик удаления карточки
const handleCardDelete = ({ cardId, cardElement, buttonElement }) => {
  buttonElement.disabled = true;
  APIDeleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((error) => {
      buttonElement.disabled = false;
      console.error(error);
    });
};

//// ПРОФИЛЬ
// попап редактирования профиля
const handlePopupProfileButtonOpenClick = () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(popupProfile);
};
popupProfileButtonOpen.addEventListener(
  "click",
  handlePopupProfileButtonOpenClick
);

// обработчик отправки изменений профиля на сервер
const handleProfileFormSubmit = (event) => {
  event.preventDefault();
  renderLoading({
    buttonElement: profileFormSubmitButton,
    isLoading: true,
  });
  APIUpdateUserInfo({
    name: profileNameInput.value,
    description: profileDescriptionInput.value,
  })
    .then(({ name, about, avatar }) => {
      setProfile({
        name,
        description: about,
        avatar,
      });
      closeModal(popupProfile);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      renderLoading({
        buttonElement: profileFormSubmitButton,
        isLoading: false,
      });
    });
};

// Обработка отправки формы профиля
profileForm.addEventListener("submit", handleProfileFormSubmit);

//// АВАТАР

// попап редактирования аватара
const handleProfileImageClick = () => {
  profileImageForm.reset();

  clearValidation(profileImageForm, validationConfig);

  openModal(popupProfileImage);
};

// обработчик обновления аватара
const handleProfileImageFormSubmit = (event) => {
  event.preventDefault();

  renderLoading({
    buttonElement: profileImageFormSubmitButton,
    isLoading: true,
  });

  APIUpdateUserAvatar(profileImageInput.value)
    .then(({ name, about, avatar }) => {
      setProfile({
        name,
        description: about,
        avatar,
      });

      closeModal(popupProfileImage);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      renderLoading({
        buttonElement: profileImageFormSubmitButton,
        isLoading: false,
      });
    });
};

// Обработка отправки формы смены аватара
profileImageForm.addEventListener("submit", handleProfileImageFormSubmit);
profileImage.addEventListener("click", handleProfileImageClick);

enableValidation(validationConfig);

// получение данных с сервера
Promise.all([APIGetUserInfo(), APIGetInitialCards()])
  .then(([{ name, about, avatar, ["_id"]: currentUserId }, cardsData]) => {
    setProfile({
      name,
      description: about,
      avatar,
    });

    cardsData.forEach((cardData) => {
      cardList.append(
        createCard({
          currentUserId,
          template: cardTemplate,
          cardInfo: cardData,
          deleteCard: handleCardDelete,
          likeCard: handleCardLike,
          showImgPopup: handleShowImgPopup,
        })
      );
    });
  })
  .catch((error) => {
    console.error(error);
  });
