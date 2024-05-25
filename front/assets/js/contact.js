


/**
 * Sends an email using the provided name, email, and message.
 * @async
 * @function sendEmail
 */
async function sendEmail() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log(name, email, message);

    const data = {
        name,
        email,
        message,
       
    };

    try {
        const response = await fetch('http://localhost:3000/users/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result);

        
            alert('Email Sent');
       
    } catch (error) {
        console.log(error);
    }
}

async function logout() {
    localStorage.removeItem('token');
    window.location.href = '../view/login.html';
  }