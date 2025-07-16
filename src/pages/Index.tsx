
import React, { useState, useEffect } from 'react';
import { SmartInputBox } from '@/components/SmartInputBox';
import { EnhancedPersonaCard } from '@/components/EnhancedPersonaCard';
import { ProgressiveLoadingSpinner } from '@/components/ProgressiveLoadingSpinner';
import { CitationsList } from '@/components/CitationsList';
import { DownloadButton } from '@/components/DownloadButton';
import { HowItWorks } from '@/components/HowItWorks';
import { PersonaImage } from '@/components/PersonaImage';
import { SimulatedPost } from '@/components/SimulatedPost';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { analyzeRedditUser, checkBackendHealth, type AnalysisResult, fetchRedditUserDetails } from '@/lib/api';
import { Github, Star, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import RedditUserDetails from '@/components/RedditUserDetails';
import { PersonaSummaryCard } from '@/components/PersonaSummaryCard';

interface PersonaData {
  name: string;
  age: string;
  location: string;
  occupation: string;
  interests: string[];
  personality: string[];
  political_view: string;
  lifestyle: string;
  communication_style: string;
  values: string[];
  archetype: string;
  narrative: string;
}

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [citations, setCitations] = useState<Record<string, any>>({});
  const [username, setUsername] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [personaStatus, setPersonaStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const { toast } = useToast();

  // Demo data for testing UI
  const demoPersona: PersonaData = {
    name: "Alex",
    age: "28-32",
    location: "Pacific Northwest, USA",
    occupation: "Software Developer / Tech Professional",
    interests: ["Gaming", "Programming", "Science Fiction", "Coffee Culture", "Open Source", "Mechanical Keyboards"],
    personality: ["Analytical", "Introverted", "Detail-oriented", "Curious", "Problem-solver", "Perfectionist"],
    political_view: "Progressive with libertarian leanings on tech issues",
    lifestyle: "Work-from-home, Tech-savvy, Urban dweller, Night owl",
    communication_style: "Direct but friendly, uses technical jargon, thoughtful responses, occasional humor",
    values: ["Innovation", "Privacy", "Learning", "Efficiency", "Community", "Transparency"],
    archetype: "The Curious Analyst",
    narrative: "I'm a 28-year-old developer who finds peace in writing modular code and occasionally venturing into philosophy. My Reddit activity reflects my analytical nature - I prefer to work through problems methodically rather than jumping to conclusions."
  };

  const demoCitations = {
    interests: "I've been diving deep into Rust lately and it's fascinating how memory-safe it is compared to C++. Also got my new mechanical keyboard with Cherry MX Blues - the tactile feedback is incredible for coding sessions.",
    personality: "I prefer to work through problems methodically rather than jumping to conclusions. Usually spend a good hour researching before I even start coding.",
    location: "The coffee scene here in Portland is incredible, there's this new roastery downtown that does single-origin pour-overs that'll change your life.",
    occupation: "Been coding for about 8 years now, mostly backend stuff but learning React lately. Currently working on a distributed systems project that's keeping me up at night.",
    values: "I think open source is crucial for innovation and keeping tech democratic. Big tech companies shouldn't control everything.",
    political_view: "I'm generally progressive but when it comes to tech regulation, I lean more libertarian - less government interference in innovation.",
    lifestyle: "Working from home has been a game-changer. I'm definitely more productive at 2 AM than 2 PM.",
    communication_style: "I try to be direct but not rude. Sometimes I get too technical in explanations but I'd rather over-explain than leave someone confused."
  };

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isOnline = await checkBackendHealth();
        setBackendStatus(isOnline ? 'online' : 'offline');
      } catch (error) {
        setBackendStatus('offline');
      }
    };
    
    checkBackend();
  }, []);

  const handleFetchUserDetails = async (inputUsername: string) => {
    setUserDetailsLoading(true);
    setError(null);
    setUsername(inputUsername);
    setPersona(null);
    setCitations({});
    setAnalysisResult(null);
    setPersonaStatus('idle');
    try {
      const details = await fetchRedditUserDetails(inputUsername);
      setUserDetails(details);
      // Automatically trigger persona generation after user data is fetched
      setPersonaStatus('generating');
      console.log('[Frontend] Persona generation started using Perplexity API for', inputUsername);
      await handleGeneratePersona(inputUsername);
      setPersonaStatus('done');
    } catch (error: any) {
      setError(error.message || 'Unknown error occurred');
      setUserDetails(null);
      setPersonaStatus('idle');
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleGeneratePersona = async (inputUsername: string) => {
    setLoading(true);
    setError(null);
    setUsername(inputUsername);
    
    try {
      if (backendStatus === 'online') {
        // Use real API
        const result = await analyzeRedditUser(inputUsername);
        setAnalysisResult(result);
        setPersona(result.persona);
        setCitations(result.citations);
        
        toast({
          title: "AI Analysis Complete!",
          description: `Generated persona for u/${inputUsername} with ${result.redditData.totalPosts} posts and ${result.redditData.totalComments} comments`,
          duration: 5000
        });
      } else {
        // Fallback to demo data
        await new Promise(resolve => setTimeout(resolve, 8000));
      setPersona(demoPersona);
      setCitations(demoCitations);
      
      toast({
          title: "Demo Mode - Persona Generated",
          description: `Demo analysis complete for u/${inputUsername}`,
        duration: 5000
      });
      }
    } catch (error: any) {
      setError(error.message || 'Unknown error occurred');
      toast({
        title: "Generation failed",
        description: error.message || "Please try again later or check if the username exists.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPersona(null);
    setCitations({});
    setUsername('');
    setAnalysisResult(null);
  };

  const handleTryDemo = () => {
    handleGeneratePersona('demouser');
  };

  // Add type guard for PersonaSummary
  function isPersonaSummary(obj: any): obj is import('../components/PersonaSummaryCard').PersonaSummary {
    return obj && typeof obj === 'object' &&
      'motivations' in obj &&
      'personality' in obj &&
      'behaviour' in obj &&
      'frustrations' in obj &&
      'goals' in obj &&
      'quote' in obj;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-reddit-orange to-accent flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Reddit Persona Generator</h1>
                <p className="text-sm text-muted-foreground">AI-powered personality analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:flex">
                ✨ Enhanced UX
              </Badge>
              {backendStatus === 'online' && (
                <Badge variant="default" className="hidden sm:flex bg-green-500">
                  🟢 AI Backend Online
                </Badge>
              )}
              {backendStatus === 'offline' && (
                <Badge variant="destructive" className="hidden sm:flex">
                  🔴 Demo Mode
                </Badge>
              )}
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="gap-2">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-reddit-orange/10 text-reddit-orange px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
                  <Star className="h-4 w-4" />
                  Enhanced AI-Powered Analysis
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-reddit-orange via-reddit-blue to-reddit-purple bg-clip-text text-transparent animate-fade-in">
                  Reddit Persona Generator
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
                  Discover the personality behind any Reddit profile with advanced AI analysis. 
                  Get detailed insights with smart input, progressive loading, and pinnable traits.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
                <Button 
                  onClick={handleTryDemo}
                  variant="reddit" 
                  size="lg" 
                  className="px-8 py-6 text-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="h-5 w-5" />
                  Try Enhanced Demo
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                  <Github className="h-5 w-5" />
                  View Source
                </Button>
              </div>
            </section>

            <HowItWorks />

            <section className="py-8">
              <SmartInputBox onSubmit={handleFetchUserDetails} loading={userDetailsLoading} />
          {error && (
            <div className="my-4 p-4 bg-red-100 text-red-800 rounded border border-red-400 shadow-sm" role="alert" aria-live="assertive">
              <strong className="block font-semibold mb-1">Error:</strong>
              {error.includes('not found') || error.includes('404')
                ? 'Reddit user not found. Please check the username and try again.'
                : error.includes('required') || error.includes('400')
                  ? 'Please enter a valid Reddit username.'
                  : error}
            </div>
          )}
            </section>

        {/* User Details Section */}
        {userDetailsLoading && (
          <section className="py-16">
            <ProgressiveLoadingSpinner message="Fetching Reddit user details..." />
          </section>
        )}
        {userDetails && (
          <section className="space-y-8">
            <RedditUserDetails userData={userDetails} />
            {/* Persona generation status and spinner */}
            {!persona && personaStatus === 'generating' && !userDetailsLoading && (
              <div className="flex flex-col items-center gap-4">
                <ProgressiveLoadingSpinner message="Generating persona using Perplexity AI..." />
                <Badge variant="default" className="bg-blue-600 text-white text-lg px-4 py-2">
                  Persona is being generated using Perplexity API Key
                </Badge>
              </div>
            )}
          </section>
        )}

        {/* Loading State for Persona */}
        {loading && (
          <section className="py-16">
            <ProgressiveLoadingSpinner message="Analyzing Reddit profile with enhanced AI..." />
          </section>
        )}

        {/* Results */}
        {persona && !loading && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                ✅ Enhanced Analysis Complete
              </Badge>
              <div className="flex justify-center gap-4">
                <Button onClick={handleReset} variant="outline" className="gap-2 transform hover:scale-105 transition-all duration-300">
                  <RefreshCw className="h-4 w-4" />
                  Analyze Another Profile
                </Button>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Render PersonaSummaryCard if Perplexity persona, else EnhancedPersonaCard */}
              {isPersonaSummary(persona) ? (
                <PersonaSummaryCard
                  persona={persona}
                  avatarUrl={userDetails?.userInfo?.snoovatar_img || userDetails?.userInfo?.icon_img}
                />
              ) : (
                <EnhancedPersonaCard
                  persona={persona}
                  citations={citations}
                  username={username}
                />
              )}
              <div className="space-y-8">
                <PersonaImage
                  personaImage={analysisResult?.personaImage}
                  personaName={persona.name}
                  archetype={persona.archetype}
                />
                <SimulatedPost
                  simulatedPost={analysisResult?.simulatedPost}
                  personaName={persona.name}
                  archetype={persona.archetype}
                />
              </div>
            </div>
            <CitationsList
              citations={citations}
              username={username}
            />
            <DownloadButton
              persona={persona}
              username={username}
              citations={citations}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
              <span>Enhanced UX with ❤️ for the Reddit community</span>
              <span>•</span>
              <span>Privacy-focused & open source</span>
              <span>•</span>
              <span>Not affiliated with Reddit Inc.</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              This enhanced tool analyzes publicly available Reddit content to generate personality insights for educational and entertainment purposes. 
              Features smart input detection, progressive loading, and pinnable insights. Results are AI-generated approximations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
