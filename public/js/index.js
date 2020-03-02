// Get references to page elements
var $userName = $("#user-name");
var $userUsername = $("#user-username");
var $userEmail = $("#user-email");
var $userPassword = $("#user-password");
var $userPassword2 = $("#user-password2");

var $submitBtn = $("#submit");
var $deleteAllBtn = $("#delete-all");
var $editBtn = $("#edit-btn");
var $updateBtn = $("#update-user");
var $listBtn = $("#list-btn");
var $modalClose = $("#modalCloseBtn");

var $userList = $("#user-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/users",
      data: JSON.stringify(user)
    });
  },
  getUsers: function() {
    return $.ajax({
      url: "api/users",
      type: "GET"
    });
  },
  getOneUser: function(id) {
    return $.ajax({
      url: "api/users/" + id,
      type: "GET"
    });
  },
  deleteUser: function(id) {
    return $.ajax({
      url: "api/users/" + id,
      type: "DELETE"
    });
  },
  deleteAll: function() {
    return $.ajax({
      url: "api/users/",
      type: "DELETE"
    });
  },
  updateUser: function(id, updatedUser) {
    console.log("updateUser");
    return $.ajax({
      url: "api/users/" + id,
      type: "PUT",
      data: updatedUser
    });
  }
};

// refreshUsers gets new users from the db and repopulates the list
var refreshUsers = function() {
  API.getUsers().then(function(data) {
    var $users = data.map(function(user) {
      var $span = $("<span>")
        .text(user.name)
        .attr("class", "user-item");

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": user.user_id
        })
        .append($span);

      var $button2 = $("<button>")
        .addClass("btn btn-info float-right edit")
        .attr("id", "list-btn")
        .attr("data-toggle", "modal")
        .attr("data-target", "#" + user.user_id)
        .attr("data-id", user.user_id)
        .text("edit");

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      var $modal = `<div class="modal fade" id="${user.user_id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLabel">User Information</h5> <button type="button" id="modalCloseBtn" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modalView2"> <div class="modal-body"><form class="clearfix mb-4" action="POST"> <div class="form-group"> <label for="user-name-update">Name: </label> <input type="text" id="user-name-update-${user.user_id}" class="form-control" aria-describedby="user-name-update" value=${user.name}> </div> <div class="form-group"> <label for="user-username-update">Username: </label> <input type="text" class="form-control" id="user-username-update-${user.user_id}" aria-describedby="user-username-update" value=${user.username}></input> </div> <div class="form-group"> <label for="user-email-update">Email Address: </label> <input type="text" id="user-email-update-${user.user_id}" class="form-control" aria-describedby="user-email-update" value=${user.email}> </div><input type="hidden" id="user-id" value=${user.user_id}> </form></div> <div class="modal-footer"> <button data-id="${user.user_id}" id="update-user" class="btn btn-primary float-right" data-dismiss="modal">Update</button> </div> </div></div> </div> </div>`;

      $li.append($button);
      $li.append($button2);
      $("#home").append($modal);

      return $li;
    });

    $userList.empty();
    $userList.append($users);
  });
};

refreshUsers();

// handleFormSubmit is called whenever we submit a new user
// Save the new user to the db and refresh the list
var handleFormSubmit = function(event) {
  event.stopImmediatePropagation();
  event.preventDefault();

  var user = {
    name: $userName.val().trim(),
    username: $userUsername.val().trim(),
    email: $userEmail.val().trim(),
    password: $userPassword.val().trim(),
    password2: $userPassword2.val().trim()
  };

  // Perform form validation before accepting values
  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function passwordIsValid(password) {
    return /^(?=.*[0-9]){2}(?=.*[!@#$%^&*]){2}[a-zA-Z0-9!@#$%^&*]{8,32}$/.test(
      password
    );
  }

  if ($("#user-name").val() === "") {
    console.log(
      $("#user-name").val(),
      user.name,
      $userName.val(),
      document.getElementById("user-name").value
    );
    console.log("Event", event);

    alert("Name is required!");
  } else if (user.name.length < 3 || user.name.length > 50) {
    alert("Please enter a name between 3 and 50 characters");
  } else if ($("#user-username").val() === "") {
    alert("Username is required!");
  } else if (user.username.length < 3 || user.username.length > 50) {
    alert("Please enter a username between 3 and 50 characters");
  } else if ($("#user-email").val() === "") {
    alert("Email is required!");
  } else if (emailIsValid(user.email) === false) {
    alert("Email must be valid format!");
  } else if ($("#user-password").val() === "") {
    alert("Password is required!");
  } else if (passwordIsValid(user.password) === false) {
    alert(
      "Password is not valid! Must be between 8 and 32 characters and contain the following: 2 special letters, 2 numbers, 2 letters"
    );
  } else if ($("#user-password2").val() === "") {
    alert("Password confirmation is required!");
  } else if (user.password !== user.password2) {
    alert("Passwords must match!");
  }

  // Once the form is validated the data can be pushed
  else {
    API.saveUser(user).then(function() {
      refreshUsers();
    });

    $userName.val("");
    $userUsername.val("");
    $userEmail.val("");
    $userPassword.val("");
    $userPassword2.val("");
  }

  return user;
};

// handleDeleteBtnClick is called when an user's delete button is clicked
// Remove the user from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  console.log("id to delete", idToDelete);

  API.deleteUser(idToDelete).then(function() {
    refreshUsers();
  });
};

var handleListBtnClick = function() {
  console.log("this is clicking");
  var idToGet = $(this)
    .parent()
    .attr("data-id");

  console.log(idToGet);

  API.getOneUser(idToGet).then(function() {
    refreshUsers();
  });
};

// deleteAllUsers is called when user clicks delete ALL users button
// Remove all usesr from the db and refresh the list
var deleteAllUsers = function() {
  console.log("this is clicking");
  API.deleteAll().then(function() {
    refreshUsers();
  });
};

// This function updates a user in our database
function handleUpdateBtnClick(event) {
  event.stopImmediatePropagation();
  // event.preventDefault();
  var id = $(this).attr("data-id");
  console.log("id", id, "this", $(this), $(this).data("id"));
  var $updateId = id;
  var $updateName = $("#user-name-update-" + id);
  var $updateUsername = $("#user-username-update-" + id);
  var $updateEmail = $("#user-email-update-" + id);

  console.log("idToUpdate: " + $updateId);

  var updatedUser = {
    name: $updateName.val().trim(),
    username: $updateUsername.val().trim(),
    email: $updateEmail.val().trim()
  };

  console.log(updatedUser);

  API.updateUser($updateId, updatedUser).then(function() {
    location.reload();
  });

  return updatedUser;
}

function handleModalBtn() {
  $(".modalView1").show();
  $(".modalView2").hide();
}

// Event listeners
$submitBtn.on("click", handleFormSubmit);
$deleteAllBtn.on("click", deleteAllUsers);
// $(document).on("click", "#update-user", handleUpdateBtnClick());
// $(document).ready($updateBtn.on("click", handleUpdateBtnClick));

$listBtn.on("click", handleListBtnClick);
$modalClose.on("click", handleModalBtn);
$userList.on("click", ".delete", handleDeleteBtnClick);

$(document).delegate("#update-user", "click", handleUpdateBtnClick);
