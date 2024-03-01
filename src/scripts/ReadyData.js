class Graph {
  constructor() {
    this.nodes = {};
  }

  addNode(name, neighbors) {
    this.nodes[name] = neighbors;
  }
}

function dijkstra(graph, startNode) {
  const distances = {};
  const priorityQueue = new PriorityQueue();

  // Ініціалізація відстаней
  for (let node in graph.nodes) {
    distances[node] = node === startNode ? 0 : Infinity;
    priorityQueue.enqueue(node, distances[node]);
  }

  while (!priorityQueue.isEmpty()) {
    const currentNode = priorityQueue.dequeue();

    for (let neighbor in graph.nodes[currentNode]) {
      const cost = graph.nodes[currentNode][neighbor];
      const newDistance = distances[currentNode] + cost;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        priorityQueue.enqueue(neighbor, newDistance);
      }
    }
  }

  return distances;
}

class PriorityQueue {
  constructor() {
    this.nodes = [];
  }

  enqueue(node, priority) {
    this.nodes.push({ node, priority });
    this.sort();
  }

  dequeue() {
    return this.nodes.shift().node;
  }

  sort() {
    this.nodes.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return !this.nodes.length;
  }
}

function runReadyDijkstra() {
  const selectedNode = $('#startNode').val();
  const graph = new Graph();

  // Замініть на свої дані графа тут
  graph.addNode('A', { B: 3, C: 7 });
  graph.addNode('B', { A: 2, C: 1, D: 5 });
  graph.addNode('C', { A: 4, B: 2, D: 6 });
  graph.addNode('D', { B: 4, C: 1 });


  const result = dijkstra(graph, selectedNode);

  // Виведення результату у текстове поле
  $('#resultReadyData').val(JSON.stringify(result, null, 2));
}
