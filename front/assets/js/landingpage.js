/**
 * Fetches all posts from the server and displays them on the webpage.
 * @returns {Promise<void>} A promise that resolves when the posts are fetched and displayed.
 */
async function getallposts() {
  
     let token = localStorage.getItem('token');
     let apiRequest = await fetch('http://localhost:3000/users/allposts', {
         headers: {
           
             'Authorization': `Bearer ${token}` 
         }
     });
     let response = await apiRequest.json();
     let posts = document.querySelector('#cardpost');
 
     response.forEach(tete => {
 
         posts.innerHTML += `

         <div class="cardi">
         
              
           <ul>
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

              comments: ${tete.comments}
              </p>
              </li>


             <textarea id="comment" placeholder="Comment here">
             
             
             </textarea>
             <button onclick="commentPost('${tete._id}')">Comment</button>
             <button onclick="likepost('${tete._id}')"  height="300px" width="300px" >Like</button>
             <button onclick="DeletePost('${tete._id}')"height="300px" width="300px" >Delete</button>
           </ul>


           Next ONE &#128073;


        </div> `;
       })
     }

getallposts()



  async function DeletePost(id) { 
    
    let token = localStorage.getItem('token');
    let apiRequest = await fetch(`http://localhost:3000/users/delete-post/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
    });

    if (apiRequest.status === 200) {
        alert('Post deleted');
        window.location.reload();
    }

    else {  
        alert('Failed to delete post');
    }
}


async function likepost(id) {
  let token = localStorage.getItem('token');
  let apiRequest = await fetch(`http://localhost:3000/users/likes/${id}`, {
      method: 'PATCH',
      headers: {
                  
             'Authorization': `Bearer ${token}` 
            }
        });

      if (apiRequest.status === 200) {
          alert('Liked post');
          window.location.reload();
      }

      else {
          alert('Failed to like post');
      }

}



async function commentPost(id) {
  let token = localStorage.getItem('token');
  let apiRequest = await fetch(`http://localhost:3000/users/comments/${id}`, {
      method: 'PATCH',
      headers: {
                  
             'Authorization': `Bearer ${token}` 
            }
        });

      if (apiRequest.status === 200) {
          alert('Posted comment');
          window.location.reload();
      }

      else {
          alert('Failed to post comment');
      }

}



async function searchbyUsername(){
    const search = document.querySelector('#search').value
    let apiRequest = await fetch(`http://localhost:3000/users/getUsers`)
    let response = await apiRequest.json()
    response.forEach(cardpost => {
    
        search.innerHTML +=`
        
        <p>1: ${cardpost.username}</p>
        <img src="${cardpost.image}" alt="image" width="100" height="100">
        `
    })
}

async function logout() {
  localStorage.removeItem('token');
  window.location.href = '../view/login.html';
}


async function useridfind() {
  let token = localStorage.getItem('token');
  console.log();
  let apiRequest = await fetch('http://localhost:3000/users/useridfind', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }

      
  });

   
  if (apiRequest.status === 200) {
      alert('Found user');
      window.location.reload();
  } else {
      alert('Failed to find user');
  }
}
