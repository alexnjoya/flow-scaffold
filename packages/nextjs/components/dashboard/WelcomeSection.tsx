import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  isDarkMode?: boolean;
  suggestedPrompts?: Array<{ text: string; color: string }>;
  setNewMessage?: (message: string) => void;
}

const WelcomeSection = ({ 
  isDarkMode = false, 
  suggestedPrompts = [
    { text: "Create an agent", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
    { text: "Send a payment", color: "bg-green-100 text-green-800" },
    { text: "Verify identity", color: "bg-purple-100 text-purple-800" }
  ], 
  setNewMessage = () => {} 
}: WelcomeSectionProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4">
      <h1 className="text-2xl font-bold  font-serif text-white dark:text-white">
        Welcome to Flow ENS Assistant
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl">
        I'm your AI-powered ENS assistant. Ask me anything about ENS domains, registration, transfers, and more!
      </p>
      
      {/* Suggested Prompts */}
      <div className="grid grid-cols-3 gap-2 max-w-lg">
        {suggestedPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-auto p-3 flex flex-col items-center justify-center ${prompt.color} border-0 hover:scale-105 transition-transform`}
            onClick={() => setNewMessage(prompt.text)}
          >
            <span className="text-xs font-medium">{prompt.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;
