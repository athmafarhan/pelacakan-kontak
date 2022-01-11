const _ = require("lodash");

function PersonInteraction(nama, interaksi_dengan) {
  _.extend(this, {
    nama: nama,
    interaksi_dengan: interaksi_dengan.map(function (c) {
      return {
        nama: c[0],
        jk: c[1],
        rt: c[2],
      };
    }),
  });
}//objek interaksi pada graf

module.exports = PersonInteraction;
