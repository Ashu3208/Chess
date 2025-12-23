import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import UserContext from "../context/user";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        h1: {
            flex: 1,
            display: 'flex',
            paddingTop: '35vh',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
        },
    },
});

export default function Home() {
    const currUser = useContext(UserContext);

    return (
        <div>
            <ThemeProvider theme={theme}>
                {currUser.state.id ? (
                    <Typography
                        variant="h1"
                    >
                        Welcome {currUser.state.username}
                    </Typography>
                ) : (
                    <Typography
                        variant="h1"
                    >
                        Hey there!
                    </Typography>
                )}
            </ThemeProvider>
        </div>
    );
}
