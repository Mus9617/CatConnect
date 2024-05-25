const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuid, parse } = require('uuid')
const { pool } = require('../db/dbconfig')
const { transporter } = require('../../ouils/mailer')
// const { transporter } = require('../');
const nodemailer = require('nodemailer')
const { UUID } = require('mongodb')
require('dotenv').config()
const { Annonce } = require('../model/Annonce')
const { extractToken } = require('../../ouils/jwt')
const { ObjectId } = require('bson')
const { client } = require('../db/dbconfigMongodb')

/// multer

const express = require('express')
const path = require('path')
const multer = require('multer');

const app = express()
const uploadDirectory = path.join(__dirname, '../public/upload')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//insertion d'image dans la base de donnée avec multer
const insertAvatarPicture = async (req, res) => {
    let newFileName
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDirectory)
      },
      filename: function (req, file, cb) {
        newFileName = `${file.fieldname}-${Date.now()}.jpg`
        cb(null, newFileName)
      },
    })
  
    const maxSize = 3 * 1000 * 1000
  
    let upload = multer({
      storage: storage,
      limits: { fileSize: maxSize },
      fileFilter: function (req, file, cb) {
        var filetypes = /jpeg|jpg|png/
        var mimetype = filetypes.test(file.mimetype)
  
        var extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
        )
  
        if (mimetype && extname) {
          return cb(null, true)
        }
  
        cb(
          'Error: File upload only supports the ' +
            'following filetypes - ' +
            filetypes
        )
      },
    }).single('image')
  
    upload(req, res, function (err) {
      if (err) {
        res.send(err)
      } else {
        res.send({ newFileName: newFileName })
      }
    })
  }



