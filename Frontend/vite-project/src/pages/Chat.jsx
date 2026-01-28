import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance, authHeader, getToken } from "../services/api";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Chat() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const myId = user?.id;

 
  const [socket, setSocket] = useState(null);

  
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);


  const [activeRoom, setActiveRoom] = useState(null);
  const [activeOtherUser, setActiveOtherUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const activeRoomRef = useRef(null);

  
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  
  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const res = await axiosInstance.get("/api/chat/rooms", {
        headers: authHeader(),
      });
      setRooms(res.data.rooms || []);
    } catch (err) {
      toast.error("Failed to load chat list");
    } finally {
      setRoomsLoading(false);
    }
  };

  
  useEffect(() => {
    const s = io(SOCKET_URL, {
      auth: { token: getToken() },
    });

    s.on("connect", () => console.log(" socket connected", s.id));
    s.on("error_message", (msg) => toast.error(msg));

    s.on("receive_message", (msg) => {
      if (msg.roomId === activeRoomRef.current?._id) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchRooms();
    });

    setSocket(s);

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim() || search.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        const res = await axiosInstance.get(
          `/api/user/search?q=${encodeURIComponent(search)}`,
          { headers: authHeader() }
        );
        setSearchResults(res.data.users || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  
  const openRoom = async (room) => {
    try {
      setActiveRoom(room);
      setMessages([]);
      setLoadingMsgs(true);

      const other = room.members?.find((m) => m._id !== myId);
      setActiveOtherUser(other || null);

      socket?.emit("join_room", room._id);

      const msgRes = await axiosInstance.get(`/api/chat/messages/${room._id}`, {
        headers: authHeader(),
      });

      setMessages(msgRes.data.messages || []);
    } catch (err) {
      toast.error("Failed to open chat");
    } finally {
      setLoadingMsgs(false);
    }
  };

  
  const startChatWithUser = async (otherUser) => {
    try {
      const res = await axiosInstance.post(
        "/api/chat/room",
        { otherUserId: otherUser._id },
        { headers: authHeader() }
      );

      const room = res.data.room;

      await fetchRooms();

      openRoom({
        ...room,
        members: [
          otherUser,
          { _id: myId, name: user?.name, email: user?.email },
        ],
      });

      setSearch("");
      setSearchResults([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start chat");
    }
  };

  
  const sendMessage = () => {
    if (!activeRoom?._id) return toast.error("Select a chat first!");
    if (!text.trim()) return;

    socket?.emit("send_message", {
      roomId: activeRoom._id,
      text,
    });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
        Chat
      </h1>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
   
        <div className="bg-white border rounded-2xl shadow-sm p-4 md:col-span-1">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Search Users
          </p>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />

      
          <div className="mt-3">
            {searchLoading && (
              <p className="text-xs text-gray-500">Searching...</p>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div className="space-y-2 max-h-50 overflow-y-auto pr-1">
                {searchResults.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => startChatWithUser(u)}
                    className="w-full text-left p-3 rounded-xl border hover:bg-gray-50"
                  >
                    <p className="font-semibold text-gray-900 text-sm">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-600">{u.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <hr className="my-4" />

          <p className="text-sm font-semibold text-gray-800 mb-2">Chats</p>

          {roomsLoading ? (
            <p className="text-sm text-gray-600">Loading chats...</p>
          ) : rooms.length === 0 ? (
            <p className="text-sm text-gray-600">
              No chats yet. Search a user to start chat.
            </p>
          ) : (
            <div className="space-y-2 max-h-80 md:max-h-125 overflow-y-auto pr-1">
              {rooms.map((room) => {
                const other = room.members?.find((m) => m._id !== myId);
                const isActive = activeRoom?._id === room._id;

                return (
                  <button
                    key={room._id}
                    onClick={() => openRoom(room)}
                    className={`w-full text-left p-3 rounded-xl border ${
                      isActive
                        ? "bg-green-50 border-green-300"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-semibold text-gray-900 text-sm">
                      {other?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-600">{other?.email}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

       
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden md:col-span-2 flex flex-col h-[70vh] sm:h-[75vh]">
  
          <div className="px-4 sm:px-5 py-4 border-b flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {activeOtherUser ? activeOtherUser.name : "No chat selected"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {activeOtherUser
                  ? activeOtherUser.email
                  : "Choose a chat from left side"}
              </p>
            </div>

            <div className="text-xs text-gray-500 shrink-0 hidden sm:block">
              You: <b>{user?.name || "User"}</b>
            </div>
          </div>

         
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 bg-gray-50">
            {!activeRoom ? (
              <div className="h-full flex items-center justify-center text-center px-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    Start or select a conversation
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Search a user or open a chat from the list.
                  </p>
                </div>
              </div>
            ) : loadingMsgs ? (
              <p className="text-sm text-gray-600">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center px-4">
                <div>
                  <p className="font-semibold text-gray-800">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-1">Say Hi 👋</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => {
                  const isMe = m.sender === myId || m.sender?._id === myId;
                  const senderName = isMe
                    ? "You"
                    : m.sender?.name || activeOtherUser?.name || "User";

                  return (
                    <div
                      key={m._id}
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                          isMe
                            ? "bg-green-600 text-white rounded-br-sm"
                            : "bg-white text-gray-900 border rounded-bl-sm"
                        }`}
                      >
                        {!isMe && (
                          <p className="text-[11px] font-semibold text-gray-600 mb-1">
                            {senderName}
                          </p>
                        )}

                        <p className="text-sm whitespace-pre-wrap">{m.text}</p>

                        <div
                          className={`mt-1 text-[10px] ${
                            isMe ? "text-green-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(m.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          
          <div className="p-3 sm:p-4 border-t bg-white">
            <div className="flex gap-2 sm:gap-3 items-end">
              <textarea
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeRoom ? "Type a message..." : "Select a chat first..."
                }
                disabled={!activeRoom}
                className="flex-1 p-3 rounded-xl border outline-none resize-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm"
              />

              <button
                onClick={sendMessage}
                disabled={!activeRoom || !text.trim()}
                className="px-4 sm:px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                Send
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-2 hidden sm:block">
              Press <b>Enter</b> to send • <b>Shift + Enter</b> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
