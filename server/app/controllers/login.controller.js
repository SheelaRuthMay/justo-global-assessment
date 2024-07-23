const db = require("../models");
const { decrypt, ACCESS_TOKEN_SECRET, encrypt, maxLoginAttempts } = require("../utils/crypto");
const jwt = require("jsonwebtoken");
const users = db.usersTable.usersTable;
const roles = db.rolesTable.rolesTable;

exports.userLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // await users.create({username: username, password: JSON.stringify(encrypt(password)), status: 1, loginAttempt: 0, kickedOut: 0})
    const checkUsernameInUsers = await users.findOne({
        where: { username: username, status: true }, include: [
            {
                model: roles,
            },
        ],
    });
    const checkUsernameInLockedUsers = await users.findOne({ where: { username: username, status: false } });

    console.log("checkUsernameInUsers", checkUsernameInUsers)
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

            res.send({
                status: true,
                message: {
                    accessToken: accessToken,
                    role: checkUsernameInUsers.role.dataValues.role
                },
            });

        }
    }

};

exports.insertOnce = async (req, res) => {
    // let data = await users.findOne({ where: { username: 'justo' } })
    // if (!data) {
    //     await users.create({ username: 'justo', password: JSON.stringify(encrypt('12345')), status: 1, loginAttempt: 0 })
    // }
    let allRoles = await roles.findAll();
    let allUsers = await users.findAll();
    if (allRoles.length < 1) {
        await roles.bulkCreate([
            { role_id: 1, role: "admin" },
            { role_id: 2, role: "user" },
        ])
    }
    if (allUsers.length < 1) {

        await users.bulkCreate([
            { username: "justo", password: JSON.stringify(encrypt('12345')), status: 1, loginAttempt: 0, kickedOut: 0, role_id: 1 },
            { username: "user1", password: JSON.stringify(encrypt('12345')), status: 1, loginAttempt: 0, kickedOut: 0, role_id: 2 },
            { username: "user2", password: JSON.stringify(encrypt('12345')), status: 1, loginAttempt: 0, kickedOut: 0, role_id: 2 },
            { username: "user3", password: JSON.stringify(encrypt('12345')), status: 1, loginAttempt: 0, kickedOut: 0, role_id: 2 },
        ])
    }
};