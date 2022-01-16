require("file-loader?name=[name].[ext]!./assets/images/favicon.ico");
const api = require("./neo4jApi");

$(function () {
  renderGraph();
  search();

  $("#search").submit((e) => {
    e.preventDefault();
    search();
  });
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
  },
  api.getDegreeCentrality(nama).then((person) =>{
    if (!person) return;

    const $list = $("#degree").empty();
    if (person.total.nama != null) {
      person.total.forEach((total) => {
        $list.append($(total.dc)
        );
      });
    } else {
      $list.append("<p>Belum memkompile graf</p>");
    }
  })
  , "json");
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
