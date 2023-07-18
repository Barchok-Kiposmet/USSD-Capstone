const Offers = require('./data');

// Function to fetch offers within a price range
async function fetchOffersInRange(userAmount) {
    try {
        return await Offers.find({
            amount: {$gte: userAmount - 10, $lte: userAmount + 10}
        });
    } catch (err) {
        throw new Error('Failed to fetch offers');
    }
}

module.exports = {
    fetchOffersInRange
};