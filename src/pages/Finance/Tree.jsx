import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import React from 'react';
import { TextField } from '@mui/material';

function MyTree() {
  
    const longTree = { items:   {
        root: {
            
          index: 'root',
          canMove: true,
          isFolder: true,
          children: ['child1', 'child2'],
          data: 'Root item',
          canRename: true,

        },
        child1: {
          index: 'child1',
          canMove: true,
          isFolder: false,
          children: [],
          data: 'Child item 1',
          canRename: true,
        },
        child2: {
          index: 'child2',
          canMove: true,
          isFolder: true,
          children: ['child3'],
          data: 'Child item 2',
          canRename: true,
        },
        child3: {
            index: 'child3',
            canMove: true,
            isFolder: true,
            children: ['child4'],
            data: 'Child item 3',
            canRename: true,
        },
        child4: {
            index: 'child4',
            canMove: true,
            isFolder: false,
            children: [],
            data: 'Child item 4',
            canRename: true,
        }
      } }; // Define your longTree data

      const dataProvider = new StaticTreeDataProvider(longTree.items, (item, newName) => {
        // Return the patched item with new item name here
        return {
          ...item,
          data: { ...item },
        };
      });
      dataProvider.onDidChangeTreeData(changedItemIds => {
        console.log(changedItemIds);
      });
    return (
        <UncontrolledTreeEnvironment
        canDragAndDrop={true}
      
            dataProvider={dataProvider}
            getItemTitle={item => item.data}
            viewState={{}}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
    );
}

export default MyTree;

