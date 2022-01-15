//Mengcompile seluruh data terbaru yang akan dihitung
CALL gds.graph.create('myGraph1', 'Node', 'Kontak_Dengan')

//menghitung degreeCentrality
CALL gds.degree.stream('myGraph1')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).nama AS name, score AS followers
ORDER BY followers DESC, name ASC

//menghitung betweennessCentrality
CALL gds.betweenness.stream('myGraph1')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).nama AS name, score
ORDER BY score DESC, name ASC

//menghitung closenessCentrality
CALL gds.alpha.closeness.stream('myGraph1')
YIELD nodeId, centrality
RETURN gds.util.asNode(nodeId).nama AS user, centrality
ORDER BY centrality DESC, user ASC