var db = require("../models");

module.exports = function(app) {
  // Get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Get single user by ID
  app.get("/api/users/:id", function(req, res) {
    db.User.findOne({ where: { user_id: req.params.id } }).then(function(
      dbUser
    ) {
      res.json(dbUser);
    });
  });

  // Create a new user
  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // Delete a user by id
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({ where: { user_id: req.params.id } }).then(function(
      dbUser
    ) {
      res.json(dbUser);
    });
  });

  // Delete all existing users
  app.delete("/api/users", function(req, res) {
    db.User.destroy({ where: {}, truncate: true }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // Put route for updating existing user
  app.put("/api/users/:id", function(req, res) {
    db.User.update(req.body, { where: { user_id: req.params.id } }).then(
      function(dbUser) {
        res.json(dbUser);
      }
    );
  });
};
