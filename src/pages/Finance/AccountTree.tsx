import React from 'react';
import { Tree } from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'

function AccountTree({ data, onNodeClick }) {

  return (
      <Tree
        data={data}
        height={800}
        width={800}
        nodeRadius={10}
        direction='rtl'
        animated={true}
        keyProp='id'
        textProps={{ dy: '-5',dx:'10' }}  // Moves text label above the node

        gProps={{
       
          onClick: (event, nodeData) => onNodeClick(nodeData),
          onContextMenu: function noRefCheck() {},
        }}
      />
  );
}

export default AccountTree;