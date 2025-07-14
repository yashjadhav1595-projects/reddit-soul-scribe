import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Download, Eye, EyeOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonaImageProps {
  personaImage?: string;
  personaName: string;
  archetype: string;
  onRegenerate?: () => void;
  className?: string;
}

export const PersonaImage: React.FC<PersonaImageProps> = ({
  personaImage,
  personaName,
  archetype,
  onRegenerate,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const handleRegenerate = async () => {
    if (onRegenerate) {
      setIsLoading(true);
      try {
        await onRegenerate();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (personaImage) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${personaImage}`;
      link.download = `${personaName}-persona.png`;
      link.click();
    }
  };

  if (!personaImage) {
    return (
      <Card className={cn("w-full max-w-md mx-auto", className)}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-reddit-orange/10 to-reddit-blue/10 rounded-xl flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-reddit-orange/50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">AI-Generated Portrait</h3>
            <p className="text-sm text-muted-foreground">
              Visual representation of {personaName}'s personality
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {archetype}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto group", className)}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-reddit-orange" />
            <h3 className="text-lg font-semibold text-foreground">AI Portrait</h3>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImage(!showImage)}
              className="h-8 w-8 p-0"
            >
              {showImage ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          {showImage ? (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-reddit-orange/10 to-reddit-blue/10">
              <img
                src={`data:image/png;base64,${personaImage}`}
                alt={`AI-generated portrait of ${personaName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load persona image');
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <Skeleton className="w-full aspect-square rounded-xl" />
          )}
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold text-foreground">{personaName}</h4>
              <Badge variant="secondary" className="text-xs mt-1">
                {archetype}
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Generated using FLUX.1-schnell AI model
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-reddit-orange rounded-full animate-pulse" />
            <span>AI-powered visualization</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 