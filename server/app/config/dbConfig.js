module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PORT: 5432,
    PASSWORD: "admin",
    DB: "justo_assessment",
    dialect: "postgres",
    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
   };