function checkEmailFormat(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkUsernameFormat(username) {
    const usernameRegex = /^[A-Za-z0-9]+$/;
    return usernameRegex.test(username);
}

async function doesEmailUsed(email) {
    const result = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
    const users = result[0]
    if (users.length !== 0) {
        return true
    }
    return false
}

/**
 * Register a new user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function register(req, res) {

    const body = req.body    //TODO Verify input data
    console.log(body);
    // if (!body.email || !body.password || !body.image || !body.username) {
        if (!body.email || !body.password || !body.image || !body.username)  {
        //Return message error data invalid ERR:400
        return res.status(200).json({ message: "Input data invalid" })
    }
    //email
    const email = body.email
    if (!checkEmailFormat(email)) {
        //Email invalid
        return res.status(400).json({ message: 'Email format invalid' })
    }
    const username = body.username
    if (!checkUsernameFormat(username)) {
        return res.status(400).json({ message: "Username should be a-A/0-9" })
    }
    if (username.length > 16 || username.length < 4) {
        return res.status(400).json({ message: "Username should be between 4 and 16 characters long" })
    }

    const password = body.password
    if (password.length < 6) {
        return res.status(400).json({ message: "Password should be at least 6 chartacter long" })
    }

    const image = body.image

    //Verify if email already used
    if (!doesEmailUsed(email)) {
        return res.status(403).json({ message: "The Email is alrady in use" })
    }
    const UUID = uuid()
    const hashedPassword = await bcrypt.hash(password, 10)
    const insertionResult = await pool.execute(
        ' INSERT INTO users (username, email, hash, UUID, image ) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, UUID, image]
    )
    console.log(insertionResult);
    if (insertionResult[0].affectedRows === 1) {
        const secret = process.env['MY_SUPER_SECRET_KEY']

        if (!secret) {
            throw new Error('JWT_SECRET is not defined')
        }
        const token = jwt.sign({ email }, Buffer.from(secret), {
            expiresIn: '1d',
        })

        const link = `${process.env.BASE_URL}/users/verify-email?token=${token}`
        console.log(process.env.BASE_URL)
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Verify your email',
            html: `Click <a href="${link}">ICI</a> Pour verifie votre email.`,
        })
        res.status(201).json({ message: 'User created' })
    } 

    // setTimeout(() => {
    //     window.location.href = '../../../front/assets/view/login.html';
    // }, 10000);
}



/**
 * Verify user email.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function verifyEmail(req, res) {
    const { token } = req.query
    try {
        const { email } = jwt.verify(token, process.env['MY_SUPER_SECRET_KEY'])
        const result = await pool.execute(
            'UPDATE users SET email_verified = 1 WHERE email = ?',
            [email]
        )
        const status = result[0]
        console.log(status.affectedRows)
        if (status.affectedRows === 1) {
            // return res.status(200).json({ message: 'Email verified' })
           return res.redirect("http://127.0.0.1:5500/assets/view/login.html")

        } else {
            res.status(404).json({ message: 'Email not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/**
 * Login user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function login(req, res) {
    const body = req.body
    const data = {
        email: body.email,
        password: body.password,
    }
    try {
        const dbResult = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [data.email]
        )
        const users = dbResult[0]
        if (users.length !== 1) {

            return res.status(404).json({ message: 'User Not Found' })
        }
        // The target user
        const userData = users[0]

        // Does password match
        const isPasswordMatch = await bcrypt.compare(data.password, userData.hash);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        // JWT Token
        const token = await jwt.sign({
            sub: userData.UUID,
            email: userData.email
        }, process.env["MY_SUPER_SECRET_KEY"], {
            expiresIn: "21d"
        })
        // All fine give the token
        return res.status(201).json({
            token: token,
            role: userData.role
        })
    } catch (error) {
        res.status(500).json({ message: 'An internal error ocurred' })
        console.log(`\n\n${error}`)

    }
}

/**
 * Handles the forgot password functionality.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the function is done.
 */
async function ForgotPassword(req, res) {
    const { email } = req.body
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )
        if (rows.length === 0) {
            res.status(404).json({ message: 'User dosent Exsist' })
        } else {
            const user = rows[0]
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '21d',
            })
            const link = `${process.env.BASE_URL}/users/reset-password?token=${token}`
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: 'Reinitialiser votre mot de passe',
                html: `Click <a href="${link}">ICI</a> pour reinitialiser votre mot de passe.`,
            })
            res.status(200).json({ message: 'Email send' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/**
 * Create a new post.
 * @param {Object} req - The request object.
 * @param {Object} response - The response object.
 * @returns {Promise<void>} - A promise that resolves when the post is created.
 */
const CreatePost = async (req, response) => {
    const token = await extractToken(req);

    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => {
            if (err) {

                console.log(err)
                res.status(401).json({ err: 'Unauthorized' })
                return
            } else {

                if (
                    !req.body.title ||
                    !req.body.description ||
                    !req.body.image
                    
                ) {
                    response.status(400).json({ error: 'creation echouer' });
                }
                try {
                    console.log(client);
                    let annonce = new Annonce(
                        req.body.title,
                        req.body.description,
                        req.body.image,
                        authData.sub)
                    let result = await client
                        .db('YourPost')
                        .collection('posts')
                        .insertOne(annonce)
                    console.log(result);
                    response.status(200).json(result)
                } catch (e) {
                    console.log(e)
                    response.status(500).json(e)
                }
            }
        }
    )
}

//delete
async function deletePost(req, res) {
    const token = await extractToken(req);

    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => {
            if (err) {

                console.log(err)
                res.status(401).json({ err: 'Unauthorized' })
                return
            } else {


                if (!req.params.id) {
                    res.status(400).send("Id Obligatoire");
                }

                let id = new ObjectId(req.params.id);

                let annoncesupr = await client
                    .db("YourPost")
                    .collection("posts")
                    .deleteOne({ _id: id });

                let response = await annoncesupr;

                if (response.deletedCount === 1) {
                    res.status(200).json({ msg: "Suppression réussie" });
                } else {
                    res.status(204).json({ msg: "Pas d'annonce pour cette article" });
                }
            }
        }
    )
}

