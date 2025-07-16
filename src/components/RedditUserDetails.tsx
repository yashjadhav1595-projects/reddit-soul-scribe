import React, { useState } from 'react';
import { Copy, Share2, MailCheck, ShieldCheck, Star, Sun, Moon } from 'lucide-react';
import { Modal } from './ui/Modal'; // Assume a modal component exists or use a simple implementation
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import type html2canvasType from 'html2canvas';

interface RedditUserDetailsProps {
  userData: any;
}

const RedditUserDetails: React.FC<RedditUserDetailsProps> = ({ userData }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  if (!userData) return null;

  const { userInfo, submitted, comments, overview, activityAnalysis, summary } = userData;

  const handleCopy = () => {
    navigator.clipboard.writeText(`u/${userInfo?.name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Reddit Profile: u/${userInfo?.name}`,
        url: `https://reddit.com/user/${userInfo?.name}`
      });
    } else {
      window.open(`https://reddit.com/user/${userInfo?.name}`, '_blank');
    }
  };

  // Prepare data for charts
  const chartData = [
    { name: 'Posts', value: summary?.total_posts || 0 },
    { name: 'Comments', value: summary?.total_comments || 0 },
    { name: 'Karma', value: summary?.total_karma || 0 },
  ];
  const engagementData = [
    { metric: 'Avg Post Score', value: activityAnalysis?.engagement?.avgPostScore || 0 },
    { metric: 'Avg Comment Score', value: activityAnalysis?.engagement?.avgCommentScore || 0 },
    { metric: 'Engagement/Post', value: activityAnalysis?.engagement?.engagementPerPost || 0 },
  ];
  const patternData = [
    { name: 'Active', value: activityAnalysis?.patterns?.isActive ? 1 : 0 },
    { name: 'Engaged', value: activityAnalysis?.patterns?.isEngaged ? 1 : 0 },
    { name: 'Content Creator', value: activityAnalysis?.patterns?.isContentCreator ? 1 : 0 },
    { name: 'Commenter', value: activityAnalysis?.patterns?.isCommenter ? 1 : 0 },
  ];
  const subredditData = summary?.most_active_subreddits?.map((sr: any) => ({ name: sr.subreddit, value: sr.count })) || [];
  const COLORS = ['#ff4500', '#0079d3', '#a06ee1', '#34d399', '#fbbf24', '#6366f1'];

  // Example: time series for karma growth (if available)
  const karmaHistory = activityAnalysis?.karmaHistory || [];

  // Example: AI predictions and recommendations (from Groq or summary)
  const aiPredictions = activityAnalysis?.aiPredictions || summary?.aiPredictions || [];
  const aiRecommendations = activityAnalysis?.aiRecommendations || summary?.aiRecommendations || [];

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-white/90 to-gray-100/80 dark:from-gray-900/90 dark:to-gray-800/80 border border-gray-200 dark:border-gray-700 transition-colors">
      {/* Profile Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative flex-shrink-0">
          {userInfo?.snoovatar_img || userInfo?.icon_img ? (
            <img
              src={userInfo.snoovatar_img || userInfo.icon_img}
              alt={`Avatar of u/${userInfo.name}`}
              className="h-24 w-24 rounded-full border-4 border-gradient-to-tr from-reddit-orange via-reddit-blue to-reddit-purple shadow-lg bg-white dark:bg-gray-900 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-reddit-orange via-reddit-blue to-reddit-purple flex items-center justify-center text-4xl font-bold text-white">
              {userInfo?.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          {userInfo?.has_verified_email && (
            <MailCheck className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 w-7 h-7 border-2 border-white dark:border-gray-900 shadow" aria-label="Verified Email" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white truncate">u/{userInfo?.name}</h2>
            {userInfo?.is_mod && <ShieldCheck className="text-blue-500" aria-label="Moderator" />}
            {userInfo?.is_gold && <Star className="text-yellow-400" aria-label="Reddit Gold" />}
          </div>
          <div className="flex flex-wrap gap-2 items-center text-sm mb-2">
            <span className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded font-semibold">Karma: {userInfo?.total_karma}</span>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">Link: {userInfo?.link_karma}</span>
            <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded">Comment: {userInfo?.comment_karma}</span>
            <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded">Account Age: {userInfo?.account_age_days} days</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-reddit-orange to-reddit-blue text-white font-semibold shadow hover:scale-105 transition" aria-label="Copy username">
              <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleShare} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 transition" aria-label="Share profile">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">Joined: {userInfo?.created?.slice(0, 10)}</div>
        </div>
      </div>

      {/* Tabs for Posts, Comments, Overview */}
      <div className="mb-4">
        <Tabs userData={{ submitted, comments, overview, activityAnalysis, summary }} />
      </div>
      {/* Raw JSON Toggle */}
      <div className="mt-4">
        <button
          className="text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition"
          onClick={() => setShowRaw((v) => !v)}
        >
          {showRaw ? 'Hide Raw JSON' : 'Show Raw JSON'}
        </button>
        {showRaw && (
          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto max-h-96 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
            {JSON.stringify(userData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// Enhanced Tabs component for Posts, Comments, Overview, Activity
const Tabs: React.FC<{ userData: any }> = ({ userData }) => {
  const [tab, setTab] = useState<'posts' | 'comments' | 'overview' | 'activity'>('posts');
  const { submitted, comments, overview, activityAnalysis, summary } = userData;
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const tabList = [
    { key: 'posts', label: 'Posts', color: 'from-reddit-orange to-reddit-yellow' },
    { key: 'comments', label: 'Comments', color: 'from-reddit-blue to-reddit-purple' },
    { key: 'overview', label: 'Overview', color: 'from-reddit-purple to-reddit-orange' },
    { key: 'activity', label: 'Activity', color: 'from-gray-800 to-gray-600' },
  ];

  // Prepare data for charts
  const chartData = [
    { name: 'Posts', value: summary?.total_posts || 0 },
    { name: 'Comments', value: summary?.total_comments || 0 },
    { name: 'Karma', value: summary?.total_karma || 0 },
  ];
  const engagementData = [
    { metric: 'Avg Post Score', value: activityAnalysis?.engagement?.avgPostScore || 0 },
    { metric: 'Avg Comment Score', value: activityAnalysis?.engagement?.avgCommentScore || 0 },
    { metric: 'Engagement/Post', value: activityAnalysis?.engagement?.engagementPerPost || 0 },
  ];
  const patternData = [
    { name: 'Active', value: activityAnalysis?.patterns?.isActive ? 1 : 0 },
    { name: 'Engaged', value: activityAnalysis?.patterns?.isEngaged ? 1 : 0 },
    { name: 'Content Creator', value: activityAnalysis?.patterns?.isContentCreator ? 1 : 0 },
    { name: 'Commenter', value: activityAnalysis?.patterns?.isCommenter ? 1 : 0 },
  ];
  const subredditData = summary?.most_active_subreddits?.map((sr: any) => ({ name: sr.subreddit, value: sr.count })) || [];
  const COLORS = ['#ff4500', '#0079d3', '#a06ee1', '#34d399', '#fbbf24', '#6366f1'];

  // Example: time series for karma growth (if available)
  const karmaHistory = activityAnalysis?.karmaHistory || [];

  // Example: AI predictions and recommendations (from Groq or summary)
  const aiPredictions = activityAnalysis?.aiPredictions || summary?.aiPredictions || [];
  const aiRecommendations = activityAnalysis?.aiRecommendations || summary?.aiRecommendations || [];

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center flex-wrap">
        {tabList.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange transition-all duration-200 shadow-sm
              ${tab === t.key
                ? `bg-gradient-to-r ${t.color} text-white scale-105`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setTab(t.key as any)}
            aria-selected={tab === t.key}
            aria-controls={`tab-panel-${t.key}`}
          >
            {t.label}
          </button>
        ))}
        {/* AI Analysis Button in tab row */}
        <button
          className="ml-2 px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-reddit-orange to-reddit-blue text-white shadow hover:scale-105 transition"
          onClick={() => setShowAIAnalysis(true)}
        >
          AI Analysis
        </button>
      </div>
      {/* AI Analysis Modal */}
      {showAIAnalysis && (
        <Modal onClose={() => setShowAIAnalysis(false)} title="AI Data Analysis">
          <div className="space-y-8 max-w-2xl mx-auto animate-fade-in">
            <div className="flex flex-wrap gap-4 justify-end">
              <button
                className="px-3 py-1 rounded bg-gradient-to-r from-reddit-blue to-reddit-purple text-white font-semibold shadow hover:scale-105 transition"
                onClick={() => {
                  // Download as image using html2canvas or similar (pseudo-code)
                  const el = document.getElementById('ai-analysis-charts');
                  if (el) import('html2canvas').then(html2canvas => {
                    html2canvas.default(el).then(canvas => {
                      const link = document.createElement('a');
                      link.download = 'reddit-ai-analysis.png';
                      link.href = canvas.toDataURL();
                      link.click();
                    });
                  });
                }}
                aria-label="Download analysis as image"
              >
                Download as Image
              </button>
            </div>
            <div id="ai-analysis-charts" className="grid md:grid-cols-2 gap-8">
              {/* Bar Chart: Posts, Comments, Karma */}
              <div>
                <h4 className="font-semibold mb-2 text-reddit-orange">Posts, Comments, Karma</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Shows the total number of posts, comments, and karma for this user.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} aria-label="Posts, Comments, Karma Bar Chart">
                    <XAxis dataKey="name" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip contentStyle={{ background: '#222', color: '#fff', borderRadius: 8 }} />
                    <Bar dataKey="value" fill="#ff4500" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[0] }} /> Posts
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[1] }} /> Comments
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[2] }} /> Karma
                </div>
              </div>
              {/* Pie Chart: Patterns */}
              <div>
                <h4 className="font-semibold mb-2 text-reddit-blue">User Patterns</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Shows detected behavioral patterns for this user.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart aria-label="User Patterns Pie Chart">
                    <Pie
                      data={patternData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label
                    >
                      {patternData.map((entry, index) => (
                        <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#222', color: '#fff', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-2 mt-2 text-xs">
                  {patternData.map((entry, i) => (
                    <span key={i} className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {entry.name}</span>
                  ))}
                </div>
              </div>
              {/* Pie Chart: Subreddit Distribution */}
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2 text-reddit-purple">Subreddit Distribution</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Shows which subreddits the user is most active in.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart aria-label="Subreddit Distribution Pie Chart">
                    <Pie
                      data={subredditData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#a06ee1"
                      label
                    >
                      {subredditData.map((entry: any, index: number) => (
                        <Cell key={`cell-subreddit-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#222', color: '#fff', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-2 mt-2 text-xs flex-wrap">
                  {subredditData.map((entry: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> r/{entry.name}</span>
                  ))}
                </div>
              </div>
              {/* Radar Chart: Engagement */}
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2 text-reddit-purple">Engagement Metrics</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Compares post score, comment score, and engagement per post.</div>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius={80} data={engagementData} aria-label="Engagement Metrics Radar Chart">
                    <PolarGrid stroke="#8884d8" />
                    <PolarAngleAxis dataKey="metric" stroke="#8884d8" />
                    <Radar name="Engagement" dataKey="value" stroke="#a06ee1" fill="#a06ee1" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip contentStyle={{ background: '#222', color: '#fff', borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {/* Line Chart: Karma History (if available) */}
              {karmaHistory.length > 1 && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-2 text-reddit-orange">Karma Growth Over Time</h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Shows how the user's karma has changed over time.</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={karmaHistory} aria-label="Karma Growth Bar Chart">
                      <XAxis dataKey="date" stroke="#8884d8" />
                      <YAxis stroke="#8884d8" />
                      <Tooltip contentStyle={{ background: '#222', color: '#fff', borderRadius: 8 }} />
                      <Bar dataKey="karma" fill="#ff4500" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            {/* AI Predictions and Recommendations */}
            {(aiPredictions.length > 0 || aiRecommendations.length > 0) && (
              <div className="mt-8">
                {aiPredictions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-reddit-blue mb-2">AI Predictions</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-200">
                      {aiPredictions.map((pred: string, i: number) => (
                        <li key={i}>{pred}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiRecommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-reddit-orange mb-2">AI Recommendations</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-200">
                      {aiRecommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-700 text-white font-semibold shadow hover:scale-105 transition"
                onClick={() => setShowAIAnalysis(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="transition-all duration-300">
        {tab === 'posts' && (
          <div className="space-y-3" id="tab-panel-posts" role="tabpanel">
            {submitted?.posts?.length ? submitted.posts.map((post: any, i: number) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition">
                <div className="font-semibold text-reddit-orange dark:text-reddit-orange-light text-lg mb-1">{post.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">r/{post.subreddit} • Score: {post.score}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{post.content?.slice(0, 200) || <span className="italic text-gray-400">[No content]</span>}</div>
              </div>
            )) : <div className="text-gray-400 italic text-center">No posts found.</div>}
          </div>
        )}
        {tab === 'comments' && (
          <div className="space-y-3" id="tab-panel-comments" role="tabpanel">
            {comments?.comments?.length ? comments.comments.map((comment: any, i: number) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">r/{comment.subreddit} • Score: {comment.score}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{comment.content?.slice(0, 200) || <span className="italic text-gray-400">[No content]</span>}</div>
              </div>
            )) : <div className="text-gray-400 italic text-center">No comments found.</div>}
          </div>
        )}
        {tab === 'overview' && (
          <div className="space-y-3" id="tab-panel-overview" role="tabpanel">
            {overview?.items?.length ? overview.items.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition">
                <div className="font-semibold text-reddit-orange dark:text-reddit-orange-light text-lg mb-1">{item.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">r/{item.subreddit} • Score: {item.score}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{item.content?.slice(0, 200) || <span className="italic text-gray-400">[No content]</span>}</div>
              </div>
            )) : <div className="text-gray-400 italic text-center">No overview items found.</div>}
          </div>
        )}
        {tab === 'activity' && (
          <div className="space-y-3" id="tab-panel-activity" role="tabpanel">
            {/* Summary Card */}
            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-lg flex items-center gap-2">
                <span>Summary</span>
              </div>
              <div className="flex flex-wrap gap-3 mb-2">
                <span className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded font-semibold">Total Posts: {summary?.total_posts}</span>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded font-semibold">Total Comments: {summary?.total_comments}</span>
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded font-semibold">Total Karma: {summary?.total_karma}</span>
                <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded font-semibold">Karma/Day: {summary?.karma_per_day?.toFixed(2)}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Most Active Subreddits:</span>
                {summary?.most_active_subreddits?.length ? summary.most_active_subreddits.map((sr: any, i: number) => (
                  <span key={i} className="bg-gradient-to-r from-reddit-orange to-reddit-blue text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">r/{sr.subreddit} ({sr.count})</span>
                )) : <span className="italic text-gray-400">None</span>}
              </div>
            </div>

            {/* Activity Analysis Card */}
            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-lg flex items-center gap-2">
                <span>Activity Analysis</span>
              </div>
              {activityAnalysis ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Activity Level */}
                  <div>
                    <div className="font-semibold text-reddit-orange mb-1 flex items-center gap-1">Activity Level</div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Posts/Day: <span className="font-bold">{activityAnalysis.activityLevel?.postsPerDay ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Comments/Day: <span className="font-bold">{activityAnalysis.activityLevel?.commentsPerDay ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Recent Activity: <span className="font-bold">{activityAnalysis.activityLevel?.recentActivity ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Total Activity: <span className="font-bold">{activityAnalysis.activityLevel?.totalActivity ?? '-'}</span></div>
                  </div>
                  {/* Content Analysis */}
                  <div>
                    <div className="font-semibold text-reddit-blue mb-1 flex items-center gap-1">Content Analysis</div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Self Posts: <span className="font-bold">{activityAnalysis.contentAnalysis?.selfPosts ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Link Posts: <span className="font-bold">{activityAnalysis.contentAnalysis?.linkPosts ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Self/Link Ratio: <span className="font-bold">{activityAnalysis.contentAnalysis?.selfPostRatio ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Avg Post Score: <span className="font-bold">{activityAnalysis.contentAnalysis?.avgPostScore ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Avg Comment Score: <span className="font-bold">{activityAnalysis.contentAnalysis?.avgCommentScore ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Total Engagement: <span className="font-bold">{activityAnalysis.contentAnalysis?.totalEngagement ?? '-'}</span></div>
                  </div>
                  {/* Engagement */}
                  <div>
                    <div className="font-semibold text-reddit-purple mb-1 flex items-center gap-1">Engagement</div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Avg Post Score: <span className="font-bold">{activityAnalysis.engagement?.avgPostScore ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Avg Comment Score: <span className="font-bold">{activityAnalysis.engagement?.avgCommentScore ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Total Engagement: <span className="font-bold">{activityAnalysis.engagement?.totalEngagement ?? '-'}</span></div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">Engagement/Post: <span className="font-bold">{activityAnalysis.engagement?.engagementPerPost?.toFixed(2) ?? '-'}</span></div>
                  </div>
                  {/* Patterns */}
                  <div>
                    <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">Patterns</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activityAnalysis.patterns?.isActive && <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">Active</span>}
                      {activityAnalysis.patterns?.isEngaged && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-semibold">Engaged</span>}
                      {activityAnalysis.patterns?.isContentCreator && <span className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded-full text-xs font-semibold">Content Creator</span>}
                      {activityAnalysis.patterns?.isCommenter && <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-semibold">Commenter</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 italic">No activity analysis available.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedditUserDetails; 