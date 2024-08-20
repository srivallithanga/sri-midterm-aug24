import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', 
            dark: '#115293', 
        },
        secondary: {
            main: '#dc004e', 
        },
    },
    shape: {
        borderRadius: 4, 
    },
});

export default theme;
