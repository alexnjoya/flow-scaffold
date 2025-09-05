"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";

// Import ENS integration
import { ensChatIntegration, ChatMessage as ENSChatMessage } from '@/services/ensagent/chatIntegration';
import ENSMessageCard from '@/components/ens/ENSMessageCard';
import { useActivities } from '@/hooks/useActivities';

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
import Payments from "../pages/Payments";
import Identity from "../pages/Identity";
import NewEns from "../pages/NewEns";
import Credentials from "../pages/Credentials";

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
    status: 'pending' | 'completed' | 'failed' | 'confirmed';
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
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const agentName = searchParams.get('agent');
  const agentEns = searchParams.get('ens');
  const agentRole = searchParams.get('role');

  // State management
  const [currentPage, setCurrentPage] = useState<'chat' | 'transactions' | 'payments' | 'identity' | 'newEns' | 'credentials'>('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  // ENS Integration
  const [ensInitialized, setEnsInitialized] = useState(false);
  const [ensMessages, setEnsMessages] = useState<ENSChatMessage[]>([]);
  const [ensIsLoading, setEnsIsLoading] = useState(false);
  const [ensError, setEnsError] = useState<string | null>(null);

  // Initialize ENS integration
  useEffect(() => {
    const initializeENS = async () => {
      try {
        // Initialize ENS integration (no provider needed for API-based processing)
        await ensChatIntegration.initialize(null as any);
        setEnsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize ENS:', error);
        setEnsError('Failed to initialize ENS service');
      }
    };

    initializeENS();
  }, []);

  // Use real activities from activity manager
  const { activities: recentActivities, addActivity } = useActivities(10);

  // Suggested prompts - ENS focused
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    { text: "Is vitalik.eth available?", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { text: "Register myname.eth", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { text: "What does example.eth resolve to?", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { text: "Set description for myname.eth", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    { text: "How much does myname.eth cost?", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    { text: "Renew myname.eth for 2 years", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" }
  ]);

  // Set client flag to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ENS suggestions
  useEffect(() => {
    if (!isClient) return;
    // ENS suggestions will be loaded when needed
  }, [isClient]);


  // ENS message processing
  const processENSMessage = async (message: string) => {
    if (!ensInitialized) {
      setEnsError('ENS service not initialized. Please connect your wallet.');
      return;
    }

    setEnsIsLoading(true);
    setEnsError(null);

    try {
      const result = await ensChatIntegration.processMessage(message);
      
      if (result.success) {
        // Convert ENS message to regular chat message for better display
        const chatMessage: ChatMessage = {
          id: result.chatMessage.id,
          content: result.chatMessage.content,
          sender: 'ai',
          timestamp: new Date(),
          pendingAction: result.chatMessage.pendingAction,
          actions: result.chatMessage.actions,
          metadata: result.chatMessage.metadata
        };
        
        setMessages(prev => [...prev, chatMessage]);

        // Add activity based on the message content and metadata
        if (result.chatMessage.metadata?.action) {
          const action = result.chatMessage.metadata.action;
          const ensQuery = result.chatMessage.metadata.ensQuery;
          
          // Try to extract ENS name from the query or content
          const ensNameMatch = ensQuery?.match(/([a-z0-9-]+\.eth)/i) || 
                              result.chatMessage.content.match(/([a-z0-9-]+\.eth)/i);
          const ensName = ensNameMatch ? ensNameMatch[1] : 'Unknown';
          
          // Determine activity type based on content
          if (result.chatMessage.content.toLowerCase().includes('register')) {
            addActivity({
              title: `ENS Registration: ${ensName}`,
              description: result.chatMessage.content,
              type: 'ens_registration',
              ensName,
              status: 'completed',
            });
          } else if (result.chatMessage.content.toLowerCase().includes('resolve') || 
                     result.chatMessage.content.toLowerCase().includes('address')) {
            addActivity({
              title: `ENS Resolution: ${ensName}`,
              description: result.chatMessage.content,
              type: 'ens_resolution',
              ensName,
              status: 'completed',
            });
          } else if (result.chatMessage.content.toLowerCase().includes('set') || 
                     result.chatMessage.content.toLowerCase().includes('update')) {
            addActivity({
              title: `ENS Update: ${ensName}`,
              description: result.chatMessage.content,
              type: 'ens_update',
              ensName,
              status: 'completed',
            });
          } else if (result.chatMessage.content.toLowerCase().includes('renew')) {
            addActivity({
              title: `ENS Renewal: ${ensName}`,
              description: result.chatMessage.content,
              type: 'ens_update',
              ensName,
              status: 'completed',
            });
          } else {
            // Generic ENS operation
            addActivity({
              title: `ENS Operation: ${ensName}`,
              description: result.chatMessage.content,
              type: 'ens_update',
              ensName,
              status: 'completed',
            });
          }
        }
      } else {
        const errorMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          content: result.error || 'Failed to process ENS request. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          metadata: {
            suggestions: getENSSuggestions()
          }
        };
        setMessages(prev => [...prev, errorMessage]);

        // Add error activity
        addActivity({
          title: 'ENS Error',
          description: result.error || 'ENS operation failed',
          type: 'error',
          status: 'failed',
        });
      }
    } catch (error) {
      console.error('ENS message processing error:', error);
      const errorMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        content: 'Failed to process ENS request. Please check your connection and try again.',
        sender: 'ai',
        timestamp: new Date(),
        metadata: {
          suggestions: getENSSuggestions()
        }
      };
      setMessages(prev => [...prev, errorMessage]);

      // Add error activity
      addActivity({
        title: 'ENS Error',
        description: 'Failed to process ENS request',
        type: 'error',
        status: 'failed',
      });
    } finally {
      setEnsIsLoading(false);
    }
  };


  const getENSSuggestions = () => {
    return ensChatIntegration.getENSSuggestions();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing || !isClient) return;
    
    const messageText = newMessage.trim();
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    try {
      // Process all messages through ENS integration (which uses LLM)
      await processENSMessage(messageText);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        content: "I encountered an error processing your request. Please try again or rephrase your question.",
        sender: 'ai',
        timestamp: new Date(),
        metadata: {
          suggestions: getENSSuggestions()
        }
      };
      setMessages(prev => [...prev, errorMessage]);
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
    setEnsMessages([]);
    ensChatIntegration.clearConversationHistory();
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isConnected={isConnected}
        account={address || null}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <Header
          agentName={agentName}
          agentEns={agentEns}
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
                onSuggestionClick={(suggestion) => {
                  setNewMessage(suggestion);
                  // Auto-send the suggestion
                  setTimeout(() => {
                    handleSendMessage();
                  }, 100);
                }}
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
            {ensError && (
              <div className="flex-shrink-0 mx-4 mb-2">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                  <strong>ENS Error:</strong> {ensError}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="flex-shrink-0">
              <ChatInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={handleSendMessage}
                isProcessing={isProcessing || ensIsLoading}
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
        {currentPage === 'payments' && (
          <div className="flex-1 overflow-hidden">
            <Payments />
          </div>
        )}
        {currentPage === 'identity' && (
          <div className="flex-1 overflow-hidden">
            <Identity />
          </div>
        )}
        {currentPage === 'newEns' && (
          <div className="flex-1 overflow-hidden">
            <NewEns />
          </div>
        )}
        {currentPage === 'credentials' && (
          <div className="flex-1 overflow-hidden">
            <Credentials />
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
