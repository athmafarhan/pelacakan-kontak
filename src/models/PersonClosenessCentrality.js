const _ = require("lodash");

function PersonClosenessCentrality(nama, total) {
  _.extend(this, {
    nama: nama,
    cc: total
  });
}//degreeCentrality pada graf

module.exports = PersonClosenessCentrality;
