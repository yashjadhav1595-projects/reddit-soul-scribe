
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, MessageSquare, User, Sparkles } from 'lucide-react';

interface ProgressiveLoadingSpinnerProps {
  message?: string;
}

interface LoadingStep {
  icon: React.ElementType;
  text: string;
  duration: number;
  color: string;
}

export const ProgressiveLoadingSpinner: React.FC<ProgressiveLoadingSpinnerProps> = ({ 
  message = "Analyzing Reddit profile..." 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps: LoadingStep[] = [
    { icon: User, text: "Fetching profile data", duration: 2000, color: "text-reddit-blue" },
    { icon: MessageSquare, text: "Analyzing posts & comments", duration: 3000, color: "text-reddit-orange" },
    { icon: Brain, text: "Generating AI persona", duration: 2000, color: "text-reddit-purple" },
    { icon: Sparkles, text: "Finalizing insights", duration: 1000, color: "text-reddit-orange" }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;
    
    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      // Calculate current step based on elapsed time
      let accumulatedTime = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration;
        if (elapsed <= accumulatedTime) {
          setCurrentStep(i);
          break;
        }
      }
      
      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const currentStepData = steps[currentStep];
  const CurrentIcon = currentStepData?.icon || User;

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg animate-fade-in">
      <CardContent className="p-8 text-center space-y-6">
        <div className="relative">
          <div className="h-20 w-20 mx-auto relative">
            <Loader2 className="h-20 w-20 text-reddit-orange animate-spin absolute inset-0" />
            <CurrentIcon className={`h-8 w-8 absolute inset-0 m-auto ${currentStepData?.color || 'text-reddit-orange'} animate-pulse`} />
          </div>
          <div className="absolute inset-0 h-20 w-20 mx-auto border-4 border-reddit-orange/20 rounded-full animate-glow-pulse" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">{message}</h3>
          <p className="text-muted-foreground">
            AI is working hard to understand this personality
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Current Step */}
        {currentStepData && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-reddit-orange/10 to-reddit-blue/10 border border-reddit-orange/20">
            <div className="flex items-center gap-3 justify-center">
              <CurrentIcon className={`h-5 w-5 ${currentStepData.color} animate-bounce`} />
              <span className="text-sm font-medium text-foreground">{currentStepData.text}</span>
            </div>
          </div>
        )}

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-reddit-orange border-reddit-orange text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <StepIcon className="h-4 w-4" />
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
