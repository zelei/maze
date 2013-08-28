var env = require('rekuire')("env");
var logger = require('winston');
var when = require("when");
var UserRepository = env.require("/server/service/repository/UserRepository");

var SignInService = function(){

    this.signIn = function(accessToken, refreshToken, profile, done) {
      
   };
  

};

module.exports = new SignInService();