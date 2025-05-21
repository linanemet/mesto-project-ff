const CONFIG = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-38",
  headers: {
    authorization: "a17194ab-a5ce-442a-8955-5ddc748d94f0",
    "Content-Type": "application/json",
  },
};

// обработка ответа от сервера
const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// загрузка карточки с сервера
export const getInitialCards = () => {
  return fetch(`${CONFIG.baseUrl}/cards`, { headers: CONFIG.headers }).then(
    handleResponse
  );
};

// создание карточки на сервере
export const createCard = ({ name, link }) => {
  return checkImageUrl(link).then(() =>
    fetch(`${CONFIG.baseUrl}/cards`, {
      headers: CONFIG.headers,
      method: "POST",
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(handleResponse)
  );
};

// удаление карточки с сервера
export const deleteCard = (cardId) => {
  return fetch(`${CONFIG.baseUrl}/cards/${cardId}`, {
    headers: CONFIG.headers,
    method: "DELETE",
  }).then(handleResponse);
};

// получение инфо о текущем пользователе (о себе)
export const getUserInfo = () => {
  return fetch(`${CONFIG.baseUrl}/users/me`, { headers: CONFIG.headers }).then(
    handleResponse
  );
};

// обновлении инфо о пользователе
export const updateUserInfo = ({ name, description }) => {
  return fetch(`${CONFIG.baseUrl}/users/me`, {
    headers: CONFIG.headers,
    method: "PATCH",
    body: JSON.stringify({
      name,
      about: description,
    }),
  }).then(handleResponse);
};

// лайк
export const likeCard = (cardId) => {
  return fetch(`${CONFIG.baseUrl}/cards/likes/${cardId}`, {
    headers: CONFIG.headers,
    method: "PUT",
  }).then(handleResponse);
};

// отмена лайка
export const unLikeCard = (cardId) => {
  return fetch(`${CONFIG.baseUrl}/cards/likes/${cardId}`, {
    headers: CONFIG.headers,
    method: "DELETE",
  }).then(handleResponse);
};

// проверка на изображение
const checkImageUrl = (url) => {
  return fetch(url, {
    method: "HEAD",
  }).then(({ ok, headers, status }) => {
    if (ok) {
      if (headers.get("Content-Type").includes("image")) {
        return Promise.resolve();
      }

      return Promise.reject("Ошибка: URL ссылается на не изображение");
    }

    return Promise.reject(`Ошибка: ${status}`);
  });
};

// обновление аватара
export const updateUserAvatar = (url) => {
  return checkImageUrl(url).then(() =>
    fetch(`${CONFIG.baseUrl}/users/me/avatar`, {
      headers: CONFIG.headers,
      method: "PATCH",
      body: JSON.stringify({
        avatar: url,
      }),
    }).then(handleResponse)
  );
};
