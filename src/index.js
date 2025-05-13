import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, deleteCard, likeCard } from "./scripts/card.js";
import { openModal, closeModal } from "./scripts/modal.js";

// для создания карточки
const cardList = document.querySelector(".places__list");

// вывод карточек
function addCard(
  cardData,
  cardList,
  deleteCard,
  createCard,
  likeCard,
  showImgPopup
) {
  const cardElement = createCard(cardData, deleteCard, likeCard, showImgPopup);
  cardList.append(cardElement);
}

// заполнение страницы карточками
function fillCards(initialCards) {
  initialCards.forEach((cardData) => {
    addCard(cardData, cardList, deleteCard, createCard, likeCard, showImgPopup);
  });
}
fillCards(initialCards);

// попап редактирования профиля
const editPopup = document.querySelector(".popup_type_edit");
const profileEditButton = document.querySelector(".profile__edit-button");
const closeEditButton = editPopup.querySelector(".popup__close");
const editForm = document.querySelector('form[name="edit-profile"]');
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

profileEditButton.addEventListener("click", () => {
  openModal(editPopup);
  fillPopupEditInputs();
});

closeEditButton.addEventListener("click", () => {
  closeModal(editPopup);
});

// функция сохранения полей ввода формы
function fillPopupEditInputs() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

// функция редактирования профиля
function handleEditForm(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;
  closeModal(editPopup);
}

editForm.addEventListener("submit", handleEditForm);

// попап добавления карточек
const addCardPopup = document.querySelector(".popup_type_new-card");
const openAddButton = document.querySelector(".profile__add-button");
const closeAddButton = addCardPopup.querySelector(".popup__close");
const addForm = document.querySelector('form[name="new-place"]');
const cardInput = addForm.querySelector(".popup__input_type_card-name");
const linkInput = addForm.querySelector(".popup__input_type_url");

openAddButton.addEventListener("click", () => {
  openModal(addCardPopup);
});

addForm.addEventListener("submit", handleAddFormSubmit);

// добавление новой карточки из окна редактирования
function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: cardInput.value,
    link: linkInput.value,
  };
  const newCardElement = createCard(newCard, deleteCard, likeCard, showImgPopup);
  cardList.prepend(newCardElement);
  closeModal(addCardPopup);
  addForm.reset();
}

closeAddButton.addEventListener("click", () => {
  closeModal(addCardPopup);
});

// попап увеличение картинок
const imgPopup = document.querySelector(".popup_type_image");
const closePhotoButton = imgPopup.querySelector(".popup__close");
const zoomedPopupImage = imgPopup.querySelector(".popup__image");
const imgPopupCaption = imgPopup.querySelector(".popup__caption");

closePhotoButton.addEventListener("click", () => {
  closeModal(imgPopup);
});

// показ увеличенных картинок
function showImgPopup(evt) {
  zoomedPopupImage.src = evt.target.src;
  zoomedPopupImage.alt = evt.target.alt;
  imgPopupCaption.textContent = evt.target.alt;
  openModal(imgPopup);
}

// плавное открытие картинок
const modalsAll = document.querySelectorAll(".popup");
modalsAll.forEach((elem) => {
  elem.classList.add("popup_is-animated");
});
