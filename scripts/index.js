const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".places__list");

function createCard(cardData, cardDeleteCallback) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardDeleteButton.addEventListener("click", () =>
    cardDeleteCallback(cardElement)
  );
  return cardElement;
}

function deleteCard(currentCard) {
  currentCard.remove();
}

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard);
  cardList.append(cardElement);
});
