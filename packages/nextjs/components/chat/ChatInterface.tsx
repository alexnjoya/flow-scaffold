"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// AI service temporarily disabled

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
  // AI service metadata
  metadata?: {
    ensQuery?: string;
    action?: any;
    confidence?: number;
    suggestions?: string[];
  };
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
  const [isClient, setIsClient] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  // AI Service temporarily disabled
  const aiMessages: any[] = [];
  const currentSession = null;
  const aiIsLoading = false;
  const aiError = null;
  const aiSendMessage = () => {};
  const createSession = () => {};
  const clearMessages = () => {};
  const isENSQuery = () => false;
  const getENSSuggestions = async () => [];

  // AI message conversion temporarily disabled

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

  // Suggested prompts - will be populated by AI service
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    { text: "Setup ENS Profile", color: "bg-purple-100 text-purple-800" },
    { text: "Create Agent ENS", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
    { text: "Multi-Sig Wallet", color: "bg-green-100 text-green-800" },
  ]);

  // Set client flag to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // AI suggestions temporarily disabled
  useEffect(() => {
    if (!isClient) return;
    // AI suggestions loading disabled
  }, [isClient]);

  // AI message watching temporarily disabled
  useEffect(() => {
    if (!isClient) return;
    // AI message conversion disabled
  }, [isClient]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing || !isClient) return;
    
    setIsProcessing(true);
    const messageToSend = newMessage;
    setNewMessage("");
    
    // Create a unique ID for the user message
    const userMessageId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add user message immediately for better UX
    const userMessage: ChatMessage = {
      id: userMessageId,
      content: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to local state first
    setMessages(prev => [...prev, userMessage]);
    
    // Small delay to ensure user message is rendered before AI response
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Show typing indicator after a short delay
      setTimeout(() => setShowTypingIndicator(true), 300);
      
      // Use AI service to generate response
      await aiSendMessage(messageToSend);
      
      // The AI response will be handled by the useEffect that watches aiMessages
      // This ensures proper sequencing: user message first, then AI response
    } catch (error) {
      // Hide typing indicator on error
      setShowTypingIndicator(false);
      console.error('Error sending message to AI:', error);
      // Fallback response if AI fails
      const fallbackResponse: ChatMessage = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: `I received your message: "${messageToSend}". How can I help you today?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsProcessing(false);
      setShowTypingIndicator(false);
    }
  };

  // Handle action confirmation
  const handleActionConfirm = async (action: any, messageId: string) => {
    console.log('Action confirmed:', action, 'for message:', messageId);
    
    // Update the action status to completed
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.actions) {
        return {
          ...msg,
          actions: msg.actions.map(act => ({
            ...act,
            status: 'completed' as const
          }))
        };
      }
      return msg;
    }));

    // Here you would implement the actual ENS operation
    // For example, calling smart contracts, etc.
    if (action.type === 'ens_operation') {
      console.log('Executing ENS operation:', action);
      // TODO: Implement actual ENS operation execution
    }
  };

  // Handle action rejection
  const handleActionReject = (messageId: string) => {
    console.log('Action rejected for message:', messageId);
    
    // Update the action status to failed
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.actions) {
        return {
          ...msg,
          actions: msg.actions.map(act => ({
            ...act,
            status: 'failed' as const
          }))
        };
      }
      return msg;
    }));
  };

  // Handle clearing messages
  const handleClearMessages = () => {
    setMessages([]);
    clearMessages(); // Clear AI service messages too
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
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
      <div className="flex-1 flex flex-col min-h-0">
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
          <div className="flex-1 flex flex-col min-h-0">
            {/* Welcome Section */}
            {messages.length === 0 && (
              <div className="flex-shrink-0">
                <WelcomeSection
                  isDarkMode={isDarkMode}
                  suggestedPrompts={suggestedPrompts}
                  setNewMessage={setNewMessage}
                />
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 min-h-0 flex flex-col">
              <ChatMessages
                messages={messages}
                handleActionConfirm={handleActionConfirm}
                handleActionReject={handleActionReject}
                formatTime={formatTime}
              />
            </div>

            {/* AI Typing Indicator */}
            {showTypingIndicator && (
              <div className="flex-shrink-0">
                <TypingIndicator />
              </div>
            )}

            {/* Processing State Indicator */}
            {isProcessing && !showTypingIndicator && (
              <div className="flex-shrink-0 p-2 md:p-3">
                <div className="max-w-4xl mx-auto w-full text-center">
                  <div className="text-sm text-muted-foreground">Processing your request...</div>
                </div>
              </div>
            )}

            {/* AI Error Display */}
            {aiError && (
              <div className="flex-shrink-0 mx-4 mb-2">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                  <strong>AI Error:</strong> {aiError}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="flex-shrink-0">
              <ChatInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={handleSendMessage}
                isProcessing={isProcessing || aiIsLoading}
                onClear={handleClearMessages}
              />
            </div>
          </div>
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
