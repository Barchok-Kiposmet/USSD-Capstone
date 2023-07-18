const express = require('express');
const { getSession, setSession, processUSSD } = require('../controllers/ussd');
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
        const input = session.input ? text.slice(session.input.length).replace('*', '') : text;
        const response = await processUSSD(input, session.menuOption, session.data);
        session.data[session.menuOption] = input;
        session.previousOption = session.menuOption;
        session.menuOption = response.menuOption;
        session.previousinput = session.input;
        session.input = text;

        await new Promise((resolve, reject) => {
            req.sessionStore.set(sessionId, session, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.status(200).send(response.response);
        console.log(session)
        return;
    }

    //Create a new Session
    const sessionObj = {
        cookie: {
            maxAge: 60000, httpOnly: true
        }, id: sessionId, input: text, menuOption: "askAmount", data: {
            phoneNumber: phoneNumber
        }
    }


    await setSession(req.sessionStore, sessionId, sessionObj)

    const response = await processUSSD("", "*", {});


    res.status(200).send(response.response);
});

module.exports = router;
