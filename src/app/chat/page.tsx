'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Chat() {
  const [socket, setSocket] = useState<any>(undefined);
  const [chatList, setChatList] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    // 메시지 수신
    socket.on('message', (message) => {
      setChatList((prevChat) => [...prevChat, message]);
    });

    setSocket(socket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = () => {
    socket.emit('message', message, roomName);
  };

  const handleJoinRoom = () => {
    socket.emit('joinRoom', roomName);
  };

  return (
    <>
      <div className="p-10 space-y-10">
        {/* Join Room */}
        <div className="flex items-center space-x-4 justify-between">
          <input
            type="text"
            name="room"
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter a room name."
            className="flex-1 bg-black border rounded px-2 py-1"
          />
          <button onClick={handleJoinRoom} className="w-40 py-1 border rounded">
            Join Room
          </button>
        </div>

        {/* Chat List */}
        <div className="flex bg-blue-200 text-slate-900 flex-col gap-4 border rounded p-10">
          <h5>{`[${roomName || 'Please join the room'}]`}</h5>
          {chatList.length ? (
            chatList.map((message, index) => (
              <div key={index} className="border bg-white rounded px-4 py-2">
                {message}
              </div>
            ))
          ) : (
            <p>There is no message.</p>
          )}
        </div>

        {/* Send Message */}
        <div className="flex items-center space-x-4 justify-between">
          <input
            type="text"
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message."
            className="flex-1 bg-black border rounded px-2 py-1"
          />
          <button
            onClick={handleSendMessage}
            className="w-40 py-1 border rounded"
          >
            Send message
          </button>
        </div>
      </div>
    </>
  );
}
