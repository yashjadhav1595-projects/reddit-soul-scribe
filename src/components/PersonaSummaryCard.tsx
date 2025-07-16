import React from 'react';

interface PersonaSummary {
  name: string;
  age: string;
  occupation: string;
  status: string;
  location: string;
  tier: string;
  archetype: string;
  traits: string[];
  motivations: Record<string, number>;
  personality: Record<string, number>;
  behaviour: string[];
  frustrations: string[];
  goals: string[];
  quote: string;
}

export type { PersonaSummary };
export const PersonaSummaryCard: React.FC<{ persona: PersonaSummary; avatarUrl?: string }> = ({ persona, avatarUrl }) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 grid md:grid-cols-3 gap-8 animate-fade-in">
      {/* Left: Avatar and Name */}
      <div className="flex flex-col items-center md:items-start gap-6 col-span-1">
        <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-tr from-reddit-orange via-reddit-blue to-reddit-purple flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt={persona.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-white">
              {persona.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-reddit-orange mb-1">{persona.name}</h2>
          <div className="text-gray-700 dark:text-gray-200 text-lg font-medium mb-2">{persona.archetype}</div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Age: {persona.age}</span>
            <span>Occupation: {persona.occupation}</span>
            <span>Status: {persona.status}</span>
            <span>Location: {persona.location}</span>
            <span>Tier: {persona.tier}</span>
          </div>
        </div>
        <div className="bg-reddit-orange/90 text-white rounded-xl px-4 py-3 mt-4 text-center text-lg font-semibold shadow">
          “{persona.quote}”
        </div>
      </div>
      {/* Middle: Motivations & Personality */}
      <div className="col-span-1 flex flex-col gap-8">
        <div>
          <h3 className="text-xl font-bold text-reddit-orange mb-2">Motivations</h3>
          <div className="space-y-2">
            {Object.entries(persona.motivations || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-32 capitalize text-gray-700 dark:text-gray-200">{key.replace('_', ' ')}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-reddit-orange to-reddit-blue h-3 rounded" style={{ width: `${(Number(value) / 5) * 100}%` }} />
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{value}/5</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-reddit-purple mb-2">Personality</h3>
          <div className="space-y-2">
            {Object.entries(persona.personality || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-32 capitalize text-gray-700 dark:text-gray-200">{key}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-reddit-purple to-reddit-blue h-3 rounded" style={{ width: `${(Number(value) / 5) * 100}%` }} />
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{value}/5</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-reddit-blue mb-2">Traits</h3>
          <div className="flex flex-wrap gap-2">
            {persona.traits?.map((trait, i) => (
              <span key={i} className="bg-gradient-to-r from-reddit-orange to-reddit-blue text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Right: Behaviour, Frustrations, Goals */}
      <div className="col-span-1 flex flex-col gap-8">
        <div>
          <h3 className="text-xl font-bold text-reddit-orange mb-2">Behaviour & Habits</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-200">
            {persona.behaviour?.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-reddit-orange mb-2">Frustrations</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-200">
            {persona.frustrations?.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-reddit-orange mb-2">Goals & Needs</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-200">
            {persona.goals?.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}; 