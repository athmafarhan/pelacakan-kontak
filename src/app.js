require("file-loader?name=[name].[ext]!./assets/images/favicon.ico");
const api = require("./neo4jApi");
const Papa = require("papaparse");

$(function () {
  renderGraph();
  search();

  $("#search").submit((e) => {
    e.preventDefault();
    search();
  });
  $(document).on('click', '#submit_cql', function (e) {
    e.preventDefault();
    let query = $('#cql_form').val();
    console.log(query);
    api.runQueryCQL(query);
  })

  $(document).on('click', '#submit_csv', function (e) {
    e.preventDefault();
    let queryInisialitationList = ""
    let queryInisialitation = ""
    let queryRelationList = "CREATE\n "
    let queryRelation = ""

    let csv_form = document.getElementById("csv_form")
    let fileCSV = csv_form.files[0];
    // console.log(csv_form.files[0]);

    Papa.parse(fileCSV, {
      header: false,
      complete: function (results) {
        for (let j = 0 + 1; j < results.data.length - 1; j++) {
          let element = results.data[j];
          queryInisialitation = "CREATE(" + element[0] + ":Node {nama:'" + element[0] + "');\n";
          queryInisialitationList += queryInisialitation
          for (let i = 0 + 1; i < results.data[0].length; i++) {
            // const element = array[i];
            // console.log(results.data[j][i]);
            if (results.data[j][i] == "1") {
              queryRelation = "(" + results.data[j][0] + ")-[:Kontak_Dengan]->(" + results.data[0][i] + "),\n";
              queryRelationList += queryRelation;
            }

          }
        }
        console.log('finish');
        console.log(queryInisialitationList);
        console.log(queryRelationList);
        // console.log("Finished:", results.data);
      }
    })
  })
  $(document).on('click', '#btn-toggle-panel', function (e) {
    e.preventDefault();
    $('#results').toggle()
  })
});

function showPerson(nama) {
  api.getPerson(nama).then((person) => {
    if (!person) return;

    $("#title").text(person.nama);
    $("#poster").attr(
      "src",
      "https://neo4j-documentation.github.io/developer-resources/language-guides/assets/posters/" +
      encodeURIComponent(person.nama) +
      ".jpg"
    );
    const $list = $("#crew").empty();
    // console.log(person.interaksi_dengan[0].nama);
    if (person.interaksi_dengan[0].nama != null) {
      person.interaksi_dengan.forEach((interaksi_dengan) => {
        $list.append(
          $(
            "<li>" +
            "Nama: " +
            interaksi_dengan.nama +
            ", Jenis Kelamin: " +
            interaksi_dengan.jk +
            ", RT: " +
            interaksi_dengan.rt +
            "</li>"
          )
        );
      });
    } else {
      $list.append("<p>Tidak menularkan ke orang lain</p>");
    }
  }, "json");
}//menunjukkan interaksi masing2 ID kontak setelah klik beserta centrality

function search(showFirst = true) {
  const query = $("#search").find("input[name=search]").val();
  api.searchPersons(query).then((persons) => {
    const t = $("table#results tbody").empty();

    if (persons) {
      persons.forEach((person, index) => {
        $(
          "<tr>" +
          `<td class='person'>${person.nama}</td>` +
          `<td>${person.jk}</td>` +
          `<td>${person.rt}</td>` +
          "</tr>"
        )
          .appendTo(t)
          .click(function () {
            showPerson($(this).find("td.person").text());
          });
      });

      const first = persons[0];
      if (first && showFirst) {
        return showPerson(first.nama);
      }
    }
  });
}//menunjukkan hasil funtion searchPerson

function renderGraph() {
  const width = 700,
    height = 800;
  const force = d3.layout
    .force()
    .charge(-30)
    .linkDistance(30)
    .size([width, height]);

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("pointer-events", "all");

  api.getGraph().then((graph) => {
    force.nodes(graph.nodes).links(graph.links).start();

    const link = svg
      .selectAll(".link")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", "link");

    const node = svg
      .selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("class", (d) => {
        return "node " + d.label;
      })
      .attr("r", 3)
      .call(force.drag);

    // html title attribute
    node.append("title").text((d) => {
      return d.title;
    });

    // force feed algo ticks
    force.on("tick", () => {
      link
        .attr("x1", (d) => {
          return d.source.x;
        })
        .attr("y1", (d) => {
          return d.source.y;
        })
        .attr("x2", (d) => {
          return d.target.x;
        })
        .attr("y2", (d) => {
          return d.target.y;
        });

      node
        .attr("cx", (d) => {
          return d.x;
        })
        .attr("cy", (d) => {
          return d.y;
        });
    });
  });
}//generate graf langsung
