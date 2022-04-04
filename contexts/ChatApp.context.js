import React, { createContext, useReducer } from "react";
import io from "socket.io-client";

const actions = {
  SET_USER_INFO: "SET_USER_INFO",
  TOGGLE_NEW_CHAT_POPUP: "TOGGLE_NEW_CHAT_POPUP",
  TOGGLE_NEW_GROUP_POPUP: "TOGGLE_NEW_GROUP_POPUP",
  SET_CONVERSATION_LIST: "SET_CONVERSATION_LIST",
  SET_USER_SEARCHED_LIST: "SET_USER_SEARCHED_LIST",
  SET_CHATS: "SET_CHATS",
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
        chatList: [...action.chats],
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
  });

  const value = {
    userInfo: state.userInfo,
    newChatPopupOpen: state.newChatPopupOpen,
    newGroupPopupOpen: state.newGroupPopupOpen,
    conversationList: state.conversationList,
    chatList: state.chatList,
    userSearchedList: state.userSearchedList,
    socket: state.socketConn,
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
    // setSocketConn: (socket) => {
    //   dispatch({ type: actions.SET_SOCKET_CONN, socket });
    // },
  };

  return (
    <ChatAppContext.Provider value={value}>{children}</ChatAppContext.Provider>
  );
}
