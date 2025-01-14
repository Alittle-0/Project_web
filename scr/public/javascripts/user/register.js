//Create successfully
async function Creation(data) {
    try {
      const response = await fetch("/userstore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (response.status === 400) {
        document.getElementById("email-error").textContent = response.message;
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.status === 200) {
        alert("Successfully! Now please log in");
        location.replace("/login")
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //Create successfully
async function Creation(data) {
  try {
    const response = await fetch("/userstore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (response.status === 200) {
      alert("Successfully! Now please log in");
      location.replace("/login")
    } else {
      const result = await response.json();
      console.log(result);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}