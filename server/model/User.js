var context = require("rekuire")("env");
var database = context.require("/server/service/Database");

var UserSchema = new database.mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  accessToken: { type: String, required: true }
});

//compile schema to model
module.exports = database.connection.model('User', UserSchema);