const User = require('../model/user')

const LoginDb = (UserName, Password) => {

    return User.findOne({ where: { UserName, Password } });
}

const SighinDb = (user) => {
    return User.create(user)
}

module.exports = { LoginDb, SighinDb };