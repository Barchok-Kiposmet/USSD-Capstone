const express = require('express');
const { getSession, setSession } = require('../controllers/ussd');
const router = express.Router();


router.post('/', async (req, res) => {
    // Read the variables sent via POST from our API
    const {
        sessionId, phoneNumber, text,
    } = req.body;

    //Check if a valid session with same ID exists
    const session = await getSession(req.sessionStore, sessionId)
    if (session) {
        //Process User Input
        res.status(200).send('Session exists')
        return;
    }

    //Create a new Session
    const sessionObj = {
        cookie: {
            maxAge: 60000, httpOnly: true
        }, id: sessionId
    }


    await setSession(req.sessionStore, sessionId, sessionObj)
    res.status(200).send('New Session Created')
    return;


    let response = '';

    if (text == '') {
        // This is the first request. Note how we start the response with CON
        response = `CON How much do you wish to spend?`;
    } else if (text == '100') {
        // This is the first request. Note how we start the response with CON
        response = `CON 
        1. Offer 1 @100
        2. Offer 2 @100
        3. Offer 3 @100
        0:Back`;

    } else if (text == '100*2') {
        // Business logic for first level response
        // This is a terminal request. Note how we start the response with END
        response = `END You have bought X Offer for amount X`;
    }
    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);
});

module.exports = router;
