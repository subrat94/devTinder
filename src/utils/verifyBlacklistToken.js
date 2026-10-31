const BlacklistToken = require("../models/blacklistToken");

const verifyBlacklistToken = async (token) => {
    if (!token) {
        throw new Error("Token not found");
    }

    const blacklistedToken = new BlacklistToken({
        token: token
    });

    await blacklistedToken.save();

    return true;
};

module.exports = { verifyBlacklistToken };