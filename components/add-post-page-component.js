import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { getToken } from "../index.js";
import { addPost } from "../api.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick, getToken }) {
  const render = () => {
    let imageUrl = '';
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
      <div class='page-header'>
      <h1 class='logo'>instapro</h1>
      <button class='header-button logout-button'>Выйти</button>
      </div>
      </div>

      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
  <div class="upload=image">
      
            <label class="file-upload-label secondary-button">
                <input type="file" class="file-upload-input" style="display:none">
                Выберите фото
            </label>
            </div>
      </div>
      <label>
            Опишите фотографию:
            <textarea class="input textarea" rows="4" value='4'></textarea>
            </label>
            <div class='form-error'></div>
            <button class="button" id="add-button">Добавить</button>
        </div>    
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Иницилизация ошибки при не выбранных (фото / описания)
    const setError = (message) => {
      appEl.querySelector('.form-error').textContent = message;
    };

    const uploadImageContainer = appEl.querySelector('.upload-image-container');

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector('.upload-image-container'),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      console.log('Кнопка работает');
      setError('');

      const description = document.querySelector('.textarea').value;
      console.log(description);
      if (!imageUrl) {
        setError('Не выбрана фотография')
      }
      if (description === '') {
        setError('Добавьте описание к фото');
        return;
      }

      onAddPostClick({
        description: description,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
