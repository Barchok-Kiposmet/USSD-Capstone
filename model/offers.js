const Offers = require('./data');

// Function to fetch offers within a price range
async function fetchOffersInRange(userAmount) {
    try {
        const offers = await Offers.find({
            amount: {$gte: userAmount - 10, $lte: userAmount + 10}
        });
        // Map the offers to JSON objects with index+1 as keys and offer names as values
        return  offers.reduce((result, offer, index) => {
            result[index + 1] = offer.description;
            return result;
        }, {});
    } catch (err) {
        throw new Error('Failed to fetch offers');
    }
}

module.exports = {
    fetchOffersInRange
};