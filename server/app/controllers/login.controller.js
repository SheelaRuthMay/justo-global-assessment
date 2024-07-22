const db = require("../models");
const { decrypt, ACCESS_TOKEN_SECRET, encrypt, maxLoginAttempts } = require("../utils/crypto");
const jwt = require("jsonwebtoken");
// const jwt_decode = require("jwt-decode");
const users = db.usersTable.usersTable;

exports.userLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // await users.create({username: username, password: JSON.stringify(encrypt(password)), status: 1, loginAttempt: 0})
    const checkUsernameInUsers = await users.findOne({ where: { username: username, status: true } });
    const checkUsernameInLockedUsers = await users.findOne({ where: { username: username, status: false } });


    if (!checkUsernameInUsers && !checkUsernameInLockedUsers) {
        res.send({
            status: false,
            message: "Username is not registered with us",
        });
    }
    else if (!checkUsernameInUsers && checkUsernameInLockedUsers) {
        res.send({
            status: false,
            message: "Account Locked",
        });
    }
    else if (checkUsernameInUsers) {

        let decryptedPassword = decrypt(
            JSON.parse(checkUsernameInUsers.dataValues.password)
        );
        if (password !== decryptedPassword) {
            let updateAttempt = checkUsernameInUsers.dataValues.loginAttempt + 1;
            let condition;
            if (updateAttempt < maxLoginAttempts) {
                condition = {
                    loginAttempt: updateAttempt
                }
            }
            else {
                condition = {
                    status: false,
                    loginAttempt: updateAttempt
                }
            }
            await users
                .update(
                    condition,
                    {
                        where: { username: username },
                        returning: true,
                        //plain: true,
                    }
                )
            res.send({
                status: false,
                message: checkUsernameInUsers.dataValues.loginAttempt < maxLoginAttempts ? "Incorrect password!" : "Account Locked",
            });
        }
        else if (password === decryptedPassword) {

            let id = checkUsernameInUsers.dataValues.id;
            const accessToken = jwt.sign(
                { id: id, username: username },
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "24h",
                }
            );
            console.log("accessToken", accessToken);

            res.send({
                status: true,
                message: {
                    accessToken
                },
            });

        }
    }

};

exports.insertOnce = async (req, res) => {
    let data = await users.findOne({ where: { username: 'justo' } })
    if (!data) {
        await users.create({ username: 'justo', password: JSON.stringify(encrypt('12345')), status: 1, loginAttempt: 0 })
    }
};