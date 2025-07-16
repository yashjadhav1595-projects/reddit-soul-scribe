import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, MessageCircle, Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulatedPostProps {
  simulatedPost?: string;
  personaName: string;
  archetype: string;
  onRegenerate?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const SimulatedPost: React.FC<SimulatedPostProps> = ({
  simulatedPost,
  personaName,
  archetype,
  onRegenerate,
  className,
  isLoading
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('simulation');

  const handleCopy = async () => {
    if (simulatedPost) {
      try {
        await navigator.clipboard.writeText(simulatedPost);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  };

  const handleRegenerate = async () => {
    if (onRegenerate) {
      await onRegenerate();
    }
  };

  if (!simulatedPost) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-reddit-orange/10 to-reddit-blue/10 rounded-full flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-reddit-orange/50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">AI Post Simulation</h3>
            <p className="text-sm text-muted-foreground">
              Generate a Reddit post that {personaName} would write
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {archetype}
          </Badge>
          {onRegenerate && (
            <Button
              variant="reddit"
              size="lg"
              className="mt-4"
              onClick={onRegenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Generate Post
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto group", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-reddit-orange to-reddit-blue rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Post Simulation</CardTitle>
              <p className="text-sm text-muted-foreground">
                What {personaName} might post on Reddit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Simulated Post
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulation" className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-reddit-orange">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-reddit-orange to-reddit-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {personaName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">u/{personaName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {archetype}
                    </Badge>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {simulatedPost}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Generated by AI</span>
                    <span>•</span>
                    <span>EXAONE-Deep-32B</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="bg-gradient-to-br from-reddit-blue/5 to-reddit-purple/5 rounded-lg p-4 border border-reddit-blue/20">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-reddit-blue" />
                Simulation Analysis
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Model Used:</span>
                  <Badge variant="outline" className="text-xs">
                    EXAONE-Deep-32B
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Personality Match:</span>
                  <Badge variant="secondary" className="text-xs">
                    High Confidence
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tone Accuracy:</span>
                  <Badge variant="secondary" className="text-xs">
                    Based on {archetype}
                  </Badge>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    This post was generated by analyzing the user's communication patterns, 
                    interests, and personality traits. The AI model simulates how they might 
                    express themselves in a Reddit context.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-reddit-blue rounded-full animate-pulse" />
          <span>AI-powered post simulation</span>
        </div>
      </CardContent>
    </Card>
  );
}; 