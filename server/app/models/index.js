const Sequelize = require("sequelize");
const dbConfig = require("../config/dbConfig.js");
const { Client } = require('pg');

 // Function to create the database if it doesn't exist
 async function createDatabaseIfNotExists() {
  const client = new Client({
      user: 'postgres',
      password: 'admin',
      host: 'localhost',
      port: 5432,
      database: dbConfig.DB,
      ssl: false // Default database for PostgreSQL
  });

  try {
      await client.connect();
      // await client.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.DB}`);
//       await client.query(`IF NOT EXISTS(SELECT name FROM sys.databases WHERE name = '${dbConfig.DB}')
// BEGIN
//         CREATE DATABASE ${dbConfig.DB};
// END`)

      console.log('Database created or already exists.');
  } catch (error) {
      console.error('Error creating database:', error);
  } finally {
      await client.end();
  }
  }

  // Create the database or ensure it exists
  createDatabaseIfNotExists();
let sequelize;

 sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: false
});



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usersTable = require("./model.js")(sequelize, Sequelize);
db.linksTable = require("./model.js")(sequelize, Sequelize);
db.rolesTable = require("./model.js")(sequelize, Sequelize);
module.exports = db;
