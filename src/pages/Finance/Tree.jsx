import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";

function App() {
  const handleDrop = (newTree) => {
    console.log("Dropped", newTree);
    setTreeData(newTree)
  };
  const initialTree = [
    { id: 1, parent: 0, droppable: true, text: 'Item 1' },
    { id: 2, parent: 1, droppable: false, text: 'Item 1.1' },
    { id: 3, parent: 1, droppable: false, text: 'Item 1.2' },
    { id: 4, parent: 0, droppable: true, text: 'Item 2' },
  ];
  const [treeData, setTreeData] = useState(initialTree);
  const handleTextChange = (id, newText) => {
    const updatedTree = treeData.map(node =>
      node.id === id ? { ...node, text: newText } : node
    );
    setTreeData(updatedTree);
  };
  return (
    <div className="app">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <div style={{ marginInlineStart: depth * 10 }}>
            <span onClick={onToggle}>{isOpen ? '[-]' : '[+]'} </span>
            <input
              type="text"
              value={node.text}
              onChange={(e) => handleTextChange(node.id, e.target.value)}
            />
          </div>
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleDrop}
        />
      </DndProvider>
    </div>
  );
}

export default App;
