
/**
 *Retrieves a session from the session store based on the session ID
 * @param {Object} sessionStore
 * @param {string} sessionId
 * @returns {Promise<object>}
 * **/
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

module.exports = { getSession, setSession };