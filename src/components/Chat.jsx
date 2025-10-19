import { useState } from "react";

function Chat({ isShow }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo, Ada yang bisa kami bantu?",
      sender: "admin",
      time: "10:00",
    },
    {
      id: 2,
      text: "Saya kesulitan mencari kopi",
      sender: "user",
      time: "10:01",
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  if (!isShow) return null;

  return (
    <div className="fixed bottom-24 z-100 right-5 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF8906] to-[#FFB347] rounded-t-2xl w-full h-5"></div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 overflow-hidden bg-white rounded-full">
            <img
              className="object-cover w-full h-full"
              src="/img/empty-photo-profile.jpeg"
              alt="Admin"
            />
          </div>
          <div className="text-[#0B132A]">
            <h3 className="text-lg font-semibold">Maria Angela</h3>
            <p className="text-[#FF8906] text-sm opacity-90">Admin Support</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-gray-50">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}>
              {msg.sender === "admin" && (
                <div className="flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <img
                    className="object-cover w-full h-full"
                    src="/img/empty-photo-profile.jpeg"
                    alt="Admin"
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-white text-gray-800 rounded-br-sm"
                    : "bg-gray-200 text-gray-800 rounded-bl-sm"
                }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#FF8906] transition"
          />
          <button
            type="submit"
            className="bg-[#FF8906] p-3 rounded-full hover:bg-[#FF9D26] transition flex items-center justify-center w-12 h-12 flex-shrink-0">
            <img src="/public/icon/icon-send.svg" alt="Icon Send" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
