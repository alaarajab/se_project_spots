import "./index.css";
import logoSrc from "../images/logo.svg";
const logoImage = document.getElementById("image-logo");
logoImage.src = logoSrc;
import avaterSrc from "../images/avatar.jpg";
const avatarImage = document.getElementById("image-avatar");
avatarImage.src = avaterSrc;

import pencilSrc from "../images/pencil.svg";
const pencilImage = document.getElementById("image-pencil");
pencilImage.src = pencilSrc;
import plusSrc from "../images/plus.svg";
const plusImage = document.getElementById("image-plus");
plusImage.src = plusSrc;
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e3c0228b-2422-4a4f-96fe-9e9c799fd017",
    "Content-Type": "application/json",
  },
});

// Initial fetch for cards + user
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

//profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
//form elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");
const editModalCloseBtn = editProfileModal.querySelector(".modal__close");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const previewModal = document.querySelector("#preview-modal");
const previewModelImageEl = previewModal.querySelector(".modal__image");
const previewModelIcaptionEl = previewModal.querySelector(".modal__caption");
const previewModelCloseButton = previewModal.querySelector(
  ".modal__close_type_preview"
);
//card related elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseButton = cardModal.querySelector(".modal__close");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
//Avatar elements
const avatarModal = document.querySelector("#update-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

//delete modol
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form-del");
const deletModalCloseButton = deleteModal.querySelector(".modal__close-del");
const deletingBtn = deleteModal.querySelector(".modal__delete-btn");
const cancelBtn = deleteModal.querySelector(".modal__cancel-btn");

let selectedCard, selectedCardId;
function handelDeleteSubmit(e) {
  e.preventDefault();
  const submitBtn = e.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handelDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handelLike(e, id) {
  const likeButton = e.target;
  const isLiked = likeButton.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(id, !isLiked)
    .then(() => {
      likeButton.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardDeleteBtn.addEventListener("click", () =>
    handelDeleteCard(cardElement, data._id)
  );

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", (e) => {
    /*const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");*/
    handelLike(e, data._id);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModelImageEl.src = data.link;
    previewModelImageEl.alt = data.name;
    previewModelIcaptionEl.textContent = data.name;
  });

  return cardElement;
}

previewModelCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", closeModalOnOverlayClick);
  document.addEventListener("keydown", closeModalOnEscape);
}
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("mousedown", closeModalOnOverlayClick);
  document.removeEventListener("keydown", closeModalOnEscape);
}

function handleEditFormSubmit(e) {
  e.preventDefault();

  const submitBtn = e.submitter;

  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

function handleAddCardSubmit(e) {
  e.preventDefault();
  const submitBtn = e.submitter;

  setButtonText(submitBtn, true, "Save", "Saving...");
  api
    .addNewCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((data) => {
      const cardEl = getCardElement(data); // Assumes getCardElement handles API response shape
      cardsList.prepend(cardEl);
      cardNameInput.value = "";
      cardLinkInput.value = "";
      disableButton(cardSubmitBtn, validationConfig);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

function handleAvatarSubmit(e) {
  e.preventDefault();
  const avatarUrl = avatarLinkInput.value.trim();
  const submitBtn = e.submitter;

  /*if (!avatarUrl) {
    console.error("Avatar URL is empty.");
    return;
  }

  console.log("Submitting avatar URL:", avatarUrl);*/

  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .updateAvatarInfo(avatarUrl)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });

  avatarLinkInput.value = "";
  disableButton(avatarSubmitBtn, validationConfig);
}

cancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deletingBtn.addEventListener("click", () => {
  // closeModal(deleteModal);
  //openModal(deleteModal);
  //cardElement.remove();
});

deletModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handelDeleteSubmit);

cardForm.addEventListener("submit", handleAddCardSubmit);

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  resetValidation(editFormElement, validationConfig);
  openModal(editProfileModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => {
  resetValidation(cardForm, validationConfig);

  openModal(cardModal);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(validationConfig);

avatarModalButton.addEventListener("click", () => {
  resetValidation(avatarForm, validationConfig);

  openModal(avatarModal);
});
avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

function closeModalOnOverlayClick(e) {
  if (e.target.classList.contains("modal_opened")) {
    closeModal(e.target);
  }
}
function closeModalOnEscape(e) {
  if (e.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}
