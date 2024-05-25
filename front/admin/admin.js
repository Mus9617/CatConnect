


async function getallusers() {

  let token = localStorage.getItem('token');
  let apiRequest = await fetch('http://localhost:3000/users/allusers', {
      headers: {
          'Authorization': `Bearer ${token}` 
      }
  });
  let response = await apiRequest.json();
  let avatar = document.querySelector('#shows');


  response.forEach(show => {
      console.log(show);
    avatar.innerHTML += `
      <ul>
        <li>
          <p> UserName: ${show.username} 
          </p>
        </li>
        <li>
          <p> 
            Email: ${show.email}
          </p>
        </li>
        <li>
        <p> 
          Verified: ${show.email_verified}
        </p>
      </li>

      <button onclick="DesactiveUser('${show.uuid}')">Delete User</button>

      </ul>
      Next ONE &#128073;
    `;
  });

}


getallusers()



/**
 * Fetches all posts from the server and displays them on the page.
 * @returns {Promise<void>} A Promise that resolves when the posts are fetched and displayed.
 */
async function getallposts() {
  
    let token = localStorage.getItem('token');
    let apiRequest = await fetch('http://localhost:3000/users/allposts', {
        headers: {
          
            'Authorization': `Bearer ${token}` 
        }
    });
    let response = await apiRequest.json();
    let post = document.querySelector('#allpubli');

    response.forEach(tete => {

        post.innerHTML += `
          <ul>
          <li>
          <p> user ID: ${tete._id} 
          </p>
        </li>
            <li>
              <p> Title: ${tete.title} 
              </p>
            </li>
            <li>
              <p> 
                Description: ${tete.description}
              </p>
            </li>
            <li>
            
            <p>
            
            Image: <img src="${tete.image}" alt="image" width="100" height="100">
            
            <p>
            
            
            </li>

            <li>
            <p> 
              likes: ${tete.likes}
            </p>
          </li>
          <li>
          <p> 
            comments: ${tete.comments}
          </p>
        </li>
          </ul>
          Next ONE &#128073;
        `;
      })
    }
getallposts()

async function DesactiveUser(uuid) {
  let token = localStorage.getItem('token');
  let apiRequest = await fetch(`http://localhost:3000/users/changestatus/${uuid}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}` 
      }
  });
  let response = await apiRequest.json();
  console.log(response);
  alert('User Deleted');
  location.reload();
}

