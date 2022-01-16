// const _ = require("lodash");

// function PersonDegreeCentrality(nama, total) {
//   _.extend(this, {
//     nama: nama,
//     dc: total
//   });
// }//degreeCentrality pada graf

// module.exports = PersonDegreeCentrality;
const _ = require("lodash");

function PersonDegreeCentrality(_node) {
  _.extend(this, _node.properties);

}//objek person pada graf

module.exports = PersonDegreeCentrality;
