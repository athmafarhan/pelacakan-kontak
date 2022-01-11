const _ = require("lodash");

function Person(_node) {
  _.extend(this, _node.properties);

}//objek person pada graf

module.exports = Person;
