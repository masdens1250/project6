import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  MessageSquare,
  Share,
  FileUp,
  X,
  Send,
  Phone
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
}

const VideoConference: React.FC = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      role: 'مستشار التوجيه',
      isVideoOn: true,
      isAudioOn: true
    },
    {
      id: '2',
      name: 'سارة علي',
      role: 'مستشار التوجيه',
      isVideoOn: true,
      isAudioOn: false
    },
    {
      id: '3',
      name: 'محمد أمين',
      role: 'مستشار التوجيه',
      isVideoOn: false,
      isAudioOn: true
    }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);
  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'أنت',
        text: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">محادثة فيديو</h1>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              متصل
            </span>
            <button className="btn-primary flex items-center">
              <Share className="ml-2 w-5 h-5" />
              مشاركة الرابط
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-4">
          {/* Main Video Area */}
          <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <VideoOff className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${
                    isAudioEnabled ? 'bg-gray-700' : 'bg-red-500'
                  }`}
                >
                  {isAudioEnabled ? (
                    <Mic className="w-6 h-6 text-white" />
                  ) : (
                    <MicOff className="w-6 h-6 text-white" />
                  )}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoEnabled ? 'bg-gray-700' : 'bg-red-500'
                  }`}
                >
                  {isVideoEnabled ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <VideoOff className="w-6 h-6 text-white" />
                  )}
                </button>
                <button className="p-3 rounded-full bg-red-500">
                  <Phone className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleFileUpload}
                  className="p-3 rounded-full bg-gray-700"
                >
                  <FileUp className="w-6 h-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    // Handle file upload
                    console.log(e.target.files);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 flex flex-col">
            {/* Participants */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">المشاركون</h2>
                <span className="text-sm text-gray-500">{participants.length}</span>
              </div>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div className="mr-3">
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!participant.isAudioOn && (
                        <MicOff className="w-4 h-4 text-gray-400" />
                      )}
                      {!participant.isVideoOn && (
                        <VideoOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">المحادثة</h2>
                <button onClick={toggleChat}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.sender === 'أنت' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'أنت'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">{message.sender}</p>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="mr-2 p-2 rounded-lg bg-primary text-white"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoConference;