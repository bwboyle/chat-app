import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import io from 'socket.io-client';
import MessageBox from './MessageBox';

const socket = io('http://localhost:8080');

export default function Chat({ user, messages }) {
   const [message, setMessage] = useState('');
   const ref = useRef(null);

   // Automatically scroll to bottom of chat list
   useEffect(() => {
      const container = ref.current;
      if (container && messages.length > 0) {
         container.scrollTop = container.scrollHeight;
      }
   }, [messages])


   const sendMessage = () => {
      if (message.trim()) {
         socket.emit('sendMessage', { user, message });
         setMessage('');
      }
   }

   return (
      <Box p={4} sx={{ overflowY: 'hidden' }}>

         {/* Chat history */}
         < Box
            ref={ref}
            sx={{
               display: 'flex',
               flexDirection: 'column',
               height: '65vh',
               overflowY: 'scroll',
               '::-webkit-scrollbar': { // Hide scrollbar
                  display: 'none',
               },
               msOverflowStyle: 'none',  // IE and Edge
               scrollbarWidth: 'none',   // Firefox
            }}
         >
            {
               messages.map((msg, index) => (
                  <MessageBox key={index} msg={msg} user={user} />
               ))
            }
         </Box >

         {/* Message input */}
         < TextField
            label='Type a message...'
            variant='filled'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
            InputProps={{
               endAdornment: (
                  <>
                     <InputAdornment position='end'>
                        <IconButton>
                           <AttachFileIcon />
                        </IconButton>
                     </InputAdornment>
                     <InputAdornment position='end'>
                        <IconButton onClick={sendMessage}>
                           <SendIcon />
                        </IconButton>
                     </InputAdornment>
                  </>
               ),
               disableUnderline: true,
               sx: {
                  borderRadius: '20px',  // Adjust the value as needed
               },
            }}
            sx={{ marginTop: '50px', borderRadius: '20px' }}
            fullWidth
         />
      </Box >
   )
}
