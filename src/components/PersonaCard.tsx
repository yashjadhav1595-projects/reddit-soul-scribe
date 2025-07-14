import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Quote, MapPin, Calendar, Heart, Briefcase, Brain, MessageCircle } from 'lucide-react';

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

interface PersonaCardProps {
  persona: PersonaData;
  citations: Record<string, string>;
  username: string;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, citations, username }) => {
  const TraitWithCitation: React.FC<{ 
    trait: string; 
    value: string | string[]; 
    icon: React.ReactNode;
    citation?: string;
  }> = ({ trait, value, icon, citation }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium text-foreground">{trait}</span>
        {citation && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Quote className="h-4 w-4 text-reddit-orange hover:text-reddit-orange/80 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-sm italic">"{citation}"</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div>
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
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
        
        <CardContent className="p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TraitWithCitation
              trait="Age"
              value={persona.age}
              icon={<Calendar className="h-5 w-5 text-reddit-orange" />}
              citation={citations.age}
            />
            
            <TraitWithCitation
              trait="Location"
              value={persona.location}
              icon={<MapPin className="h-5 w-5 text-reddit-blue" />}
              citation={citations.location}
            />
            
            <TraitWithCitation
              trait="Occupation"
              value={persona.occupation}
              icon={<Briefcase className="h-5 w-5 text-reddit-purple" />}
              citation={citations.occupation}
            />
          </div>

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
            />
          </div>

          {/* Values & Beliefs */}
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
              />
              
              <TraitWithCitation
                trait="Communication Style"
                value={persona.communication_style}
                icon={<div className="w-5 h-5" />}
                citation={citations.communication_style}
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
            />
            
            <TraitWithCitation
              trait="Lifestyle"
              value={persona.lifestyle}
              icon={<div className="w-5 h-5" />}
              citation={citations.lifestyle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};