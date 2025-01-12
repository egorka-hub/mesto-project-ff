const headers = {
  authorization : '495013f3-2775-4e45-baff-085b9b3147e9',
  'Content-Type': 'application/json'
}

const baseUrl = 'https://nomoreparties.co/v1/cohort-mag-4';

async function api(url, method, body) {
  return fetch(`${baseUrl}${url}`, {method, body: JSON.stringify(body), headers}).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(res.status);
    }
  });
}

export async function getUser() {
  return await api('/users/me', 'GET');
}

// fields: name, about
export async function updateUser(data) {
  return await api('/users/me', 'PATCH', data);
}

// fields: avatar
export async function updateAvatar(link) {
  return await api('/users/me/avatar', 'PATCH', {avatar: link});
}

export async function getCards() {
  return await api('/cards', 'GET');
}

// fields: name, link
export async function addCard(data) {
  return await api('/cards', 'POST', data);
}

export async function deleteCard(cardId) {
  return await api(`/cards/${cardId}`, 'DELETE');
}

export async function addLike(cardId) {
  return await api(`/cards/likes/${cardId}`, 'PUT');
}

export async function removeLike(cardId) {
  return await api(`/cards/likes/${cardId}`, 'DELETE');
}
