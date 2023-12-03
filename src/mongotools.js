const WalletSchema = require("./schemas/WalletSchema");
const { log, error } = require("./functions");

/**
 * Finds the wallet of a given User ID
 * Creates one if it doesn't exist
 * 
 * @param {string} id - The ID of the User
 * @returns The Schema of a User
 */
const findWallet = async id => {
    let wallet, Wallet;
    try {
        wallet = await WalletSchema.findOne({ userid: id });
        if (wallet) Wallet = wallet;
        else Wallet = new WalletSchema({
            userid: id,
        });
    } catch {
        Wallet = new WalletSchema({
        userid: id,
        });
    }
    return Wallet
}

module.exports = {
    findWallet,
}