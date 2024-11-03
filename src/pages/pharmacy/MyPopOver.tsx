import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axiosClient from '../../../axios-client';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
interface BasicPopoverProps {
  title: string;
  route: string;
  item: object;
  isBox: boolean;
}
export default function BasicPopover({title,route,item,isBox
}:BasicPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [content,setContent] = React.useState([])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    axiosClient.get(`${route}/${item.id}`).then(({data})=>{
        setContent(data)
    })
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id}  onClick={handleClick}>
        {title}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Table style={{direction:'rtl'}} size='small'>
            <TableHead>
                <TableRow>
                    <TableCell>التاريخ</TableCell>
                    <TableCell>العدد</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { content.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{dayjs(new Date(item.created_at)).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{isBox ? item.box : item.quantity}</TableCell>
                    </TableRow>
                ))}
                {content.length == 0 && <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow>}
            </TableBody>
        </Table>
      </Popover>
    </div>
  );
}