async function updatePost(request, response) {
    const id = new ObjectId(request.params.id);
    const token = await extractToken(request);

    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => {
            if (err) {

                console.log(err)
                response.status(401).json({ err: 'Unauthorized' })
                return
            } else {

                if (
                    !request.body.title ||
                    !request.body.description ||
                    !request.body.image 


                ) {
                    response.status(400).json({ error: 'remplir les champs' })
                }

                try {
                    await client
                        .db('YourPost')
                        .collection('posts')
                        .updateOne(
                            { _id: id },
                            {
                                $set: {
                                    title: request.body.title,
                                    description: request.body.description,
                                    image: request.body.image,
                                },
                            }
                        )

                    response.status(200).json({ msg: "Update successful" });

                } catch (e) {
                    console.log(e)
                    response.status(500).json(e)
                }
            }
        }
    )
}
const getallUsers = async (req, res) => {
    try {
        const token = await extractToken(req);
        jwt.verify(
            token,
            process.env.MY_SUPER_SECRET_KEY,
            async (err, authData) => {
                if (err) {
                    res.status(401).json({ err: 'Unauthorized' });
                    return;
                } else {
                    
                    const sql = `SELECT *, CONCAT('/upload/', image) as avatar FROM users WHERE UUID = ?`
                    const values =[authData.sub]
                    const [rows] = await pool.execute(sql,values);
                    res.json(rows);
                }
            }
        );
    } catch (err) {
        console.log(err);
    }
}



const getallUser = async (req, res) => {
    try {
        const token = await extractToken(req);
        jwt.verify(
            token,
            process.env.MY_SUPER_SECRET_KEY,
            async (err, authData) => {
                if (err) {
                    res.status(401).json({ err: 'Unauthorized' });
                    return;
                } else {
                    
                    const sql = `SELECT *, CONCAT('/upload/', image) as avatar FROM users`
                    const [rows] = await pool.execute(sql,);
                    res.json(rows);
                }
            }
        );
    } catch (err) {
        console.log(err);
    }
}


const getUsers = async (req, res) => {
    try {
        const token = await extractToken(req);
        jwt.verify(
            token,
            process.env.MY_SUPER_SECRET_KEY,
            async (err, authData) => {
                if (err) {
                    res.status(401).json({ err: 'Unauthorized' });
                    return;
                } else {
                    const sql = `SELECT username, UUID, CONCAT('/upload/', image) as avatar FROM users`;
                    const [rows] = await pool.execute(sql);
                    res.json(rows);
                }
            }
        );
    } catch (err) {
        console.log(err);
    }
}




const AllAnnonce = async (request, response) => {
    const token = await extractToken(request);
    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => {
            if (err) {
                console.log(err);
                response.status(401).json({ err: 'Unauthorized' });
                return;
            } else {
                let annonces = await client
                    .db('YourPost')
                    .collection('posts')
                    .find();

                let apiResponse = await annonces.toArray();
                response.status(200).json(apiResponse);
            }
        }
    ).catch((err) => {
        console.log(err);
        response.status(500).json(err);
    });
};


 
const AnnonceByusername = async (req, res) => {
    const { username } = req.params;
    try {
        const token = await extractToken(req);
        jwt.verify(
            token,
            process.env.MY_SUPER_SECRET_KEY,
            async (err, authData) => {
                if (err) {
                    res.status(401).json({ message: 'Unauthorized' });
                } else {
                    const query = 'SELECT * FROM users WHERE username LIKE ? AND email_verified = 1';
                    const result = await pool.execute(query, [`%${username}%`]);
                    const users = result[0];
                    res.status(200).json(users);
                }
            }
        );
        
    } catch (err) {
        res.status(500).json({ message: 'An internal error occurred' });
    }
};


