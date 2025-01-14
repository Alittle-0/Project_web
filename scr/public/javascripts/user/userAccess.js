
function handleUser(result) {
  localStorage.setItem("token", result.AccessToken);
  localStorage.setItem("slug", result.slug);
  localStorage.setItem("userId", result._id);
  localStorage.setItem("admin", result.admin);
  // Make request to /user route with token in header
  fetch("/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then(() => {
      window.location.href = `/user/${localStorage.getItem("slug")}`;
    })
    .catch((err) => console.error(err));
}

async function Logout() {
  try {
    // Make a request to /user/userlogout with the AccessToken
    const response = await fetch("/user/userlogout", {
      method: "POST", // Use POST for logout if required by your backend
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${localStorage.getItem("token")}`,
        userId: `${localStorage.getItem("userId")}`,
      },
    });

    if (response.status == 200) {
      // Clear localStorage after a successful logout
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("slug");
      localStorage.removeItem("admin");
      localStorage.removeItem("userId");

      const userLink = document.getElementById("user-link");
      if (userLink) {
        userLink.remove();
      }

      window.location.href = "/login"; // Redirect to the login page or appropriate location
    } else {
      throw new Error("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during logout:", error); 
   }
}

async function Remove() {
  try {
    const response = await fetch(`/user/${localStorage.getItem("userId")}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${localStorage.getItem("token")}`,
        admin: `${localStorage.getItem("admin")}`,
      },
      body: JSON.stringify({ id: localStorage.getItem("userId") })
    });

    if (response.status == 200) {
      // Clear localStorage after a successful logout
      localStorage.clear();

      const userLink = document.getElementById("user-link");
      if (userLink) {
        userLink.remove();
      }
      alert("Successfully");
      location.replace = "/login"; // Redirect to the login page or appropriate location
    } else {
      throw new Error("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

async function UserDelete(data) {
  try {
    const response = await fetch(`/user/${localStorage.getItem("userId")}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${localStorage.getItem("token")}`,
        admin: `${localStorage.getItem("admin")}`,
      },
      body: JSON.stringify(data)});

      if (response.status == 200) {
        alert("Successfully");
      } else {
        throw new Error("Logout failed. Please try again.");
      }
  } catch (error){
    console.log(error)
  }
}


//API
document.addEventListener("DOMContentLoaded", () => {
  const access = localStorage.getItem('token');
  //const userId = localStorage.getItem("userId");
  const authLink = document.getElementById("auth-link");
  const user = document.getElementById("nav-control");
  //console.log(access);console.log(userId);
  if (access) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.addEventListener("click", (event) => {
      event.preventDefault();
      Logout();
    });

    const userLink = document.createElement("a");
    userLink.id = "user-link";
    userLink.href = `/user/${localStorage.getItem("slug")}`;
    userLink.textContent = localStorage.getItem("slug");
    user.appendChild(userLink);
  }

  else {
    authLink.textContent = "Login";
    authLink.href = "/login";
  }

})
