//Login successfully
async function handleFormSubmit(data) {
    try {
      const response = await fetch("/userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Clear previous error messages
      document.getElementById("email-error").textContent = "";
      document.getElementById("password-error").textContent = "";
  
      const result = await response.json();
  
      //Wrong data
      if (response.status == 400) {
        if (result.message.includes("email")) {
          document.getElementById("email-error").textContent =
            result.message;
        } else if (result.message.includes("password")) {
          document.getElementById("password-error").textContent =
            result.message;
        }
      }
  
      //Successfully
      if (response.status === 200) {
        alert("Successfully");
        handleUser(result);//API
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
}