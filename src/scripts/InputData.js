class InputGraph {
  constructor() {
    this.nodes = {};
  }

  addNode(name, neighbors) {
    this.nodes[name] = neighbors;
  }
}

class InputPriorityQueue {
  constructor() {
    this.nodes = [];
  }

  enqueue(node, priority) {
    const existingNode = this.nodes.find(n => n.node === node);

    if (existingNode) {
      if (priority < existingNode.priority) {
        existingNode.priority = priority;
        this.sort();
      }
    } else {
      this.nodes.push({ node, priority });
      this.sort();
    }
  }

  dequeue() {
    return this.nodes.shift();
  }

  sort() {
    this.nodes.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return !this.nodes.length;
  }
}


function parseGraph(inputData) {
  const graph = new InputGraph();

  const lines = inputData.split('\n');
  for (const line of lines) {
    const matchWithNode = line.match(/^Node (\w+):(.*)$/);
    const matchWithoutNode = line.match(/^(\w+):(.*)$/);

    let match;
    if (matchWithNode) {
      match = matchWithNode;
    } else if (matchWithoutNode) {
      match = matchWithoutNode;
    } else {
      console.error(`Invalid line format: ${line}`);
      continue;
    }

    const nodeName = match[1].trim();
    const neighbors = {};

    const edges = match[2].split(',');
    for (const edge of edges) {
      const [neighbor, cost] = edge.split(':');
      if (!neighbor || !cost) {
        console.error(`Invalid edge format in line: ${line}, edge: ${edge}`);
        continue;
      }

      neighbors[neighbor.trim()] = parseInt(cost.trim(), 10);
    }

    // Додайте цей код для ініціалізації відстаней до сусідів
    for (const neighbor in neighbors) {
      if (neighbors.hasOwnProperty(neighbor)) {
        if (!graph.nodes[neighbor]) {
          graph.nodes[neighbor] = {};
        }
        if (!graph.nodes[nodeName]) {
          graph.nodes[nodeName] = {};
        }
        if (graph.nodes[neighbor][nodeName] === undefined) {
          graph.nodes[neighbor][nodeName] = Infinity;
        }
        if (graph.nodes[nodeName][neighbor] === undefined) {
          graph.nodes[nodeName][neighbor] = Infinity;
        }
      }
    }

    graph.addNode(nodeName, neighbors);
  }

  return graph;
}





function runDijkstra(inputId, outputId) {
  const inputData = $(`#${inputId}`).val();
  const graph = parseGraph(inputData);
  const startNode = $('#startNode').val();
  const result = dijkstra(graph, startNode);

  $(`#${outputId}`).val(JSON.stringify(result, null, 2));
}



function dijkstra(graph, startNode) {
  const distances = {};
  const priorityQueue = new InputPriorityQueue();

  for (let node in graph.nodes) {
    distances[node] = node === startNode ? 0 : Infinity;
    priorityQueue.enqueue(node, distances[node]);
  }

  while (!priorityQueue.isEmpty()) {
    const { node: currentNode, priority: currentDistance } = priorityQueue.dequeue();
    console.log(`Processing node: ${currentNode}, Distance: ${currentDistance}`);

    for (let neighbor in graph.nodes[currentNode]) {
      if (graph.nodes[currentNode].hasOwnProperty(neighbor)) {
        const cost = graph.nodes[currentNode][neighbor];
        const newDistance = currentDistance + cost;

        console.log(`  Checking neighbor: ${neighbor}, Current Distance: ${distances[neighbor]}, New Distance: ${newDistance}`);

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          priorityQueue.enqueue(neighbor, newDistance);
          console.log(`    Updated distance for ${neighbor}: ${newDistance}`);
        }
      }
    }
  }

  console.log(distances);
  return distances;
}
