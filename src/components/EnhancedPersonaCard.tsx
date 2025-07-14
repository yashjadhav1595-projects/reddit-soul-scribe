
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Quote, MapPin, Calendar, Heart, Briefcase, Brain, MessageCircle, Pin, PinOff, Eye, FileText } from 'lucide-react';

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
}

interface EnhancedPersonaCardProps {
  persona: PersonaData;
  citations: Record<string, string>;
  username: string;
}

interface PinnedTrait {
  trait: string;
  value: string | string[];
}

export const EnhancedPersonaCard: React.FC<EnhancedPersonaCardProps> = ({ persona, citations, username }) => {
  const [pinnedTraits, setPinnedTraits] = useState<PinnedTrait[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const togglePin = (trait: string, value: string | string[]) => {
    const existing = pinnedTraits.find(p => p.trait === trait);
    if (existing) {
      setPinnedTraits(pinnedTraits.filter(p => p.trait !== trait));
    } else {
      setPinnedTraits([...pinnedTraits, { trait, value }]);
    }
  };

  const isPinned = (trait: string) => pinnedTraits.some(p => p.trait === trait);

  const TraitWithCitation: React.FC<{ 
    trait: string; 
    value: string | string[]; 
    icon: React.ReactNode;
    citation?: string;
    pinnable?: boolean;
  }> = ({ trait, value, icon, citation, pinnable = false }) => (
    <div className="space-y-2 group">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium text-foreground">{trait}</span>
        {citation && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Quote className="h-4 w-4 text-reddit-orange hover:text-reddit-orange/80 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-sm italic">"{citation}"</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {pinnable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePin(trait, value)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          >
            {isPinned(trait) ? (
              <PinOff className="h-3 w-3 text-reddit-orange" />
            ) : (
              <Pin className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
      <div>
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-sm hover:bg-reddit-orange/10 transition-colors">
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto animate-scale-in">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-card via-card to-secondary/30 overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-reddit-blue to-reddit-purple text-white p-8">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Meet {persona.name}</CardTitle>
            <p className="text-white/80 text-lg">AI-Generated Reddit Persona for u/{username}</p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Deep Dive
              </TabsTrigger>
              <TabsTrigger value="pinned" className="flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Pinned ({pinnedTraits.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 animate-fade-in">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TraitWithCitation
                  trait="Age"
                  value={persona.age}
                  icon={<Calendar className="h-5 w-5 text-reddit-orange" />}
                  citation={citations.age}
                  pinnable
                />
                
                <TraitWithCitation
                  trait="Location"
                  value={persona.location}
                  icon={<MapPin className="h-5 w-5 text-reddit-blue" />}
                  citation={citations.location}
                  pinnable
                />
                
                <TraitWithCitation
                  trait="Occupation"
                  value={persona.occupation}
                  icon={<Briefcase className="h-5 w-5 text-reddit-purple" />}
                  citation={citations.occupation}
                  pinnable
                />
              </div>

              {/* Top Traits */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-6 w-6 text-reddit-orange" />
                  Top Personality Traits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {persona.personality.slice(0, 3).map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-reddit-orange/10 to-reddit-blue/10">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Top Interests */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Brain className="h-6 w-6 text-reddit-blue" />
                  Main Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {persona.interests.slice(0, 4).map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-sm hover:bg-reddit-blue/10 transition-colors">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-8 animate-fade-in">
              {/* Personality Traits */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Brain className="h-6 w-6 text-reddit-orange" />
                  Personality Traits
                </h3>
                <TraitWithCitation
                  trait="Core Traits"
                  value={persona.personality}
                  icon={<Heart className="h-5 w-5 text-red-500" />}
                  citation={citations.personality}
                  pinnable
                />
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-6 w-6 text-reddit-blue" />
                  Interests & Hobbies
                </h3>
                <TraitWithCitation
                  trait="Main Interests"
                  value={persona.interests}
                  icon={<div className="w-5 h-5" />}
                  citation={citations.interests}
                  pinnable
                />
              </div>

              {/* Values & Communication */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-reddit-purple" />
                  Values & Communication
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <TraitWithCitation
                    trait="Core Values"
                    value={persona.values}
                    icon={<div className="w-5 h-5" />}
                    citation={citations.values}
                    pinnable
                  />
                  
                  <TraitWithCitation
                    trait="Communication Style"
                    value={persona.communication_style}
                    icon={<div className="w-5 h-5" />}
                    citation={citations.communication_style}
                    pinnable
                  />
                </div>
              </div>

              {/* Political & Lifestyle */}
              <div className="grid md:grid-cols-2 gap-6">
                <TraitWithCitation
                  trait="Political Views"
                  value={persona.political_view}
                  icon={<div className="w-5 h-5" />}
                  citation={citations.political_view}
                  pinnable
                />
                
                <TraitWithCitation
                  trait="Lifestyle"
                  value={persona.lifestyle}
                  icon={<div className="w-5 h-5" />}
                  citation={citations.lifestyle}
                  pinnable
                />
              </div>
            </TabsContent>

            <TabsContent value="pinned" className="animate-fade-in">
              {pinnedTraits.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Pin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">No Pinned Traits</h3>
                    <p className="text-muted-foreground">
                      Pin interesting traits from the other tabs to save them here for quick access.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">Your Pinned Insights</h3>
                    <p className="text-muted-foreground">Traits you found most interesting about u/{username}</p>
                  </div>
                  
                  <div className="grid gap-6">
                    {pinnedTraits.map((pinned, index) => (
                      <Card key={index} className="p-4 bg-gradient-to-r from-reddit-orange/5 to-reddit-blue/5 border-reddit-orange/20">
                        <TraitWithCitation
                          trait={pinned.trait}
                          value={pinned.value}
                          icon={<Pin className="h-5 w-5 text-reddit-orange" />}
                          citation={citations[pinned.trait.toLowerCase().replace(' ', '_')]}
                          pinnable
                        />
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
