const _ = require("lodash");

function MovieCast(nama, interaksi_dengan) {
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
}

module.exports = MovieCast;
