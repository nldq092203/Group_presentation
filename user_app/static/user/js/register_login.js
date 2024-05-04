const csrftoken = document.querySelector("[name=csrf-token]").content;

// Select the form
let form_login = document.querySelectorAll(".form-login");
// let btn_login = document.querySelector('.btn_login');
// Add an event listener for the 'submit' event
if (form_login) {
  form_login.forEach((item) => {
    item.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get the username and password
      let username = item.querySelector('input[name="username"]').value;
      let password = item.querySelector('input[name="password"]').value;
      console.log(username, password);

      // Prepare the content object
      let content = {
        username: username,
        password: password,
      };
      console.log(csrftoken);
      console.log(content);
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(content),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data here
          if (data.status == "success") {
            if (data.user_role == "ADM")
              window.location.href = "/admin/";
            else
              window.location.href = "/";
          } else if (data.status == "failure") {
            console.log(data.message);
            let error = item.parentElement.querySelector(".error");
            error.innerText = data.message;
          }
        });
    });
  });
}

let form_register = document.querySelector(".form-register");
if (form_register) {
  form_register.addEventListener("submit", function (event) {
    event.preventDefault();
    let username = form_register.querySelector('input[name="username"]').value;
    let email = form_register.querySelector('input[name="email"]').value;
    let password = form_register.querySelector('input[name="password"]').value;
    let confirmation = form_register.querySelector(
      'input[name="confirmation"]'
    ).value;

    let content = {
      username: username,
      email: email,
      password: password,
      confirmation: confirmation,
    };

    console.log(csrftoken);
    console.log(content);

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(content),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        if (data.status == "success") {
          window.location.href = "/";
          console.log(data);
        } else if (data.status == "failure") {
          let error = form_register.parentElement.querySelector(".error");
          error.innerText = data.message;
          console.log(data);
        }
      });
  });
}
