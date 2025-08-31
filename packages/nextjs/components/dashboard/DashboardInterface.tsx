"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import WelcomeSection from "./WelcomeSection";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import RightPanel from "./RightPanel";
import TypingIndicator from "./TypingIndicator";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  pendingAction?: {
    type: string;
    description: string;
    ensName?: string;
    cost?: string;
    [key: string]: any;
  };
  actions?: {
    type: 'transaction' | 'update' | 'confirmation' | 'ens_operation';
    description: string;
    txHash?: string;
    status: 'pending' | 'completed' | 'failed';
  }[];
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  type: 'transaction' | 'credential' | 'payment';
  timestamp: Date;
}

export function DashboardInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      title: 'Payment to kwame.agent.eth',
      description: 'Successfully sent 5 USDC to kwame.agent.eth',
      type: 'payment',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Credential verification',
      description: 'Checked ama.agent.eth credentials',
      type: 'credential',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Flow record update',
      description: 'Updated payment preferences',
      type: 'transaction',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
    },
  ]);

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  const handleActionConfirm = (action: any, messageId: string) => {
    // Handle action confirmation logic here
    console.log('Action confirmed:', action, 'for message:', messageId);
  };

  const handleActionReject = (messageId: string) => {
    // Handle action rejection logic here
    console.log('Action rejected for message:', messageId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const message = newMessage.trim();
    setNewMessage('');
    
    const newChatMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newChatMessage]);
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${message}". How can I help you today?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <WelcomeSection />
            <ChatMessages 
              messages={messages} 
              handleActionConfirm={handleActionConfirm}
              handleActionReject={handleActionReject}
              formatTime={formatTime}
            />
            <ChatInput 
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
              isProcessing={isProcessing}
            />
            <TypingIndicator />
          </div>
          <RightPanel 
            isRightPanelCollapsed={isRightPanelCollapsed}
            setIsRightPanelCollapsed={setIsRightPanelCollapsed}
            recentActivities={recentActivities}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
}
