const _ = require("lodash");

function PersonDegreeCentrality(nama, total) {
  _.extend(this, {
    nama: nama,
    dc: total
  });
}//degreeCentrality pada graf

module.exports = PersonDegreeCentrality;
