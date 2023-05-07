// импорт модулей

// "боевая" версия инстапро лежит в ключе prod
// Замени на свой, чтобы получить независимый от других набор данных.
const personalKey = "prod";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;
// GET списка комментов URL с моим ключом: https://webdev-hw-api.vercel.app/api/v1/sam-sukhoi/instapro

// GET списка из кода Анны
// export function getPosts({ token }) {
//   return fetch(postsHost, {
//     method: "GET",
//     headers: {
//       Authorization: token,
//     },
//   })
//     .then((response) => {
//       if (response.status === 401) {
//         throw new Error("Нет авторизации");
//       }

//       return response.json();
//     }).then((responseData) => {
//       const formatPosts = responseData.posts.map((post) => {
//         return {
//           id: post.id,
//           imageUrl: post.imageUrl,
//           createdAt: new Date().toLocaleString().slice(0, -3),
//           name: post.user.name,
//           description: post.description,
//           likes: post.likes,
//           isLiked: false,
//         };
//       })
//       // получили данные и рендер их в приложении
//       return formatPosts;
//     })
// }
export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}



// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// получаем посты конкретного пользователя
export function getUserPosts({ token, id }) {
  return fetch(postsHost +"/user-posts/" + id, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
