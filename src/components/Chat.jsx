function Chat({ isShow }) {
  if (isShow) {
    return (
      <div className="absolute top-0 p-5 bg-white border-t-15 border-t-[#FF8906] h-100 w-100 rounded-xl shadow-xl">
        Chat
      </div>
    );
  }
  return;
}

export default Chat;
