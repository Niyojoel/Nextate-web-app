import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { useGlobalContext } from "./useContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const {user} = useGlobalContext();
  const [socket, setSocket] = useState(null);

  useEffect(()=> {
    return setSocket(io("http://localhost:4000"));
  }, [])

  useEffect(()=> {
    user && socket?.emit("newUser", user._id)
  }, [user, socket])

  return (
    <SocketContext.Provider value={{socket}}>
        {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
