const TypingIndicator = () => {
  return (
    <div className="flex justify-start p-2 md:p-3 animate-in fade-in duration-300">
      <div className="flex items-start space-x-3 max-w-[85%]">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
          AI
        </div>
        
        {/* Typing Bubble */}
        <div className="space-y-3 flex-1">
          <div className="rounded-2xl px-4 py-3 bg-muted">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '160ms', animationDuration: '1.4s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '320ms', animationDuration: '1.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
