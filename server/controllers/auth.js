const UserData = require('../data/user.data');

const getUsers = async (req, res, next) => {
    const response = await UserData.getAllUsers(req.body);
    res.send(response);
    next();
}

const createUser = async (req, res, next) => {
    const response = await UserData.createUser(req.body);
    res.redirect(`http://localhost:5500?id=${response._id}`);
    next();
}

module.exports = {
    getUsers,
    createUser
}