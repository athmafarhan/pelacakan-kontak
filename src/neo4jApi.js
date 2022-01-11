require("file-loader?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js");
const Person = require("./models/Person");
const PersonInteraction = require("./models/PersonInteraction");
const _ = require("lodash");

const neo4j = window.neo4j;
const neo4jUri = "neo4j://pelacakan-kontak.my.id:7687";
let neo4jVersion = process.env.NEO4J_VERSION;
if (neo4jVersion === "") {
  // assume Neo4j 4 by default
  neo4jVersion = "4";
}
let database = "";
if (!neo4jVersion.startsWith("4")) {
  database = null;
}
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic("neo4j", "Matematika16")
);

console.log(`Database running at ${neo4jUri}`);

function searchPersons(queryString) {
  const session = driver.session({ database: database });
  return session
    .readTransaction((tx) =>
      tx.run("MATCH (n) WHERE n.nama =~ $nama RETURN n", {
        nama: "(?i).*" + queryString + ".*",
      })
    )
    .then((result) => {
      return result.records.map((record) => {
        return new Person(record.get("n"));
      });
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}//mencari id kontak [dinamis]

function getPerson(nama) {
  const session = driver.session({ database: database });
  return session
    .readTransaction((tx) =>
      tx.run(
        "MATCH (n:Node {nama:$nama}) OPTIONAL MATCH (m:Node)<-[Kontak_Dengan]-(n) RETURN n.nama AS nama, collect([m.nama, m.jk, m.rt]) AS interaksi_dengan LIMIT 1",
        { nama }
      )
    )
    .then((result) => {
      if (_.isEmpty(result.records)) return null;

      const record = result.records[0];
      return new PersonInteraction(record.get("nama"), record.get("interaksi_dengan"));
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}//mengambil data id kontak dari database [dinamis]

function getGraph() {
  const session = driver.session({ database: database });
  return session
  .readTransaction((tx) =>
  tx.run(
    "MATCH (a:Node)<-[:Kontak_Dengan]-(m:Node) RETURN m.nama AS nama, collect(a.nama) AS interaksi_dengan LIMIT $limit",
    { limit: neo4j.int(100) }
    )
    )
    .then((results) => {
      const nodes = [],
      rels = [];
      let i = 0;
      results.records.forEach((res) => {
        nodes.push({ nama: res.get("nama"), label: "Node" });
        const target = i;
        i++;
        
        res.get("interaksi_dengan").forEach((nama) => {
          const person = { nama: nama, label: "Node" };
          let source = _.findIndex(nodes, person);
          if (source === -1) {
            nodes.push(person);
            source = i;
            i++;
          }
          rels.push({ source, target });
        });
      });
      
      return { nodes, links: rels };
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}//mengkontruksikan graf [dinamis]

function centralityDegree() {
  const session = driver.session({ database: database });
  return session
    .readTransaction((tx) =>
      tx.run(
        //CALL gds.degree.stream('myGraph1')
//YIELD nodeId, score
//RETURN gds.util.asNode(nodeId).nama AS name, score AS followers
//ORDER BY followers DESC, name ASC
        "MATCH (n:Node {nama:$nama}) OPTIONAL MATCH (m:Node)<-[Kontak_Dengan]-(n) RETURN n.nama AS nama, collect([m.nama, m.jk, m.rt]) AS interaksi_dengan LIMIT 1",
        { nama }
      )
    )
}

exports.searchPersons = searchPersons;
exports.getPerson = getPerson;
exports.getGraph = getGraph;


// function voteInPerson(title) {
//   const session = driver.session({ database: database });
//   return session
//     .writeTransaction((tx) =>
//       tx.run(
//         "MATCH (m:Person {title: $title}) \
//         WITH m, (CASE WHEN exists(m.votes) THEN m.votes ELSE 0 END) AS currentVotes \
//         SET m.votes = currentVotes + 1;",
//         { title }
//       )
//     )
//     .then((result) => {
//       return result.summary.counters.updates().propertiesSet;
//     })
//     .finally(() => {
//       return session.close();
//     });
// }