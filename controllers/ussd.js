/**
 *Retrieves a session from the session store based on the session ID
 * @param {Object} sessionStore
 * @param {string} sessionId
 * @returns {Promise<object>}
 * **/
const {fetchOffersInRange} = require("../model/offers");

function getSession(sessionStore, sessionId) {
    return new Promise((resolve, reject) => {
        sessionStore.get(sessionId, (err, session) => {
            if (err) {
                reject(err)
            } else {
                resolve(session)
            }
        })
    })
}

/**
 *Create a session with the provided details
 * @param {Object} sessionStore
 * @param {string} sessionId
 * @param {Object} sessionObj
 * @returns {Promise}
 * **/
function setSession(sessionStore, sessionId, sessionObj) {
    return new Promise((resolve, reject) => {
        sessionStore.set(sessionId, sessionObj, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

/**
 *Processes what the user has provided
 * @param {string} userInput
 * @param {string} menu
 * @param {Object} session
 * @returns {Promise}
 * **/
async function processUSSD(userInput, menu, session) {
    try {
        const menuOption = await validateInput(menu, userInput, session);
        return await generateMenuResponse(
            menuOption === "invalid" ? menu : menuOption,
            menuOption === "invalid", userInput, session
        );
    } catch (error) {
        return {
            menuOption: "main",
            response: "END Error! Please try again",
            error:error
        };
    }
}

/**
 *Validate what the user has provided
 * @param {string} currentOption
 * @param {string} userInput
 * @param {object} session
 * @returns {promise}
 * **/
async function validateInput(currentOption, userInput, session) {
    const regex = /^\d+$/;
    if ( currentOption !== "*" && !regex.test(userInput)) {
        // Invalid input, ask again
    }
    switch (currentOption) {
        case '*':
            return "resourceType";

        case 'resourceType':
            switch (userInput) {
                case '1':
                case '2':
                    return "askAmount";
                default:
                    return "invalid";
            }

        case 'askAmount':
            switch (userInput) {
                case '00':
                    return "resourceType";
                default:
                    return "availableOffers";
            }

        case 'availableOffers':
            switch (userInput) {
                case '00':
                    return "askAmount";
            }
            if(!(userInput >= 0 && userInput <= session.offers.length))
                return 'invalid'

            return "confirmSelectOffer";

        case 'confirmSelectOffer':
            switch (userInput) {
                case '0':
                    return "resourceType";
                case '00':
                    return "availableOffers";
                case '1':
                case '2':
                    return "save";
                default:
                    return "invalid";
            }
    }
}

/**
 *Generated user response based on what the user has provided
 * @param {string} menuOption
 * @param {boolean} isInvalid
 * @param {string} userInput
 * @param {Object} session
 * @returns {promise}
 * **/
async function generateMenuResponse(menuOption, isInvalid, userInput, session) {
    // Initialize the response variables
    let menuText;
    let menuOptions = {};
    const invalidChoice = isInvalid?`Invalid choice. Try again.\n`:``;

    // Generate the appropriate menu based on the current menu option
    switch (menuOption) {
        case 'resourceType':
            menuText = `CON ${invalidChoice} Options`;
            menuOptions = {'1': 'Data', '2': 'Talk Time'};
            break;

        case 'askAmount':
            menuText = `CON ${invalidChoice} How much do you wish to spend?`;
            menuOptions = {'OO': 'Back'};
            break;

        case 'availableOffers':
            const amount = (isInvalid || session.menuOption === "confirmSelectOffer") ? session.data.askAmount : userInput;
            const resourceType = (session.data.resourceType === "1") ? "Data" : "Talk Time";
            menuOptions = await processOffers(amount, session);
            menuText = (Object.keys(menuOptions).length === 0)
                ? `CON ${invalidChoice} NO ${resourceType} Offers Available for ${amount}/=`
                : `CON ${invalidChoice} Available ${resourceType} Offers for ${amount}/=`;
            menuOptions['00']="Back";
            break;

        case 'confirmSelectOffer':
            menuText = `CON Confirm purchase of ${await selectedOffer(userInput, session)}\n Pay with:`;
            menuOptions = { '1': 'Airtime', '2': 'M-Pesa', '00': 'Back\n 0. HOME'};
            break;

        case 'save':
            menuText = `END Successful. You have subscribed to ${session.selectedOffer.name}\n Thank you!`;
            break;

        case 'dont_save':
            menuText = 'END Offer selection Canceled. Thank you!';
            break;

        default:
            menuText = 'END Error processing request. Please try again.';
            break;
    }

    // Generate the USSD response
    let response = menuText;
    const optionKeys = Object.keys(menuOptions);
    if (optionKeys.length > 0) {
        response += '\n' + optionKeys.map((key) => `${key}. ${menuOptions[key]}`).join('\n');
    }

    return Promise.resolve({
        menuOption: menuOption,
        response: response
    });
}

/**
 *Generated user response based on what the user has provided
 * @param {string} userInput
 * @param {object} session
 * @returns {promise}
 * **/

async function processOffers(userInput, session){
    const offers = await fetchOffersInRange(userInput, session.data.resourceType);
    session.offers = offers;
    // Map the offers to JSON objects with index+1 as keys and offer names as values
    return  offers.reduce((result, offer, index) => {
        result[index + 1] = `${offer.resource} ${offer.description} = ${offer.amount}/=`;
        return result;
    }, {});
}

/**
 *Generated user response based on what the user has provided
 * @param {string} userInput
 * @param {object} session
 * @returns {promise}
 * **/

async function selectedOffer(userInput, session){
    const adjustedIndex = userInput - 1;
    const offer = session.offers[adjustedIndex];
    session.selectedOffer={
        id:offer._id,
        name:`${offer.resource} ${offer.description} = ${offer.amount}/=`
    };
    return `${offer.resource} ${offer.description} = ${offer.amount}/=`;
}
module.exports = { getSession, setSession, processUSSD };