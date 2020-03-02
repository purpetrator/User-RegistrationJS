module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define("User", {
    user_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
      // notEmpty: true
    },
    username: {
      type: Sequelize.STRING
      // notEmpty: true
    },

    email: {
      type: Sequelize.STRING
      // allowNull: false
    },

    password: {
      type: Sequelize.STRING
      // allowNull: false
    },

    password2: {
      type: Sequelize.STRING
      // allowNull: false
    }
  });
  return User;
};
