import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainLayout } from "../components";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003da5", //"#fd9b28"
    },
    secondary: {
      main: green[500],
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {},
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "0.1px solid #d3d3d3",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {},
      },
    },
  },
  typography: {
    button: {
      textTransform: "capitalize",
    },
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        preventDuplicate
        autoHideDuration={5000}
      >
        {/* <ScrollToTop> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MainLayout />
        </LocalizationProvider>
        {/* </ScrollToTop> */}
      </SnackbarProvider>
    </ThemeProvider>
  );
};
