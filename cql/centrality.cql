//Mengcompile seluruh data terbaru yang akan dihitung
CALL gds.graph.create('myGraph1', 'Node', 'Kontak_Dengan')

//menghitung degreeCentrality
CALL gds.degree.stream('myGraph1')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).nama AS nama, score AS total
ORDER BY total DESC, nama ASC

//menghitung betweennessCentrality
CALL gds.betweenness.stream('myGraph1')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).nama AS nama, score AS total
ORDER BY total DESC, nama ASC

//menghitung closenessCentrality
CALL gds.alpha.closeness.stream('myGraph1')
YIELD nodeId, centrality
RETURN gds.util.asNode(nodeId).nama AS nama, centrality AS total
ORDER BY total DESC, nama ASC