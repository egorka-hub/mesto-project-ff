import { addCard }   from './api';

export function addCardDeleteButton(card, data, deleteFn) {
  if (data.owner._id === window.userId) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'card__delete-button';
    card.appendChild(deleteButton);

    deleteButton.onclick = () => {
      deleteFn(data._id);
    };
  }
}

export function isHasLike(card) {
  const userId = window.userId;
  return !!card.likes.find(it => it._id === userId);
}

export async function createCard(data, addStartItem) {
  await addCard(data).then((res) => res && addStartItem(res)).catch(e => console.error(`Ошибка при выполнении запроса: ${e}`));
}
