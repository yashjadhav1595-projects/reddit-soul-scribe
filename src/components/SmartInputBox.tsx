
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clipboard, Loader2, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartInputBoxProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

interface RecentProfile {
  username: string;
  timestamp: number;
}

export const SmartInputBox: React.FC<SmartInputBoxProps> = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');
  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load recent profiles from localStorage
    const saved = localStorage.getItem('reddit-persona-recent');
    if (saved) {
      try {
        setRecentProfiles(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent profiles:', e);
      }
    }
  }, []);

  const saveRecentProfile = (username: string) => {
    const newProfile: RecentProfile = {
      username,
      timestamp: Date.now()
    };
    
    const updated = [newProfile, ...recentProfiles.filter(p => p.username !== username)]
      .slice(0, 5); // Keep only 5 recent
    
    setRecentProfiles(updated);
    localStorage.setItem('reddit-persona-recent', JSON.stringify(updated));
  };

  const removeRecentProfile = (username: string) => {
    const updated = recentProfiles.filter(p => p.username !== username);
    setRecentProfiles(updated);
    localStorage.setItem('reddit-persona-recent', JSON.stringify(updated));
  };

  const validateRedditUrl = (input: string): boolean => {
    const redditUserPattern = /^(https?:\/\/)?(www\.)?reddit\.com\/user\/[\w-]+\/?$/;
    const usernamePattern = /^[\w-]+$/;
    
    return redditUserPattern.test(input) || usernamePattern.test(input);
  };

  const detectInputType = (input: string): { type: 'url' | 'username', username: string } => {
    if (input.includes('reddit.com')) {
      const match = input.match(/reddit\.com\/user\/([\w-]+)/);
      return { type: 'url', username: match ? match[1] : input };
    }
    return { type: 'username', username: input };
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

    const { username } = detectInputType(url);
    saveRecentProfile(username);
    onSubmit(username);
    setShowRecent(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      // Smart detection for Reddit URLs
      if (text.includes('reddit.com/user/') || text.includes('reddit.com/u/')) {
        setUrl(text);
        toast({
          title: "Smart paste detected!",
          description: "Reddit profile URL pasted and validated"
        });
      } else if (/^[\w-]+$/.test(text.trim())) {
        setUrl(text.trim());
        toast({
          title: "Username pasted",
          description: "Ready to analyze profile"
        });
      } else {
        setUrl(text);
        toast({
          title: "Pasted from clipboard",
          description: "Please verify the format"
        });
      }
    } catch (err) {
      toast({
        title: "Paste failed",
        description: "Unable to access clipboard",
        variant: "destructive"
      });
    }
  };

  const handleRecentClick = (username: string) => {
    setUrl(username);
    setShowRecent(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
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
                onFocus={() => recentProfiles.length > 0 && setShowRecent(true)}
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
                className="px-12 py-6 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-300"
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

      {/* Recent Profiles */}
      {showRecent && recentProfiles.length > 0 && (
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Profiles
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecent(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentProfiles.map((profile) => (
                <Badge
                  key={profile.username}
                  variant="secondary"
                  className="cursor-pointer hover:bg-reddit-orange/10 transition-colors group"
                  onClick={() => handleRecentClick(profile.username)}
                >
                  u/{profile.username}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentProfile(profile.username);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
