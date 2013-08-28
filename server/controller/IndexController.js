var env = require('rekuire')("env");

var Controller = function() {
    
    this.index = function(req, res){
        res.render('pages/index/index.ect', {user: req.user});   
    };

};

module.exports = { getInstance : function() {return new Controller()}};