import {Box} from "@mui/material"
function TestGroupChildren(props) {
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
          <Box  className=' mygrid' sx={{ p: 1 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  export default TestGroupChildren