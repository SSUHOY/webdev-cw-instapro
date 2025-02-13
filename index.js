import { addPost, getPosts, getUserPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { renderUserPostsPageComponent } from "./components/user-posts-page-component.js";

const appEl = document.getElementById("app");

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    // Показываем загрузочный элемент при загрузке постов 

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      // Рендер приложения с полученными постами
      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }
    // Получение постов конкретного user'а

    if (newPage === USER_POSTS_PAGE) {
      // TODO: реализовать получение постов юзера из API
      page = LOADING_PAGE;
      renderApp();
      return getUserPosts({ token: getToken(), id: data.userId }).then((newPosts) => {
        page = USER_POSTS_PAGE;
        posts = newPosts;
        console.log(posts);
        renderApp();
      }).catch((error) => {
        console.log(error);
        goToPage(USER_POSTS_PAGE);
      });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error('Такой страницы не существует')
};

export const renderApp = () => {
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // TODO: реализовать добавление поста в API
        addPost({token: getToken(), description, imageUrl})
        console.log("Добавляю пост...", { description, imageUrl });
        goToPage(POSTS_PAGE);
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      posts,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографий пользвателя
    // appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    return renderUserPostsPageComponent({appEl});
  }
};

goToPage(POSTS_PAGE);