import React, { createContext, useReducer } from "react";
import io from "socket.io-client";

const actions = {
  SET_USER_INFO: "SET_USER_INFO",
  TOGGLE_NEW_CHAT_POPUP: "TOGGLE_NEW_CHAT_POPUP",
  TOGGLE_NEW_GROUP_POPUP: "TOGGLE_NEW_GROUP_POPUP",
  SET_CONVERSATION_LIST: "SET_CONVERSATION_LIST",
  SET_USER_SEARCHED_LIST: "SET_USER_SEARCHED_LIST",
  SET_CHATS: "SET_CHATS",
  EMPTY_CHATS: "EMPTY_CHATS",
  SET_SELECTED_ROOM: "SET_SELECTED_ROOM",
  SET_ROOM_HEADER: "SET_ROOM_HEADER",
  // SET_SOCKET_CONN: "SET_SOCKET_CONN",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...action.userProperties,
        },
      };

    case actions.TOGGLE_NEW_CHAT_POPUP:
      return {
        ...state,
        newChatPopupOpen: !state.newChatPopupOpen,
      };

    case actions.TOGGLE_NEW_GROUP_POPUP:
      return {
        ...state,
        newGroupPopupOpen: !state.newGroupPopupOpen,
      };

    case actions.SET_CONVERSATION_LIST:
      return {
        ...state,
        conversationList: [...action.conversations],
      };

    case actions.SET_USER_SEARCHED_LIST:
      return {
        ...state,
        userSearchedList: [...action.users],
      };

    case actions.SET_CHATS:
      return {
        ...state,
        chatList: [...state.chatList, ...action.chats],
      };

    case actions.EMPTY_CHATS:
      return {
        ...state,
        chatList: [],
      };

    case actions.SET_SELECTED_ROOM:
      return {
        ...state,
        selectedRoom: action.selected,
      };

    case actions.SET_ROOM_HEADER:
      return {
        ...state,
        roomHeader: { ...state.roomHeader, ...action.header },
      };

    // case actions.SET_SOCKET_CONN:
    //   console.log(action.socket);
    //   return {
    //     ...state,
    //     socketConn: action.socket,
    //   };

    default:
      return state;
  }
};

export const ChatAppContext = createContext();

export function ChatAppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    userInfo: {
      id: "",
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      image: "",
    },
    newChatPopupOpen: false,
    newGroupPopupOpen: false,
    conversationList: [],
    chatList: [],
    userSearchedList: [],
    socketConn: io(),
    selectedChat: null,
    roomHeader: { name: "", image: "", username: "" },
  });

  const value = {
    userInfo: state.userInfo,
    newChatPopupOpen: state.newChatPopupOpen,
    newGroupPopupOpen: state.newGroupPopupOpen,
    conversationList: state.conversationList,
    chatList: state.chatList,
    userSearchedList: state.userSearchedList,
    socket: state.socketConn,
    selectedRoom: state.selectedRoom,
    roomHeader: state.roomHeader,
    setUserInfo: (userProperties) => {
      dispatch({ type: actions.SET_USER_INFO, userProperties });
    },
    toggleNewChatPopup: () => {
      dispatch({ type: actions.TOGGLE_NEW_CHAT_POPUP });
    },
    toggleNewGroupPopup: () => {
      dispatch({ type: actions.TOGGLE_NEW_GROUP_POPUP });
    },
    setConversations: (conversations) => {
      dispatch({ type: actions.SET_CONVERSATION_LIST, conversations });
    },
    setUserSearched: (users) => {
      dispatch({ type: actions.SET_USER_SEARCHED_LIST, users });
    },
    setChats: (chats) => {
      dispatch({ type: actions.SET_CHATS, chats });
    },
    emptyChats: () => {
      dispatch({ type: actions.EMPTY_CHATS });
    },
    setSelectedRoom: (selected) => {
      dispatch({ type: actions.SET_SELECTED_ROOM, selected });
    },
    setRoomHeader: (header) => {
      dispatch({ type: actions.SET_ROOM_HEADER, header });
    },
    // setSocketConn: (socket) => {
    //   dispatch({ type: actions.SET_SOCKET_CONN, socket });
    // },
  };

  return (
    <ChatAppContext.Provider value={value}>{children}</ChatAppContext.Provider>
  );
}
