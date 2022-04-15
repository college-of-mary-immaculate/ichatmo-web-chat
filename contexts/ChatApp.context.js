import React, { createContext, useReducer, useEffect } from "react";
import { io } from "socket.io-client";

let socket = io();

const actions = {
  SET_USER_INFO: "SET_USER_INFO",
  TOGGLE_NEW_CHAT_POPUP: "TOGGLE_NEW_CHAT_POPUP",
  TOGGLE_NEW_GROUP_POPUP: "TOGGLE_NEW_GROUP_POPUP",
  TOGGLE_PROFILE_POPUP: "TOGGLE_PROFILE_POPUP",
  SHOW_CHATBOX: "SHOW_CHATBOX",
  TOGGLE_CHATMENU: "TOGGLE_CHATMENU",
  SET_CONVERSATIONS: "SET_CONVERSATIONS",
  SET_USER_SEARCHED_LIST: "SET_USER_SEARCHED_LIST",
  SET_ROOM_SEARCHED_LIST: "SET_ROOM_SEARCHED_LIST",
  SET_CHATS: "SET_CHATS",
  EMPTY_CHATS: "EMPTY_CHATS",
  EMPTY_CONVERSATIONS: "EMPTY_CONVERSATIONS",
  SET_SELECTED_ROOM: "SET_SELECTED_ROOM",
  SET_ROOM_HEADER: "SET_ROOM_HEADER",
  SET_ACTIVE_CONVERSATIONS_TAB: "SET_ACTIVE_CONVERSATIONS_TAB",
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

    case actions.TOGGLE_PROFILE_POPUP:
      return {
        ...state,
        profilePopupOpen: !state.profilePopupOpen,
      };

    case actions.SHOW_CHATBOX:
      return {
        ...state,
        chatBoxOpen: action.show,
      };

    case actions.TOGGLE_CHATMENU:
      return {
        ...state,
        chatMenuOpen: !state.chatMenuOpen,
      };

    case actions.SET_CONVERSATIONS:
      return {
        ...state,
        conversationList: [
          ...action.conversations,
          ...state.conversationList.filter(
            (conversation) => conversation._id !== action.conversations[0]._id
          ),
        ],
      };

    case actions.SET_USER_SEARCHED_LIST:
      return {
        ...state,
        userSearchedList: [...action.users],
      };

    case actions.SET_ROOM_SEARCHED_LIST:
      return {
        ...state,
        roomSearchedList: [
          ...action.rooms,
          ...state.roomSearchedList.filter((room) => {
            let list = action.rooms.map((room) => room._id);
            if (!list.includes(room._id) && list.includes(room._id)) {
              return true;
            }
            return false;
          }),
        ],
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

    case actions.EMPTY_CONVERSATIONS:
      return {
        ...state,
        conversationList: [],
      };

    case actions.SET_SELECTED_ROOM:
      return {
        ...state,
        selectedRoom: action.selected,
      };

    case actions.SET_ACTIVE_CONVERSATIONS_TAB:
      return {
        ...state,
        activeConversationsTab: action.tab,
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
    userInfo: {},
    newChatPopupOpen: false,
    newGroupPopupOpen: false,
    profilePopupOpen: false,
    chatBoxOpen: false,
    chatMenuOpen: false,
    conversationList: [],
    chatList: [],
    userSearchedList: [],
    roomSearchedList: [],
    socketConn: socket,
    selectedChat: null,
    roomHeader: { name: "", image: "", username: "", members: [] },
    activeConversationsTab: "",
  });

  const value = {
    userInfo: state.userInfo,
    newChatPopupOpen: state.newChatPopupOpen,
    newGroupPopupOpen: state.newGroupPopupOpen,
    profilePopupOpen: state.profilePopupOpen,
    chatBoxOpen: state.chatBoxOpen,
    chatMenuOpen: state.chatMenuOpen,
    conversationList: state.conversationList,
    chatList: state.chatList,
    userSearchedList: state.userSearchedList,
    roomSearchedList: state.roomSearchedList,
    selectedRoom: state.selectedRoom,
    roomHeader: state.roomHeader,
    activeConversationsTab: state.activeConversationsTab,
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
    toggleProfilePopup: () => {
      dispatch({ type: actions.TOGGLE_PROFILE_POPUP });
    },
    showChatBox: (show) => {
      dispatch({ type: actions.SHOW_CHATBOX, show });
    },
    toggleChatMenu: () => {
      dispatch({ type: actions.TOGGLE_CHATMENU });
    },
    setConversations: (conversations) => {
      dispatch({ type: actions.SET_CONVERSATIONS, conversations });
    },
    setUserSearched: (users) => {
      dispatch({ type: actions.SET_USER_SEARCHED_LIST, users });
    },
    setRoomSearched: (rooms) => {
      dispatch({ type: actions.SET_ROOM_SEARCHED_LIST, rooms });
    },
    setChats: (chats) => {
      dispatch({ type: actions.SET_CHATS, chats });
    },
    emptyChats: () => {
      dispatch({ type: actions.EMPTY_CHATS });
    },
    emptyConversations: () => {
      dispatch({ type: actions.EMPTY_CONVERSATIONS });
    },
    setSelectedRoom: (selected) => {
      dispatch({ type: actions.SET_SELECTED_ROOM, selected });
    },
    setRoomHeader: (header) => {
      dispatch({ type: actions.SET_ROOM_HEADER, header });
    },
    setActiveConversationsTab: (tab) => {
      dispatch({ type: actions.SET_ACTIVE_CONVERSATIONS_TAB, tab });
    },
    // setSocketConn: (socket) => {
    //   dispatch({ type: actions.SET_SOCKET_CONN, socket });
    // },
  };

  useEffect(() => {
    fetch("/api/socket").then(() => {
      // socket = io();
      state.socketConn = socket;
      state.socketConn.connect();
      state.socketConn.on("connect", () => {
        console.log("connected");
      });
    });

    return () => {
      state.socketConn.disconnect();
    };
  }, []);

  return (
    <ChatAppContext.Provider value={value}>{children}</ChatAppContext.Provider>
  );
}
