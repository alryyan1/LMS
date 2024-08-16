import {Box} from "@mui/material"
function TabItem(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div 
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box  className='group' sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  export default TabItem