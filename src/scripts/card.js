// создать карточку
export function createCard(
  cardData,
  cardDeleteCallback,
  likeCard,
  showImgPopup
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardDeleteButton.addEventListener("click", () =>
    cardDeleteCallback(cardElement)
  );

  cardLikeButton.addEventListener("click", likeCard);

  cardImage.addEventListener("click", () => showImgPopup(cardData));

  return cardElement;
}

// удаление карточки
export function deleteCard(currentCard) {
  currentCard.remove();
}
// лайк на карточку
export function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}
