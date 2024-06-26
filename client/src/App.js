import React, { useState, useEffect } from 'react'
import Chat from './components/Chat'
import Login from './components/Login';
import Navbar from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

import { useSelector, useDispatch } from 'react-redux'
import { login, update, updateUser } from './features/authSlice';

export default function App() {
   const user = useSelector((state) => state.auth.user);
   const dispatch = useDispatch();

   const savedTheme = localStorage.getItem('isDarkMode');
   const useDarkMode = savedTheme ? savedTheme === 'true' ? true : false : true;
   const [isDarkMode, setisDarkMode] = useState(useDarkMode);

   useEffect(() => {
      const fetchUser = async () => {
         await fetch('http://localhost:8080/api/auth/user', {
            method: 'GET',
            credentials: 'include'
         })
            .then(res => res.json())
            .then(data => dispatch(login(data.user)))
            .catch(err => console.error(err))
      };
      fetchUser();
   }, []);

   const changeTheme = () => {
      localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode))
      setisDarkMode(!isDarkMode);
      // const theme = !isDarkMode ? 'dark' : 'light'
      // localStorage.setItem('theme', JSON.stringify(theme));

   }

   return (
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
         <CssBaseline />
         <>
            <Box sx={{ flexGrow: 1 }}>
               <Navbar
                  onThemeChange={changeTheme}
                  isDarkMode={isDarkMode}
               />
               {!user ? <Login /> : <Chat />}
            </Box>
            {/* <Navbar
               onThemeChange={() => setisDarkMode(!isDarkMode)}
               isDarkMode={isDarkMode}
            /> */}
         </>
         {/* {!user ? <Login /> :
            <>
               <Navbar
                  onThemeChange={() => setisDarkMode(!isDarkMode)}
                  isDarkMode={isDarkMode}
               />
               <Chat user={user} />
            </>
         } */}
      </ThemeProvider>
   )
}
