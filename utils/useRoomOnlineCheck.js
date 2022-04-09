import { useState, useEffect } from "react";

export default function useRoomOnlineCheck(client, members, socket) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => socketHandler(), []);
  useEffect(() => {
    socket.emit("room-online-check", {
      client,
      toCheckIds: members,
    });
  }, []);

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
