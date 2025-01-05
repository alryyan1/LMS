import React, { useEffect, useState } from 'react'
import { socket } from './socket';
import { toast } from 'react-toastify';

function SocketLayer() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    function onConnect() {
      setIsConnected(true);
    }
  
    function onDisconnect() {
      setIsConnected(false);
    }
  
    useEffect(() => {
        socket.on("disconnect", onDisconnect);
        socket.on("connect", onConnect);
    
        socket.on("connect", (args) => {
          // alert('connected')
          console.log("reception connected succfully with id" + socket.id, args);
          toast.success("Socket connected successfully");
        });
    
        return () => {
          socket.off("connect", onConnect);
          socket.off("disconnect", onConnect);
        };
      });
  return (
    <div>SocketLayer</div>
  )
}

export default SocketLayer