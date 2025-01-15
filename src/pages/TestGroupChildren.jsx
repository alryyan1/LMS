import {Box} from "@mui/material"
function TestGroupChildren(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div 
      style={{height:`${window.innerHeight - 150}px`,overflow:'auto'}}

        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box   className=' mygrid  ' sx={{ p: 1 ,borderRadius:'5px',overflow:'auto'}}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  export default TestGroupChildren