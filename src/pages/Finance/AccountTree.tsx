import React from 'react';
import { Tree, NodeModel, DragSourcePosition } from '@minoru/react-dnd-treeview';
import { Box, Typography, Paper } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

function AccountTree({ data, onNodeClick }) {
  const [treeData, setTreeData] = React.useState([]);
  const [useCustomTree, setUseCustomTree] = React.useState(false);

  // Convert the data structure to the format expected by the tree library
  React.useEffect(() => {
    if (!data || !data.children) {
      console.log('No data available for tree');
      return;
    }

    try {
      const convertData = (nodes, parentId = null) => {
        let result = [];
        nodes.children?.forEach((node, index) => {
          const treeNode = {
            id: node.id?.toString() || `node-${index}`,
            parent: parentId,
            droppable: node.children && node.children.length > 0,
            text: node.name,
            data: {
              code: node.code,
              description: node.description,
              ...node
            }
          };
          result.push(treeNode);
          
          if (node.children && node.children.length > 0) {
            result = result.concat(convertData(node, treeNode.id));
          }
        });
        return result;
      };

      const converted = convertData(data);
      console.log('Converted tree data:', converted);
      setTreeData(converted);
    } catch (error) {
      console.error('Error converting tree data:', error);
      setUseCustomTree(true);
    }
  }, [data]);

  const handleDrop = (newTree, { dragSourceId, dropTargetId }) => {
    setTreeData(newTree);
  };

  const handleSelect = (node) => {
    if (node?.data && node.data.id) {
      onNodeClick(node.data.id);
    }
  };

  const CustomNode = ({ node, depth, isOpen, onToggle, onSelect }) => {
    // Add error handling for undefined node
    if (!node) {
      console.error('Node is undefined in CustomNode');
      return null;
    }

    const hasChildren = node.droppable;
    
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 2,
          px: 2,
          ml: depth * 4,
          mb: 1,
          borderRadius: 2,
          cursor: 'pointer',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'action.hover',
            borderColor: 'primary.main',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
          transition: 'all 0.2s ease-in-out',
          minHeight: 60,
        }}
        onClick={() => onSelect(node)}
      >
        {hasChildren && (
          <Box 
            sx={{ 
              mr: 1.5, 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isOpen ? (
              <ExpandMore sx={{ fontSize: 24, color: 'primary.main' }} />
            ) : (
              <ChevronRight sx={{ fontSize: 24, color: 'text.secondary' }} />
            )}
          </Box>
        )}
        
        {!hasChildren && (
          <Box sx={{ mr: 1.5, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
              }}
            />
          </Box>
        )}
        
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: hasChildren ? 600 : 500,
              color: hasChildren ? 'text.primary' : 'text.secondary',
              fontSize: hasChildren ? '1rem' : '0.9rem',
            }}
          >
            {node.text}
          </Typography>
          {node.data?.code && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
                mt: 0.5,
                fontSize: '0.75rem',
              }}
            >
              {node.data.code}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  // Fallback custom tree implementation
  const CustomTreeImplementation = () => {
    const [expandedNodes, setExpandedNodes] = React.useState(new Set(['root']));

    const toggleNode = (nodeId) => {
      const newExpanded = new Set(expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      setExpandedNodes(newExpanded);
    };

    const renderTreeNode = (node, level = 0) => {
      const nodeId = node.id?.toString() || 'root';
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(nodeId);

      return (
        <Box key={nodeId} sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1.5,
              px: 2,
              ml: level * 3,
              borderRadius: 1,
              cursor: 'pointer',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.main',
              },
              transition: 'all 0.2s ease-in-out',
            }}
            onClick={() => {
              if (hasChildren) {
                toggleNode(nodeId);
              }
              if (node.id) {
                onNodeClick(node.id);
              }
            }}
          >
            {hasChildren && (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                {isExpanded ? (
                  <ExpandMore sx={{ fontSize: 20, color: 'primary.main' }} />
                ) : (
                  <ChevronRight sx={{ fontSize: 20, color: 'text.secondary' }} />
                )}
              </Box>
            )}
            {!hasChildren && (
              <Box sx={{ mr: 1, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                  }}
                />
              </Box>
            )}
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: hasChildren ? 600 : 500 }}>
                {node.name}
              </Typography>
              {node.code && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {node.code}
                </Typography>
              )}
            </Box>
          </Box>

          {hasChildren && isExpanded && (
            <Box
              sx={{
                ml: 3,
                pl: 2,
                borderLeft: '1px dashed rgba(0, 0, 0, 0.2)',
                mt: 1,
              }}
            >
              {node.children.map((child) => renderTreeNode(child, level + 1))}
            </Box>
          )}
        </Box>
      );
    };

    return (
      <Box>
        {renderTreeNode(data)}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        p: 3,
        backgroundColor: 'background.default',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        '& .tree-root': {
          padding: 0,
          margin: 0,
        },
        '& .dragging-source': {
          opacity: 0.5,
        },
        '& .drop-target': {
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          border: '2px dashed #1976d2',
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          pb: 2,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          color: 'primary.main',
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        شجره الحسابات
      </Typography>
      
      {useCustomTree || !treeData.length ? (
        <CustomTreeImplementation />
      ) : (
        <Tree
          tree={treeData}
          rootId={null}
          render={CustomNode}
          onDrop={handleDrop}
          classes={{
            root: 'tree-root',
            draggingSource: 'dragging-source',
            dropTarget: 'drop-target',
          }}
          sort={false}
          insertDroppableFirst={false}
          canDrop={(tree, { dragSource, dropTarget }) => {
            return false; // Disable drag and drop for now
          }}
          dragPreviewRender={(monitorProps) => (
            <Box
              sx={{
                opacity: 0.8,
                backgroundColor: 'primary.main',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 1,
                fontSize: '0.875rem',
              }}
            >
              {monitorProps.item.text}
            </Box>
          )}
        />
      )}
    </Box>
  );
}

export default AccountTree;