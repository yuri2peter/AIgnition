interface BasicTreeNode {
  id: string;
  children: string[];
}

export function getNodeById<T extends BasicTreeNode>(tree: T[], id: string) {
  return tree.find((t) => t.id === id);
}

export function getParentNode<T extends BasicTreeNode>(tree: T[], node: T) {
  return tree.find((t) => t.children.includes(node.id));
}

export function getAncestorsNodes<T extends BasicTreeNode>(tree: T[], node: T) {
  const ancestorsNodes: T[] = [];
  let parentNode = getParentNode(tree, node);
  while (parentNode) {
    ancestorsNodes.unshift(parentNode);
    parentNode = getParentNode(tree, parentNode);
  }
  return ancestorsNodes;
}

export function getChildrenNodes<T extends BasicTreeNode>(tree: T[], node: T) {
  return node.children.map((t) => getNodeById(tree, t)).filter(Boolean);
}

export function getDescendantsNodes<T extends BasicTreeNode>(
  tree: T[],
  node: T
) {
  const descendantsNodes: T[] = [];
  const traversal = (node: T) => {
    const childrenNodes = getChildrenNodes(tree, node);
    childrenNodes.forEach((t) => {
      descendantsNodes.push(t);
      traversal(t);
    });
  };
  traversal(node);
  return descendantsNodes;
}

export function getCurrentTreeNodeRelated<T extends BasicTreeNode>(
  tree: T[],
  currentNode: T
) {
  const parentNode = getParentNode(tree, currentNode);
  const parentChildrenIndex =
    parentNode?.children.indexOf(currentNode.id) ?? -1;
  return {
    currentNode,
    parentNode,
    parentChildrenIndex,
    ancestorsNodes: getAncestorsNodes(tree, currentNode),
    childrenNodes: getChildrenNodes(tree, currentNode),
    descendantsNodes: getDescendantsNodes(tree, currentNode),
  };
}

export function changeNodeId<T extends BasicTreeNode>(
  tree: T[],
  node: T,
  newId: string
) {
  const parent = getParentNode(tree, node);
  if (parent) {
    parent.children = parent.children.map((t) => (t === node.id ? newId : t));
  }
  node.id = newId;
}

// delete node and its descendants, returns the new tree
export function deleteNode<T extends BasicTreeNode>(tree: T[], node: T) {
  const parent = getParentNode(tree, node);
  const descendantsNodes = getDescendantsNodes(tree, node);
  if (parent) {
    parent.children = parent.children.filter((t) => t !== node.id);
  }
  return tree.filter((t) => t !== node && !descendantsNodes.includes(t));
}

// dfs traversal
export function dfsTraversal<T extends BasicTreeNode>(
  tree: T[],
  node: T,
  action: (node: T) => void
) {
  action(node);
  node.children.forEach((t) => {
    const childNode = getNodeById(tree, t);
    childNode && dfsTraversal(tree, childNode, action);
  });
}
