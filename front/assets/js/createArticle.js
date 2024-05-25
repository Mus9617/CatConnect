/**
 * Creates a new post by sending a POST request to the server.
 * @async
 */
async function createPost() {
    
    let title = document.querySelector('#title').value
    let description = document.querySelector('#description').value
    let image= document.querySelector('#image').value
    let jwt = window.localStorage.getItem('token')
    
    let annonce = {
        title: title,
        description: description,
        image: image,
    }

    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(annonce),
    }

    let apiRequest = fetch('http://localhost:3000/users/create-post', request)
    let response = await apiRequest
   
    if (response.status === 200) {
        
        window.location.href = '../view/landingPage.html'
    }
}


async function logout() {
    localStorage.removeItem('token');
    window.location.href = '../view/login.html';
  }
  