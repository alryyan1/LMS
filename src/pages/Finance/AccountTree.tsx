import React from 'react';
import { Tree } from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'

function AccountTree({ data, onNodeClick }) {
  const customPathFunc = (start, end) => {
    return `M${start.x},${start.y} L${end.x},${end.y + 50}`; // Increase Y distance by 50px
  };
  return (
      <Tree
        data={data}
        height={800}
        width={window.innerWidth - 500}
        nodeRadius={10}
        direction='rtl'
        animated={true}
        keyProp='id'
        labelProp='name'
        textProps={{ dy: '-5',dx:'10' }}  // Moves text label above the node
        
        gProps={{
       
          onClick: (event, nodeData) => onNodeClick(nodeData),
          onContextMenu: function noRefCheck() {},
        }}
      />
  );
}

export default AccountTree;