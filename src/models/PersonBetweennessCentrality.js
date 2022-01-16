// const _ = require("lodash");

// function PersonBetweennessCentrality(nama, total) {
//   _.extend(this, {
//     nama: nama,
//     bc: total
//   });
// }//degreeCentrality pada graf

// module.exports = PersonBetweennessCentrality;
const _ = require("lodash");

function PersonBetweennessCentrality(_node) {
  _.extend(this, _node.properties);

}//objek person pada graf

module.exports = PersonBetweennessCentrality;
