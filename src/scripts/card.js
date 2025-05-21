// создать карточку
export function createCard({
  currentUserId,
  cardInfo,
  deleteCard,
  likeCard,
  showImgPopup,
}) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");
  cardTitle.textContent = cardInfo.name;
  cardImage.src = cardInfo.link;
  cardImage.alt = cardInfo.name;

  // проверка на удаление СВОЕЙ карточки
  if (cardInfo.owner["_id"] === currentUserId) {
    cardDeleteButton.classList.add("card__delete-button_is-active");
    cardDeleteButton.addEventListener("click", () => {
      deleteCard({
        cardId: cardInfo["_id"],
        cardElement,
        buttonElement: cardDeleteButton,
      });
    });
  }

  // открывание картинки
  cardImage.addEventListener("click", () =>
    showImgPopup({
      cardName: cardInfo.name,
      cardLink: cardInfo.link,
    })
  );

  // счетчик лайков
  if (cardInfo.likes.length) {
    likeCounter.classList.add("card__like-counter_is-active");
    likeCounter.textContent = cardInfo.likes.length;
  }

  // поставить лайк
  if (cardInfo.likes.find((element) => element["_id"] === currentUserId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }
  cardLikeButton.addEventListener("click", () => {
    likeCard({
      cardId: cardInfo["_id"],
      buttonElement: cardLikeButton,
      counterElement: likeCounter,
    });
  });
  return cardElement;
}
