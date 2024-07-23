const jwt = require("jsonwebtoken");
const db = require("../models");
const { linkValidFor, ACCESS_TOKEN_SECRET } = require("../utils/crypto");
const users = db.usersTable.usersTable;
const links = db.linksTable.linksTable;
const roles = db.rolesTable.rolesTable;
const Op = db.Sequelize.Op;
exports.getOneTimeLink = async (req, res) => {
    const hashedEmail = req.params.email;


    let data = await links.create({ hashedEmail: hashedEmail, link: `/oneTimeLink/${hashedEmail}`, status: 1, timeLimitInMins: linkValidFor, limits: 0 })
    res.send({
        status: true,
        message: {
            data: data
        },
    });


    // await users.create({username: username, password: JSON.stringify(encrypt(password)), status: 1, loginAttempt: 0})
    // const checkLinks = await links.findAll({ where: { hashedEmail: hashedEmail, status: true } });




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

exports.tokenValidation = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(authHeader)
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(401);
        console.log("decoded", decoded)
        const checkIfKickedOut = await users.findOne({ where: { username: decoded.username } });
        if (!checkIfKickedOut.kickedOut) {
            res.send({
                status: true,
                message: {
                    currentTime: new Date().toLocaleString(),
                    decoded: decoded
                }
            })
        }
        else {
            res.send({
                status: false,
                message: "You are not authorised to get the current server time",
            });
        }

    });
}

exports.getAllUsers = async (req, res) => {
    let allUsers = await users.findAll(
        {attributes: ['id', 'username', 'kickedOut'],
        include: [
            {
                model: roles,
                required: true,
                where: { role: 'user' }
            }
        ],
       
    });

    res.send({
        status: true,
        message: {
            data: allUsers
        },
    });


};

exports.kickOut = async(req, res)=>{
    await users.update({ kickedOut: 1 }, {
        where: {
            id: req.params.id
        }
    })
    res.send({
        status: true,
        message: "User Kicked Out Successfully"
    })
}