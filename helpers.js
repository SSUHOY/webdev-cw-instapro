import { getToken } from "./index.js";


export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

// Инициализация кнопки лайка
export function initLikeButtons(posts, user, addLike, removeLike) {
  const likeButtonElement = document.querySelectorAll('.like-button');



  likeButtonElement.forEach((button, index) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const postId = button.dataset.postId;
      const post = posts.find((post) => post.id === postId)
      post.isLiked = !post.isLiked;
      const userIndex = post.likes.findIndex((like) => like.name === user.name);

      if (post.isLiked) {
        if (userIndex === -1) {
          post.likes.push({ name: user.name })
        }
        else {
          if (userIndex !== -1) {
            post.likes.splice(userIndex, 1)
          }

          let likedUserNames = post.likes.map(like => like.name)
          console.log(likedUserNames);
          // html с новыми данными
          const likeCountElement = button.parentNode.querySelector('.post-likes-text');
          likeCountElement.innerHTML =
            ` Нравится: <strong>${likedUserNames ? likedUserNames[0] : 0} </strong>
      ${likedUserNames.length > 1 ? `и <strong>еще ${likedUserNames.length - 1}</strong>` : ''}`;

          // Изменить путь к svg лайка

          const likeImgElement = button.querySelector('img');
          likeImgElement.src = `./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}`;

          if (post.isLiked) {
            //добавляем лайк
            addLike({ token: getToken(), id: postId });
          } else {
            //удаляем лайк
            delLike({ token: getToken(), id: postId })
          }
        }
      }
    })
  })
}

