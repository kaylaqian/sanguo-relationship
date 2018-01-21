import json 
import sys
coord = json.loads(sys.argv[1])
data_vertex =[]
data_node = []
data_edges = []
with open('public/data/kmeans-result.json', 'r') as f:
	dicList = json.load(f)
	length = len(dicList['nodes'])
with open('public/data/npm3.json', 'r') as f:
	dicList_edges = json.load(f)
	length2 = len(dicList_edges['edges'])
with open('result.json', 'w') as data:
	sys.stdout.write("{\"nodes\":")
	for element in range(0, length-1):
		if(dicList['nodes'][element]['x'] >= (-1000 - (coord['coord'][0].get('beginX') * -2))
			and dicList['nodes'][element]['x'] <= (-1000 - (coord['coord'][2].get('endX') * -2))
			and dicList['nodes'][element]['y'] >= (-1400 - (coord['coord'][1].get('beginY') * -4))
			and dicList['nodes'][element]['y'] <= (-1400 - (coord['coord'][3].get('endY') * -4))):
			data_vertex.append(dicList['nodes'][element]['id'])
			data_node.append(dicList['nodes'][element])
	sys.stdout.write(json.dumps(data_node))
	sys.stdout.write(",\"edges\":")
	for element in range(0, length2-1):
		if(dicList_edges['edges'][element]['sourceID'] in data_vertex
			and dicList_edges['edges'][element]['targetID'] in data_vertex):
			data_edges.append(dicList_edges['edges'][element])
	sys.stdout.write(json.dumps(data_edges))
	sys.stdout.write("}")