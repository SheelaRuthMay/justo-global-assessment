const { NOW } = require("sequelize");
const db = require("../models");
const users = db.usersTable.usersTable;
const links = db.linksTable.linksTable;

exports.getOneTimeLink = async (req, res) => {
    const hashedEmail = req.params.email;

    // await users.create({username: username, password: JSON.stringify(encrypt(password)), status: 1, loginAttempt: 0})
    // const checkLinks = await links.findAll({ where: { hashedEmail: hashedEmail, status: true } });

    let data = await links.create({ hashedEmail: hashedEmail, link: `/oneTimeLink/${hashedEmail}`, status: 1, timeLimitInMins: 3, limits: 0 })
    res.send({
        status: true,
        message: {
            data: data
        },
    });


};

exports.updateLinkTime = async (req, res) => {
    const token = req.params.token;
    // await users.create({username: username, password: JSON.stringify(encrypt(password)), status: 1, loginAttempt: 0})
    // const checkLinks = await links.findAll({ where: { hashedEmail: hashedEmail, status: true } });

    let data = await links.findOne({ where: { hashedEmail: token } });
    await links.update({ status: data.dataValues.limits === 0 ? 0 : 1, limits: data.limits + 1 }, {
        where: {
            hashedEmail: token
        }
    })
    res.send({
        status: true,
        message: {
            data: data
        },
    });


};