const getmyPosts = async (request, response) => {
    const token = await extractToken(request);
    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => {
            if (err) {
                console.log(err);
                response.status(401).json({ err: 'Unauthorized' });
                return;
            } else {
                let annonces = await client
                    .db('YourPost')
                    .collection('posts')
                    .find({ userId: authData.sub });

                let apiResponse = await annonces.toArray();
                response.status(200).json(apiResponse);
            }
        }
    ).catch((err) => {
        console.log(err);
        response.status(500).json(err);
    });
};


const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const result = await pool.execute(
            'UPDATE users SET token = ? WHERE token = ?',
            [null, token]
        )
        if (result[0].affectedRows === 1) {
            res.status(200).json({ message: 'Logout successful' })
        } else {
            res.status(404).json({ message: 'Token not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const likePost = async (req, res) => {
   
    const token = await extractToken(req);
    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => {
            if (err) {
                console.log(err);
                response.status(401).json({ err: 'Unauthorized' });
                return;
            }
   
            try {


                const postId = new ObjectId(req.params.id); 
            

                const posts = await client.db('YourPost').collection('posts')
                    .updateOne({_id: postId}, {$addToSet: {likes: authData.sub}  });

                if (!posts) {
                    res.status(404).json({ message: 'Post not found' });
                    return;
                }

                res.json(posts);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'An error occurred' });
            }
        }

    )}



    const comment = async (req, res) => {
        const token = await extractToken(req);
        jwt.verify(
            token,
            process.env.MY_SUPER_SECRET_KEY,
            async (err, authData) => {
                if (err) {
                    console.log(err);
                    response.status(401).json({ err: 'Unauthorized' });
                    return;
                }
                try {
                    const postId = new ObjectId(req.params.id);
                    const posts = await client.db('YourPost').collection('posts')
                        .updateOne({ _id: postId }, { $addToSet: { comments: req.body.comment } });
                    if (!posts) {
                        res.status(404).json({ message: 'Post not found' });
                        return;
                    }
                    res.json(posts);
                } catch (err) {
                    console.error(err);
                    res.status(500).json({ message: 'An error occurred' });
                }
            }
        )
    }



    const changeVerifiedStatus = async (req, res) => {
        const token = await extractToken(req);
        jwt.verify(
            token,
            process.env.MY_SUPER_SECRET_KEY,
            async (err) => {
                if (err) {
                    console.log(err);
                    response.status(401).json({ err: 'Unauthorized' });
                    return;
                }
                try {
                    const userId =req.body.uuid;
                    const result = await pool.execute('UPDATE users SET email_verified = 0 WHERE UUID = ?',[userId]);
                    if (result[0].affectedRows === 0) {
                        res.status(404).json({ message: 'User not found' });
                        return;
                    }
                    res.json(result[0]);
                } catch (err) {
                    console.error(err);
                    res.status(500).json({ message: 'An error occurred' });
                }
            }
        )
    }

 

    const contact = async (req, res) => {
        
            const name = req.body.name;
            const email = req.body.email;
            const message = req.body.message;
          
        
            const info = await transporter.sendMail({
                from: `${process.env.SMTP_EMAIL}`,
                to: `${email}`,
                subject: 'Contact SkyMarLand',
                text: 'Need Help?',
                html: `<b>Name&#129313;: ${req.body.name}</b>` + `<br>` + `<b>Email&#128511;: ${req.body.email}</b>` + `<br>` + `<b>message&#128073;: ${req.body.message}</b>`,
            });
        
            console.log('Message sent: %s', info.messageId);
            res.status(200).json(`Message send with the id ${info.messageId}`);
        };
        

module.exports = {
    register,
    verifyEmail,
    login,
    ForgotPassword,
    CreatePost,
    deletePost,
    updatePost,
    insertAvatarPicture,
    getallUsers,
    AllAnnonce,
    getallUser,
    AnnonceByusername,
    getmyPosts,
    logout,
    getUsers,
    likePost,
    comment,
    changeVerifiedStatus,
    contact
}
