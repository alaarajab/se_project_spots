
# 🟣 Spots

An interactive social media web application where users can add and remove photos, like others’ photos, and update their profile information. The project emphasizes responsive design, API integration, and clean modular code architecture.

**🌍 Overview**

-Spots is designed to display all elements correctly across popular screen sizes, ensuring an engaging and seamless experience for all users. 
-This project builds upon earlier stages by connecting the front end to a remote database via an API, allowing user data and actions (such as adding cards or editing profiles) to persist after page reloads.



**🧠 Project Description**

Users can:

-View and interact with shared photos.

-Add new photos (cards) and delete their own.

-Like or unlike photos shared by others.

-Update their profile information and avatar.

-Enjoy a responsive layout optimized for mobile and desktop.

-This project focuses on making API requests and handling responses while maintaining a modular, maintainable codebase.

**⚙️ Tech Stack**

-Frontend: HTML, CSS, JavaScript (ES6+), Responsive Design
-Architecture: JavaScript Modules, Webpack
-API & Backend: RESTful API, Token-based Authentication
-Tools: Git, GitHub, Figma

**🧩 Key Features**

- Responsive Design: Works seamlessly on all major screen sizes.

Dynamic Card System: Add, delete, and like photos in real time.

Profile Management: Update user details and avatars directly via API.

API Integration: Persistent data using fetch() requests with authentication tokens.

Error Handling: Catch and log failed API requests gracefully.

Enhanced UX: Form feedback such as “Saving…” or “Deleting…” improves interactivity.

**Images**

![Image](https://github.com/user-attachments/assets/71eafb0c-5023-44e1-9e49-88d9ed97cd17)

![Image](https://github.com/user-attachments/assets/f6c82f02-de36-413a-8342-3400f267edf1)

**🧱 API Implementation**

All API requests are encapsulated within an Api class for cleaner structure and reusability.

// utils/Api.js

class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, { headers: this._headers }).then(this._checkResponse);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, { headers: this._headers }).then(this._checkResponse);
  }

  editUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }

  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  updateAvatar(link) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar: link }),
    }).then(this._checkResponse);
  }
}

export default Api;

**🔐 Authentication**

I got my personal token for authentication.
Get yours by visiting:
👉 https://around-api.en.tripleten-services.com/v1/users/create

Each request must include my token in the headers:

headers: {
  authorization: "my-personal-token-here",
  "Content-Type": "application/json"
}

**🚀 Deployment**

This project is deployed on GitHub Pages.
🔗 - [Link to the project on GitHub](https://alaarajab.github.io/se_project_spots/)
🔗- [Link to the project on Figm](https://www.figma.com/file/BBNm2bC3lj8QQMHlnqRsga/Sprint-3-Project-%E2%80%94-Spots?type=design&node-id=2%3A60&mode=design&t=afgNFybdorZO6cQo-1)
🎥- [Link to my project video on YouTube](https://www.youtube.com/watch?v=AL69avzPpgM)

**📈 Future Enhancements**

-Add user authentication and registration.

-Implement real-time updates using WebSockets.

-Improve accessibility and dark mode support.
