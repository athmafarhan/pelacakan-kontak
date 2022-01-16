const _ = require("lodash");

function PersonBetweennessCentrality(nama, total) {
  _.extend(this, {
    nama: nama,
    bc: total
  });
}//degreeCentrality pada graf

module.exports = PersonBetweennessCentrality;
