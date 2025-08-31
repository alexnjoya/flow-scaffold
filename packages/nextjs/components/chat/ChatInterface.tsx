"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Import dashboard components
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import WelcomeSection from "../dashboard/WelcomeSection";
import ChatMessages from "../dashboard/ChatMessages";
import ChatInput from "../dashboard/ChatInput";
import RightPanel from "../dashboard/RightPanel";
import TypingIndicator from "../dashboard/TypingIndicator";

// Import page components
import Transactions from "../pages/Transactions";
import Identity from "../pages/Identity";
import NewAgent from "../pages/NewAgent";
import Credentials from "../pages/Credentials";
import SettingsPage from "../pages/Settings";

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  type: 'transaction' | 'credential' | 'payment';
  timestamp: Date;
}

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

const ChatInterface = () => {
  const searchParams = useSearchParams();
  const agentName = searchParams.get('agent');
  const agentEns = searchParams.get('ens');
  const agentRole = searchParams.get('role');

  // State management
  const [currentPage, setCurrentPage] = useState<'chat' | 'transactions' | 'identity' | 'newAgent' | 'credentials' | 'settings'>('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Suggested prompts
  const [suggestedPrompts] = useState([
    { text: "Setup ENS Profile", color: "bg-purple-100 text-purple-800" },
    { text: "Create Agent ENS", color: "bg-blue-100 text-blue-800" },
    { text: "Multi-Sig Wallet", color: "bg-green-100 text-green-800" },
  ]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const messageToSend = newMessage;
    setNewMessage("");

    const newMessageObj: ChatMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessageObj]);
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${messageToSend}". How can I help you today?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  // Handle action confirmation
  const handleActionConfirm = async (action: any, messageId: string) => {
    console.log('Action confirmed:', action, 'for message:', messageId);
    // Implement action confirmation logic here
  };

  // Handle action rejection
  const handleActionReject = (messageId: string) => {
    console.log('Action rejected for message:', messageId);
    // Implement action rejection logic here
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isConnected={false}
        account={null}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          agentName={agentName}
          agentEns={agentEns}
          agentRole={agentRole}
          currentPage={currentPage}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        
        {/* Page Content */}
        {currentPage === 'chat' && (
          <>
            {/* Welcome Section */}
            {messages.length === 0 && (
              <WelcomeSection
                isDarkMode={isDarkMode}
                suggestedPrompts={suggestedPrompts}
                setNewMessage={setNewMessage}
              />
            )}

            {/* Chat Messages */}
            <ChatMessages
              messages={messages}
              handleActionConfirm={handleActionConfirm}
              handleActionReject={handleActionReject}
              formatTime={formatTime}
            />

            {/* AI Typing Indicator */}
            {isProcessing && <TypingIndicator />}

            {/* Chat Input */}
            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={handleSendMessage}
              isProcessing={isProcessing}
            />
          </>
        )}

        {/* Other Pages */}
        {currentPage === 'transactions' && (
          <div className="flex-1 overflow-hidden">
            <Transactions />
          </div>
        )}
        {currentPage === 'identity' && (
          <div className="flex-1 overflow-hidden">
            <Identity />
          </div>
        )}
        {currentPage === 'newAgent' && (
          <div className="flex-1 overflow-hidden">
            <NewAgent />
          </div>
        )}
        {currentPage === 'credentials' && (
          <div className="flex-1 overflow-hidden">
            <Credentials />
          </div>
        )}
        {currentPage === 'settings' && (
          <div className="flex-1 overflow-hidden">
            <SettingsPage />
          </div>
        )}
      </div>
      
      {/* Right Panel */}
      <RightPanel
        isRightPanelCollapsed={isRightPanelCollapsed}
        setIsRightPanelCollapsed={setIsRightPanelCollapsed}
        recentActivities={recentActivities}
        formatTime={formatTime}
      />
    </div>
  );
};

export default ChatInterface;
