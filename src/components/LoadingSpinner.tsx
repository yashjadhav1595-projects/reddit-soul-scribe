import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Brain, MessageSquare, User } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Analyzing Reddit profile..." 
}) => {
  const steps = [
    { icon: User, text: "Fetching profile data", delay: "0ms" },
    { icon: MessageSquare, text: "Analyzing posts & comments", delay: "500ms" },
    { icon: Brain, text: "Generating AI persona", delay: "1000ms" }
  ];

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg animate-fade-in">
      <CardContent className="p-8 text-center space-y-6">
        <div className="relative">
          <div className="h-20 w-20 mx-auto">
            <Loader2 className="h-20 w-20 text-reddit-orange animate-spin" />
          </div>
          <div className="absolute inset-0 h-20 w-20 mx-auto border-4 border-reddit-orange/20 rounded-full animate-glow-pulse" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">{message}</h3>
          <p className="text-muted-foreground">
            This may take 30-60 seconds while our AI analyzes the profile
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 animate-fade-in"
                style={{ animationDelay: step.delay }}
              >
                <Icon className="h-5 w-5 text-reddit-orange" />
                <span className="text-sm text-muted-foreground">{step.text}</span>
                <div className="ml-auto">
                  <div className="h-2 w-2 bg-reddit-orange rounded-full animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            🤖 Powered by AI • 🔒 Privacy-focused • ⚡ Real-time analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
};