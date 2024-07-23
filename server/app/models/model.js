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
        },
        kickedOut: {
          type: Sequelize.BOOLEAN,
        },
        role_id: {
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

    const rolesTable = sequelize.define(
      "roles",
      {
        role_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
      role: {
          type: Sequelize.STRING,
        }
      },
      {
        createdAt: false, 
        updatedAt: false, 
        freezeTableName: true, 
      }
    );

    rolesTable.hasMany(usersTable, { foreignKey: 'role_id' })
    usersTable.belongsTo(rolesTable, { foreignKey: 'role_id' })
  
    // export
    const allTables = {
      usersTable: usersTable,
      linksTable: linksTable,
      rolesTable: rolesTable
    };
  
    return allTables;
  };
  