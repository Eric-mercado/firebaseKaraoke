/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
let serviceAccount = require("./permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://karaoke-marbella-default-rtdb.firebaseio.com"
  });

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const app = express(); 
const db = admin.firestore(); 

app.use(cors( { origin:true})); 


// routes
app.get('/hello-world', (req, res) => {
        return res.status(200).send("hello world!"); 
}); 

//create
app.post('/api/create', (req, res) => {
   (async () => {
       try {
            await db.collection('karaoke').doc()
            .create({
                artista: req.body.artista,
                cancion: req.body.cancion,
                karaoke: req.body.karaoke,
                canta:req.body.canta
            })
            return res.status(200).send('created'); 
       } 
       catch(error) {
            console.log(error); 
            return res.status(500).send(error); 
       }
   })(); 
});

//read 
app.get('/api/read/:id', (req, res) => {
    (async () => {

        try {
            console.log('request id: ' + req.params.id); 
           const document = db.collection('karaoke').doc(req.params.id); 

           let karaoke = await document.get(); 
           let response = karaoke.data(); 
           console.log(karaoke); 
           return res.status(200).send(response); 

        } catch(error) {
            console.log(error); 
            return res.status(500).send(error); 
        }
    })(); 
}); 

//read by karaoke 
app.get('/api/read/all/:karaoke', (req, res) => {
    (async () => {
        try {
         
            let query = db.collection('karaoke').where('karaoke', '==', req.params.karaoke);
            let response = []; 
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; 

                for(let doc of docs) 
                {
                    const selectedItem = {
                        id: doc.id, 
                        artista: doc.data().artista,
                        cancion: doc.data().cancion, 
                        karaoke: doc.data().karaoke,
                        canta: doc.data().canta
                    }; 
                    response.push(selectedItem)
                }
                return response; 
            })
           return res.status(200).send(response); 

        } catch(error) {
            console.log(error); 
            return res.status(500).send(error); 
        }
    })(); 
}); 

//read  all 
app.get('/api/read/', (req, res) => {
    (async () => {

        try {

            let query = db.collection('karaoke'); 
            let response = []; 
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; 

                for(let doc of docs) 
                {
                    const selectedItem = {
                        id: doc.id, 
                        artista: doc.data().artista,
                        cancion: doc.data().cancion, 
                        karaoke: doc.data().karaoke,
                        canta: doc.data().canta
                    }; 
                    response.push(selectedItem)
                }
                return response; 
            })
           return res.status(200).send(response); 

        } catch(error) {
            console.log(error); 
            return res.status(500).send(error); 
        }
    })(); 
}); 

//update
app.put('/api/update/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('karaoke').doc(req.id); 


             await document.update({
                artista: req.body.artista,
                cancion: req.body.cancion,
                karaoke: req.body.karaoke,
                canta: req.body.canta
             }) 

             return res.status(200).send(document); 
        } 
        catch(error) {
             console.log(error); 
             return res.status(500).send(error); 
        }
    })(); 
 });


//delete
app.delete('/api/delete/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('karaoke').doc(req.params.id); 

            await document.delete()
             return res.status(200).send('deleted'); 
        } 
        catch(error) {
             console.log(error); 
             return res.status(500).send(error); 
        }
    })(); 
});

exports.app = functions.https.onRequest(app);

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
