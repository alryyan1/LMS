import React from 'react';
import { Typography, Box } from '@mui/material';
import { useDrag } from 'react-dnd';

const AccountItem = ({ account, onDrop }) => {

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'account', // Unique type for drag and drop
    item: { id: account.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // Handle drop
        console.log(`Dropped ${item.id} into ${dropResult.name}!`);
        onDrop(account.id)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px solid #ccc',
        padding: '8px',
        marginBottom: '4px',
      }}
    >
      <Typography variant="body1">{account.name}</Typography>
    </Box>
  );
};

export default AccountItem;