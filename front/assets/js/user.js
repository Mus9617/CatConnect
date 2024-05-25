let image = document.querySelector('#avatar')

async function showavatar() {

    let token = localStorage.getItem('token');
    let apiRequest = await fetch('http://localhost:3000/users/getallusers', {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    });
    let response = await apiRequest.json();
    let avatar = document.querySelector('#avatar'); 


    response.forEach(test =>{
        
        avatar.innerHTML += `
        <img src="http://localhost:3000/${test.avatar}" class="sigma" alt="UserAvatarCatConnect">
        `;
    }

    )


}

showavatar()





async function showusername() {
    const role = localStorage.getItem('role');
    let token = localStorage.getItem('token');
    let apiRequest = await fetch('http://localhost:3000/users/getallusers', {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    });
    let response = await apiRequest.json();
    let username = document.querySelector('#username');

    response.forEach(element => {
       
        username.innerHTML += `
        <p>${element.username}</p>
        <div class="admin">
         ${role ==='admin'?`<a href="../../admin/adminPanel.html">Admin&#128062</a>`:``}
        </div>`;
    });
}
showusername()



/**
 * Fetches and displays the user's posts.
 * @async
 * @function showMyPosts
 * @returns {Promise<void>} A Promise that resolves when the posts are displayed.
 */
async function showMyPosts() {
    let token = localStorage.getItem('token');
    let apiRequest = await fetch('http://localhost:3000/users/getmyposts', {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    });
    let response = await apiRequest.json();
    console.log(response)
    let myposts = document.querySelector('#lastposts');

    response.forEach(elemento => {
       
        myposts.innerHTML += `
            <div class="cardd">

                <h3>${elemento.title}</h3>

                <p>${elemento.description}</p>

                <img src="${elemento.image}" alt="PostImage" width="100" height="100">
            
            
            
            </div>
        `;
    });
}

showMyPosts()


async function logout() {
    localStorage.removeItem('token');
    window.location.href = '../view/login.html';
}