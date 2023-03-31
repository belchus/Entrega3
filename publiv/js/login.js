async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    updateUser()
  
    async function updateUser() {
      const url = "/login"
      const payload = {
          email: email,
          password: password,
      }
      const options = {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
      }
      await fetch(url, options)
          .then(response => console.log(response.status))
          .catch((err) => console.log(err)) 
  }
  }