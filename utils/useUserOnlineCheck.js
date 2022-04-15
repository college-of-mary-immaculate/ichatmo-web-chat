import { useState, useEffect, useContext } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";

export default function useUserOnlineCheck(client, userId) {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useContext(ChatAppContext);

  useEffect(() => socketHandler(), [userId]);
  useEffect(() => {
    socket.emit("user-online-check", {
      client,
      toCheckId: userId,
    });
  }, [userId]);

  function socketHandler() {
    const onlineUpdater = (id) => {
      if (userId == id) {
        socket.emit("user-online-check", {
          client,
          toCheckId: userId,
        });
      }
    };

    const onlineToggler = (result) => {
      if (result.toCheckId == userId) {
        setIsOnline(result.isOnline);
      }
    };

    socket.on("user-connect", onlineUpdater);
    socket.on("user-disconnect", onlineUpdater);
    socket.on("user-is-online", onlineToggler);

    return () => {
      socket.off("user-connect", onlineUpdater);
      socket.off("user-disconnect", onlineUpdater);
      socket.off("user-is-online", onlineToggler);
    };
  }

  return [isOnline];
}
