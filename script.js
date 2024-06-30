let userListVisible = false; // Track if user list is currently visible

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const successMessage = document.getElementById("successMessage");

    if (!name || !email) {
      alert("Please fill out both fields.");
    } else if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
    } else {
      fetch("http://localhost:8080/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })
        .then((response) => response.json())
        .then((data) => {
          successMessage.textContent = data.message;
          successMessage.classList.remove("hidden");
          successMessage.style.display = "block";
          document.getElementById("contact-form").reset();

          // Hide the success message after 3 seconds
          setTimeout(() => {
            successMessage.style.display = "none";
          }, 5000);
        })
        .catch((error) => console.error("Error:", error));
    }
  });

document.getElementById("getUsers").addEventListener("click", function () {
  const userList = document.getElementById("userList");

  if (!userListVisible) {
    fetch("http://localhost:8080/users")
      .then((response) => response.json())
      .then((data) => {
        userList.innerHTML = "";
        if (data.length === 0) {
          userList.textContent = "No users created or added.";
        } else {
          data.forEach((user) => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user-entry");

            const userName = document.createElement("span");
            userName.classList.add("user-name");
            userName.textContent = `Name: ${user.name}`;

            const userEmail = document.createElement("span");
            userEmail.classList.add("user-email");
            userEmail.textContent = `Email: ${user.email}`;

            userDiv.appendChild(userName);
            userDiv.appendChild(document.createElement("br")); // Line break between name and email
            userDiv.appendChild(userEmail);

            userList.appendChild(userDiv);
          });
        }
        userList.classList.remove("hidden");
        userList.style.display = "block";
        userListVisible = true; // Set user list as visible
      })
      .catch((error) => console.error("Error:", error));
  } else {
    userList.innerHTML = ""; // Clear the user list
    userList.classList.add("hidden");
    userListVisible = false; // Set user list as hidden
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
