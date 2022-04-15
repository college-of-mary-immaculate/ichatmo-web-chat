import { useState, useEffect, useContext } from "react";
import { ChatAppContext } from "../contexts/ChatApp.context";

export default function useRoomOnlineCheck(client, members) {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useContext(ChatAppContext);

  useEffect(() => socketHandler(), [members]);
  useEffect(() => {
    socket.emit("room-online-check", {
      client,
      toCheckIds: members,
    });
  }, [members]);

  function socketHandler() {
    const onlineUpdater = (id) => {
      if (members.includes(id)) {
        socket.emit("room-online-check", {
          client,
          toCheckIds: members,
        });
      }
    };

    const onlineToggler = (result) => {
      if (JSON.stringify(result.toCheckIds) == JSON.stringify(members)) {
        setIsOnline(result.isOnline);
      }
    };

    socket.on("user-connect", onlineUpdater);
    socket.on("user-disconnect", onlineUpdater);
    socket.on("room-is-online", onlineToggler);

    return () => {
      socket.off("user-connect", onlineUpdater);
      socket.off("user-disconnect", onlineUpdater);
      socket.off("room-is-online", onlineToggler);
    };
  }

  return [isOnline];
}
