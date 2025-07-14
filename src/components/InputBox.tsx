import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Clipboard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InputBoxProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const validateRedditUrl = (input: string): boolean => {
    const redditUserPattern = /^(https?:\/\/)?(www\.)?reddit\.com\/user\/[\w-]+\/?$/;
    const usernamePattern = /^[\w-]+$/;
    
    return redditUserPattern.test(input) || usernamePattern.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Please enter a Reddit username",
        description: "Enter either a username or full Reddit profile URL",
        variant: "destructive"
      });
      return;
    }

    if (!validateRedditUrl(url)) {
      toast({
        title: "Invalid Reddit URL or username",
        description: "Please enter a valid Reddit username or profile URL",
        variant: "destructive"
      });
      return;
    }

    let cleanUsername = url;
    if (url.includes('reddit.com')) {
      const match = url.match(/reddit\.com\/user\/([\w-]+)/);
      cleanUsername = match ? match[1] : url;
    }

    onSubmit(cleanUsername);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast({
        title: "Pasted from clipboard",
        description: "URL has been pasted successfully"
      });
    } catch (err) {
      toast({
        title: "Paste failed",
        description: "Unable to access clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <User className="h-12 w-12 mx-auto text-reddit-orange animate-bounce-soft" />
            <h3 className="text-2xl font-bold text-foreground">Enter Reddit Profile</h3>
            <p className="text-muted-foreground">
              Enter a Reddit username or paste a profile URL to generate an AI persona
            </p>
          </div>

          <div className="relative">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter username (e.g., spez) or Reddit URL"
              className="pr-12 h-14 text-lg rounded-xl border-2 focus:border-reddit-orange transition-all duration-300"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePaste}
              className="absolute right-2 top-2 h-10 w-10 hover:bg-reddit-orange/10"
              disabled={loading}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              variant="reddit"
              size="lg"
              disabled={loading || !url.trim()}
              className="px-12 py-6 text-lg font-semibold rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                'Generate Persona'
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>We'll analyze recent posts and comments to create a personality profile</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};