interface FlatTreeNode {
  id: string;
  childrenIds: string[];
}

// find node's parents and children
export function findFlatRelatives<T extends FlatTreeNode>(
  nodes: T[],
  currentNodeId: string
) {
  const findParent = (currentNode: T, onFound: (node: T) => void) => {
    const nodeFound = nodes.find((t) => t.childrenIds.includes(currentNode.id));
    if (nodeFound) {
      onFound(nodeFound);
      findParent(nodeFound, onFound);
    }
  };

  const findChildren = (currentNode?: T) => {
    if (!currentNode) return [];
    const nodesFound = currentNode.childrenIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean);
    return nodesFound;
  };

  const current = nodes.find((t) => t.id === currentNodeId)!;
  const parents: T[] = [];
  findParent(current, (n) => parents.push(n));
  const parent = parents[0];
  const children = findChildren(current);
  const siblings = findChildren(parent);
  const selfInclusive = [current, ...children];

  return {
    current,
    parent,
    parents,
    children,
    siblings,
    selfInclusive,
  };
}
