module.exports = (sequelize, Sequelize) => {
    const usersTable = sequelize.define(
      "users",
      {
        username: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.BOOLEAN,
        },
        loginAttempt: {
          type: Sequelize.INTEGER,
        }
      },
      {
        createdAt: false, 
        updatedAt: false, 
        freezeTableName: true, 
      }
    );
  
    const linksTable = sequelize.define(
      "links",
      {
        hashedEmail: {
          type: Sequelize.STRING,
        },
        link: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.BOOLEAN,
        },
        timeLimitInMins: {
          type: Sequelize.INTEGER,
        },
        limits: {
          type: Sequelize.INTEGER,
        }
      },
      {
        createdAt: false, 
        updatedAt: false, 
        freezeTableName: true, 
      }
    );
  
    // export
    const allTables = {
      usersTable: usersTable,
      linksTable: linksTable
    };
  
    return allTables;
  };
  