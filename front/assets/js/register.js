

/**
 * Registers a user by sending a POST request to the server.
 * @async
 */
async function register() {

    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const image = document.querySelector('#image')

    const formData = new FormData();

    formData.append('image', image.files[0])
  
    const response = await fetch("http://localhost:3000/users/insert-avatar", {
      method: "POST",
     
      body: formData,
    })
    if (response.status === 200) {
        console.log(response.status)
    let data = await response.json()
      let uploadedImage = data.newFileName
      


let user = {
    image: uploadedImage,
    username: username,
    email: email,
    password: password

   
};

try {
    const response = await fetch("http://localhost:3000/users/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });


    const data = await response.json();
    

    if (response.ok) {
      
       window.location.href = '../view/login.html';
    } else {
        alert(data.message);
    }
} catch (error) {
    console.error('Error at Registration:', error);
    alert('Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente más tarde.');
}
}


}
