import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Brain, FileText, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: User,
      title: "Enter Reddit Profile",
      description: "Paste a Reddit username or profile URL to get started",
      color: "text-reddit-orange"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI analyzes recent posts and comments to understand personality patterns",
      color: "text-reddit-blue"
    },
    {
      icon: FileText,
      title: "Generated Persona",
      description: "Get a detailed personality profile with supporting evidence from actual posts",
      color: "text-reddit-purple"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-16">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-reddit-orange to-reddit-purple bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform any Reddit profile into a detailed AI-generated personality analysis in just three simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={index}>
              <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in border-2 hover:border-reddit-orange/20">
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-reddit-orange transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden md:flex justify-center items-center">
                  <ArrowRight className="h-8 w-8 text-reddit-orange/60 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-reddit-orange/5 to-reddit-purple/5 border-reddit-orange/20">
          <CardContent className="p-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                ✨ Powered by Advanced AI
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our system uses cutting-edge natural language processing to analyze writing patterns, 
                interests, and communication styles from Reddit posts. Each persona includes real quotes 
                as supporting evidence, giving you insights into what makes each Redditor unique.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <span className="text-sm bg-secondary px-3 py-1 rounded-full">🔒 Privacy-Focused</span>
                <span className="text-sm bg-secondary px-3 py-1 rounded-full">⚡ Real-Time Analysis</span>
                <span className="text-sm bg-secondary px-3 py-1 rounded-full">🎯 Accurate Insights</span>
                <span className="text-sm bg-secondary px-3 py-1 rounded-full">📱 Mobile-Friendly</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};