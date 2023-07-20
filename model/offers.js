const Offers = require('./data');

// Function to fetch offers within a price range
async function fetchOffersInRange(userAmount, type) {
    try {
        const resourceType = (type === "1") ? "data" : "voice";
        return await Offers.find({
            amount: {$gte: userAmount - 10, $lte: userAmount + 10},
            type: resourceType
        });
    } catch (err) {
        throw new Error('Failed to fetch offers');
    }
}

module.exports = {
    fetchOffersInRange
};