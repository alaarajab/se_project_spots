// utils/Api.js

class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "e3c0228b-2422-4a4f-96fe-9e9c799fd017",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
