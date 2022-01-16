// const _ = require("lodash");

// function PersonClosenessCentrality(nama, total) {
//   _.extend(this, {
//     nama: nama,
//     cc: total
//   });
// }//degreeCentrality pada graf

// module.exports = PersonClosenessCentrality;
const _ = require("lodash");

function PersonClosenessCentrality(_node) {
  _.extend(this, _node.properties);

}//objek person pada graf

module.exports = PersonClosenessCentrality;
