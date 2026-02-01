// ============================================================================
// JARVIS Analytics Platform - Proprietary Marketing Intelligence System
// © 2026 Open Jar Studios, LLC | Powered by Claude Sonnet 4.5
// Lidless Analytics Engine v2.0
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis,
  Treemap, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, Target, Brain, Activity, Eye, LogOut, Menu, X,
  Sparkles, ChevronRight, ChevronLeft, ChevronDown, Settings, Bell, Search,
  ArrowUpRight, ArrowDownRight, Zap, Globe, Instagram, Facebook, Linkedin, Twitter,
  Youtube, DollarSign, UserPlus, BarChart3, Plus, Trash2, ExternalLink, Filter,
  Download, RefreshCw, Calendar, MoreHorizontal, Lightbulb, AlertTriangle,
  CheckCircle2, Clock, Star, Heart, MessageCircle, Share2, Shield, Briefcase,
  Building2, ShoppingBag, PieChart as PieChartIcon, Layers, Link2, Plug,
  FileBarChart, Megaphone, SlidersHorizontal, Copy, Check, AlertCircle,
  BarChart2, Moon, Sun, Mail, Key, Smartphone,
  MapPin, Hash, Percent, MousePointer, Maximize2, Minimize2, ChevronUp
} from 'lucide-react';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatCurrency = (value, compact = false) => {
  if (compact) {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

const formatCompact = (value) => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value?.toString() || '0';
};

const formatPercent = (value, showSign = true) => {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value?.toFixed(1) || '0'}%`;
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ============================================================================
// THEME & DESIGN TOKENS
// ============================================================================

const COLORS = {
  primary: '#DC143C',
  primaryDark: '#B91C3C',
  primaryLight: '#EF4444',
  accent: '#F87171',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  chart: ['#DC143C', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'],
};

// ============================================================================
// DATA MODELS & MOCK DATA ENGINE
// ============================================================================

const BUSINESS_TYPES = [
  { value: 'B2C', label: 'B2C', desc: 'Business to Consumer', icon: '👥' },
  { value: 'B2B', label: 'B2B', desc: 'Business to Business', icon: '🏢' },
  { value: 'B2G', label: 'B2G', desc: 'Business to Government', icon: '🏛️' },
  { value: 'D2C', label: 'D2C', desc: 'Direct to Consumer', icon: '📦' },
];

const CATEGORIES = [
  'Food/Beverage', 'Apparel', 'Hardware/Tools', 'Fitness',
  'Healthcare & Wellness', 'Beauty/Fashion', 'Software/SaaS', 'Service',
  'Finance', 'Education', 'Real Estate', 'Entertainment',
  'Travel', 'Automotive', 'Home & Garden', 'Electronics',
];

const SUB_CATEGORIES = [
  'E-Commerce/Online', 'Franchise/Chain', 'Brick and Mortar', 'Retail',
  'Wholesale', 'Marketplace', 'Direct Sales', 'Subscription',
];

const SERVICE_AREAS = ['Local', 'Regional', 'Nationwide', 'Global'];

const CATEGORY_PRODUCTS = {
  'Food/Beverage': ['Protein Shakes', 'Energy Drinks', 'Organic Snacks', 'Meal Kits', 'Coffee/Tea', 'Supplements', 'Juice Bars', 'Frozen Meals'],
  'Apparel': ['Athletic Wear', 'Casual Clothing', 'Formal Wear', 'Accessories', 'Footwear', 'Outerwear', 'Swimwear', 'Underwear'],
  'Hardware/Tools': ['Power Tools', 'Hand Tools', 'Smart Home Devices', 'Safety Equipment', 'Storage Solutions', 'Plumbing', 'Electrical'],
  'Fitness': ['Gym Equipment', 'Wearables', 'Workout Programs', 'Nutrition Plans', 'Recovery Tools', 'Yoga Gear', 'Boxing Equipment'],
  'Healthcare & Wellness': ['Telehealth', 'Mental Health', 'Physical Therapy', 'Wellness Coaching', 'Medical Devices', 'Supplements'],
  'Beauty/Fashion': ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Beauty Tools', 'Nail Care', 'Suncare'],
  'Software/SaaS': ['CRM Software', 'Marketing Automation', 'Analytics Tools', 'Project Management', 'HR Software', 'Accounting'],
  'Service': ['Consulting', 'Training', 'Maintenance', 'Installation', 'Support Services', 'Cleaning', 'Landscaping'],
  'Finance': ['Banking', 'Insurance', 'Investment', 'Crypto', 'Lending', 'Tax Services'],
  'Education': ['Online Courses', 'Tutoring', 'Certifications', 'EdTech Tools', 'Language Learning'],
};

const DEMOGRAPHIC_OPTIONS = {
  gender: ['Male', 'Female', 'Non-Binary', 'All'],
  age: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
  income: ['Under $30K', '$30K-$50K', '$50K-$75K', '$75K-$100K', '$100K-$150K', '$150K+'],
  hobbies: ['Gaming', 'Sports', 'Fashion', 'Technology', 'Fitness', 'Reading', 'Travel', 'Cooking', 'Music', 'Art', 'Photography', 'Outdoors', 'Investing', 'Wellness', 'DIY'],
};

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
];

// Mock data generator functions
const generateCompetitor = (name) => ({
  id: generateId(),
  name,
  website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
  monthlyAdSpend: Math.floor(Math.random() * 80000) + 15000,
  estimatedRevenue: Math.floor(Math.random() * 8000000) + 500000,
  domainAuthority: Math.floor(Math.random() * 40) + 35,
  monthlyTraffic: Math.floor(Math.random() * 500000) + 50000,
  trafficGrowth: (Math.random() * 30 - 5).toFixed(1),
  socialFollowers: {
    instagram: Math.floor(Math.random() * 150000) + 10000,
    facebook: Math.floor(Math.random() * 100000) + 5000,
    twitter: Math.floor(Math.random() * 60000) + 3000,
    linkedin: Math.floor(Math.random() * 30000) + 2000,
    youtube: Math.floor(Math.random() * 80000) + 5000,
    tiktok: Math.floor(Math.random() * 200000) + 10000,
  },
  adPerformance: {
    ctr: (Math.random() * 3.5 + 0.8).toFixed(2),
    cpc: (Math.random() * 4.5 + 0.3).toFixed(2),
    cpm: (Math.random() * 15 + 5).toFixed(2),
    roas: (Math.random() * 5 + 1.5).toFixed(2),
    conversionRate: (Math.random() * 5 + 1).toFixed(2),
  },
  contentStrategy: {
    postFrequency: Math.floor(Math.random() * 5) + 1,
    topContentTypes: ['Video', 'Carousel', 'Story', 'Reels'][Math.floor(Math.random() * 4)],
    engagementRate: (Math.random() * 6 + 1.5).toFixed(2),
  },
  seo: {
    organicKeywords: Math.floor(Math.random() * 5000) + 500,
    backlinks: Math.floor(Math.random() * 10000) + 1000,
    topKeywords: ['brand fitness', 'online workout', 'nutrition plan'].slice(0, Math.floor(Math.random() * 3) + 1),
  },
  strengths: ['Brand recognition', 'Content quality', 'Customer service', 'Pricing', 'Product range'][Math.floor(Math.random() * 5)],
  weaknesses: ['Low engagement', 'Poor SEO', 'Slow response time', 'Limited content', 'High CPA'][Math.floor(Math.random() * 5)],
  opportunityGap: Math.floor(Math.random() * 45) + 15,
});

const generateInfluencer = (name, platform, followers, engagement, matchScore) => ({
  id: generateId(),
  name,
  handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
  platform,
  followers,
  engagement,
  matchScore,
  growthRate: (Math.random() * 25 + 3).toFixed(1),
  authenticity: Math.floor(Math.random() * 15) + 85,
  avgLikes: Math.floor(followers * (engagement / 100) * 0.8),
  avgComments: Math.floor(followers * (engagement / 100) * 0.15),
  estimatedCost: { min: Math.floor(followers / 100) * 2, max: Math.floor(followers / 100) * 5 },
  niche: ['Fitness', 'Lifestyle', 'Tech', 'Fashion', 'Beauty', 'Food'][Math.floor(Math.random() * 6)],
  audienceDemographics: {
    female: Math.floor(Math.random() * 40) + 30,
    male: 0,
    age2534: Math.floor(Math.random() * 30) + 25,
    usaBased: Math.floor(Math.random() * 30) + 40,
  },
  recentPosts: ['Workout routines', 'Product reviews', 'Quick tips', 'How-to guides', 'Behind the scenes'],
  previousBrands: ['Nike', 'Apple', 'Sephora', 'Lululemon', 'Samsung', 'Glossier', 'Whole Foods'].sort(() => Math.random() - 0.5).slice(0, 3),
});

const generateAnalysisData = (formData) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return {
    // Customer Avatar
    avatar: {
      name: `${formData.category || 'Industry'} Enthusiast`,
      description: `Target: ${formData.demographics.age[0] || 'All Ages'}, interested in ${formData.demographics.hobbies.slice(0, 3).join(', ') || 'various activities'}`,
      marketSize: Math.floor(Math.random() * 80000000) + 15000000,
      growthRate: (Math.random() * 18 + 5).toFixed(1),
      confidence: Math.floor(Math.random() * 8) + 92,
      tam: Math.floor(Math.random() * 500000000) + 100000000,
      sam: Math.floor(Math.random() * 100000000) + 20000000,
      som: Math.floor(Math.random() * 20000000) + 5000000,
    },

    // Your Business Metrics
    yourMetrics: {
      website: formData.website,
      estimatedTraffic: Math.floor(Math.random() * 150000) + 20000,
      trafficGrowth: (Math.random() * 25 + 5).toFixed(1),
      domainAuthority: Math.floor(Math.random() * 35) + 30,
      socialReach: Object.values(formData.socialHandles).filter(h => h).length * 25000 + Math.floor(Math.random() * 50000),
      contentScore: Math.floor(Math.random() * 25) + 65,
      brandSentiment: Math.floor(Math.random() * 20) + 75,
      shareOfVoice: (Math.random() * 15 + 5).toFixed(1),
      customerSatisfaction: Math.floor(Math.random() * 15) + 80,
    },

    // Revenue & Performance
    revenueData: months.slice(0, 12).map((month, i) => ({
      month,
      revenue: Math.floor(250000 + i * 45000 + Math.random() * 80000),
      spend: Math.floor(40000 + i * 8000 + Math.random() * 15000),
      profit: Math.floor(180000 + i * 30000 + Math.random() * 50000),
      conversions: Math.floor(800 + i * 150 + Math.random() * 300),
      predicted: i > currentMonth ? Math.floor(300000 + i * 55000 + Math.random() * 60000) : null,
    })),

    // Campaign Performance
    campaignMetrics: months.slice(0, 8).map((month, i) => ({
      month,
      roi: Math.floor(220 + i * 35 + Math.random() * 40),
      engagement: Math.floor(10000 + i * 3000 + Math.random() * 5000),
      conversions: Math.floor(700 + i * 200 + Math.random() * 400),
      reach: Math.floor(150000 + i * 30000 + Math.random() * 50000),
      impressions: Math.floor(500000 + i * 80000 + Math.random() * 100000),
      ctr: (1.5 + i * 0.2 + Math.random() * 0.5).toFixed(2),
    })),

    // Competitor Analysis
    competitorAnalysis: formData.competitors.map(comp => ({
      ...comp,
      strengthScore: Math.floor(Math.random() * 30) + 55,
      weaknessAreas: ['Content Frequency', 'Engagement Rate', 'Ad Creative Variety', 'Mobile UX', 'SEO Strategy', 'Social Response Time'][Math.floor(Math.random() * 6)],
      opportunityGap: Math.floor(Math.random() * 40) + 15,
      threatLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    })),

    // Competitor Spend Intelligence
    adIntelligence: {
      totalMarketSpend: formData.competitors.reduce((sum, c) => sum + c.monthlyAdSpend, 0) || 250000,
      averageCPC: formData.competitors.length > 0
        ? (formData.competitors.reduce((sum, c) => sum + parseFloat(c.adPerformance.cpc), 0) / formData.competitors.length).toFixed(2)
        : '2.35',
      averageROAS: formData.competitors.length > 0
        ? (formData.competitors.reduce((sum, c) => sum + parseFloat(c.adPerformance.roas), 0) / formData.competitors.length).toFixed(2)
        : '3.80',
      averageCTR: formData.competitors.length > 0
        ? (formData.competitors.reduce((sum, c) => sum + parseFloat(c.adPerformance.ctr), 0) / formData.competitors.length).toFixed(2)
        : '2.10',
      topPerformingAds: [
        { competitor: formData.competitors[0]?.name || 'Competitor A', type: 'Video Ad', platform: 'Facebook', spend: 18500, conversions: 520, cpa: 35.58, creative: 'Before/After transformation video with UGC testimonials' },
        { competitor: formData.competitors[1]?.name || 'Competitor B', type: 'Carousel', platform: 'Instagram', spend: 12400, conversions: 380, cpa: 32.63, creative: 'Product features showcase with lifestyle imagery' },
        { competitor: formData.competitors[0]?.name || 'Competitor A', type: 'Story Ad', platform: 'Instagram', spend: 7800, conversions: 245, cpa: 31.84, creative: 'User testimonial clips with swipe-up CTA' },
        { competitor: formData.competitors[2]?.name || 'Competitor C', type: 'Reels', platform: 'TikTok', spend: 9200, conversions: 410, cpa: 22.44, creative: 'Trending audio with product demo hook' },
      ],
      spendTrend: months.slice(0, 8).map((month, i) => ({
        month,
        totalSpend: Math.floor(85000 + i * 12000 + Math.random() * 20000),
        yourSpend: Math.floor(35000 + i * 5000 + Math.random() * 10000),
        conversions: Math.floor(2200 + i * 300 + Math.random() * 500),
      })),
      platformBreakdown: [
        { platform: 'Meta (FB/IG)', spend: 185000, impressions: 45000000, clicks: 920000, conversions: 4800, roas: 5.2, share: 38 },
        { platform: 'Google Ads', spend: 145000, impressions: 32000000, clicks: 750000, conversions: 4200, roas: 4.6, share: 30 },
        { platform: 'TikTok', spend: 95000, impressions: 28000000, clicks: 480000, conversions: 2800, roas: 6.1, share: 19 },
        { platform: 'LinkedIn', spend: 42000, impressions: 8000000, clicks: 140000, conversions: 480, roas: 2.8, share: 9 },
        { platform: 'YouTube', spend: 18000, impressions: 5200000, clicks: 98000, conversions: 350, roas: 3.4, share: 4 },
      ],
    },

    // Influencer Discovery
    influencerOpportunities: [
      generateInfluencer('Sarah Wellness', 'Instagram', 485000, 5.8, 96),
      generateInfluencer('Tech Mike Reviews', 'YouTube', 892000, 7.2, 91),
      generateInfluencer('Emma Lifestyle', 'TikTok', 520000, 8.9, 93),
      generateInfluencer('David Business Coach', 'LinkedIn', 145000, 3.8, 82),
      generateInfluencer('Fitness Jenna', 'Instagram', 320000, 6.4, 89),
      generateInfluencer('Alex Creates', 'TikTok', 1200000, 9.2, 87),
      generateInfluencer('Maria Health', 'YouTube', 280000, 5.5, 90),
      generateInfluencer('Ryan Outdoors', 'Instagram', 195000, 7.1, 85),
    ],

    // Psychographic Profile
    psychographics: [
      { trait: 'Innovation Seeking', value: 85, benchmark: 65 },
      { trait: 'Brand Loyalty', value: 72, benchmark: 58 },
      { trait: 'Price Sensitivity', value: 45, benchmark: 62 },
      { trait: 'Social Influence', value: 78, benchmark: 55 },
      { trait: 'Sustainability', value: 68, benchmark: 52 },
      { trait: 'Quality Focus', value: 82, benchmark: 70 },
      { trait: 'Early Adopter', value: 75, benchmark: 48 },
      { trait: 'Community Driven', value: 70, benchmark: 50 },
    ],

    // Content Strategy
    contentStrategy: [
      { platform: 'Instagram', engagement: 5.8, reach: 245000, recommended: true, trend: 'up', competitorPresence: 95, bestContent: 'Reels & Carousels', optimalTime: '6-9 PM' },
      { platform: 'TikTok', engagement: 9.2, reach: 420000, recommended: true, trend: 'up', competitorPresence: 78, bestContent: 'Short-form Video', optimalTime: '7-10 PM' },
      { platform: 'YouTube', engagement: 4.5, reach: 185000, recommended: true, trend: 'up', competitorPresence: 82, bestContent: 'Tutorials & Reviews', optimalTime: '2-5 PM' },
      { platform: 'Facebook', engagement: 3.2, reach: 138000, recommended: false, trend: 'down', competitorPresence: 88, bestContent: 'Video & Groups', optimalTime: '12-3 PM' },
      { platform: 'LinkedIn', engagement: 4.1, reach: 72000, recommended: formData.businessType === 'B2B', trend: 'stable', competitorPresence: 45, bestContent: 'Thought Leadership', optimalTime: '8-10 AM' },
      { platform: 'Twitter/X', engagement: 2.8, reach: 95000, recommended: false, trend: 'down', competitorPresence: 65, bestContent: 'News & Commentary', optimalTime: '12-2 PM' },
      { platform: 'Reddit', engagement: 7.5, reach: 55000, recommended: true, trend: 'up', competitorPresence: 22, bestContent: 'AMAs & Discussions', optimalTime: '9-11 AM' },
      { platform: 'Pinterest', engagement: 3.8, reach: 68000, recommended: formData.category === 'Beauty/Fashion', trend: 'stable', competitorPresence: 35, bestContent: 'Pins & Boards', optimalTime: '8-11 PM' },
    ],

    // Content Mix Analysis
    contentMix: [
      { type: 'Short-form Video', percentage: 35, engagement: 8.2, growth: 42 },
      { type: 'Carousel/Slider', percentage: 22, engagement: 5.8, growth: 15 },
      { type: 'Stories', percentage: 18, engagement: 4.2, growth: 8 },
      { type: 'Long-form Video', percentage: 12, engagement: 6.5, growth: 25 },
      { type: 'Static Image', percentage: 8, engagement: 3.1, growth: -12 },
      { type: 'User Generated', percentage: 5, engagement: 9.4, growth: 55 },
    ],

    // SEO Intelligence
    seoIntelligence: {
      organicScore: Math.floor(Math.random() * 25) + 65,
      topKeywords: [
        { keyword: `best ${formData.category?.toLowerCase() || 'product'}`, volume: 14800, difficulty: 72, position: 12, cpc: 3.45 },
        { keyword: `${formData.category?.toLowerCase() || 'product'} reviews`, volume: 8900, difficulty: 58, position: 8, cpc: 2.80 },
        { keyword: `buy ${formData.category?.toLowerCase() || 'product'} online`, volume: 6400, difficulty: 65, position: 15, cpc: 4.20 },
        { keyword: `top ${formData.category?.toLowerCase() || 'brand'}`, volume: 5200, difficulty: 48, position: 6, cpc: 2.10 },
        { keyword: `${formData.category?.toLowerCase() || 'product'} comparison`, volume: 3800, difficulty: 42, position: 4, cpc: 3.60 },
      ],
      contentGaps: [
        'Long-form buying guides',
        'Video product comparisons',
        'Customer success stories',
        'Industry trend reports',
        'Interactive tools/calculators',
      ],
    },

    // Predictive Analytics
    predictions: {
      revenueForcast: months.map((month, i) => ({
        month,
        conservative: Math.floor(350000 + i * 28000),
        moderate: Math.floor(400000 + i * 45000),
        aggressive: Math.floor(450000 + i * 65000),
        actual: i <= currentMonth ? Math.floor(380000 + i * 40000 + Math.random() * 30000) : null,
      })),
      churnRisk: 12.5,
      ltvPrediction: 485,
      acquisitionCostTrend: 'decreasing',
      nextQuarterGrowth: (Math.random() * 20 + 10).toFixed(1),
      seasonalPeaks: ['November', 'December', 'March'],
    },

    // AI Insights
    insights: [
      {
        id: generateId(), title: 'Untapped Audience Segment', type: 'opportunity', priority: 'critical', confidence: 96,
        description: `AI detected a high-potential audience segment (Women 25-34, wellness-focused) with 78% lower CPA than current targeting. Estimated +$${Math.floor(Math.random() * 50000 + 30000).toLocaleString()} monthly revenue opportunity.`,
        action: 'Create targeted campaign on Instagram Reels and TikTok',
        estimatedImpact: '+35% conversions',
      },
      {
        id: generateId(), title: 'Conversion Rate Anomaly', type: 'anomaly', priority: 'critical', confidence: 98,
        description: 'Instagram Stories converting at 3.2x normal rate. AI identified the winning creative pattern: UGC testimonials with before/after hooks.',
        action: 'Scale winning creative and increase budget 40%',
        estimatedImpact: '+45% revenue from Stories',
      },
      {
        id: generateId(), title: 'Competitor Ad Spend Surge', type: 'risk', priority: 'high', confidence: 94,
        description: `Top competitor increased ad spend by 156% this week. Aggressively bidding on your brand keywords with ${Math.floor(Math.random() * 30 + 50)}% overlap.`,
        action: 'Implement defensive bid adjustments on brand terms',
        estimatedImpact: '-15% CPC on brand terms',
      },
      {
        id: generateId(), title: 'Optimal Posting Schedule', type: 'recommendation', priority: 'high', confidence: 91,
        description: 'Based on 90 days of engagement analysis: posting at 6:30 PM EST on Tue/Thu/Sat yields 47% higher engagement vs. random schedule.',
        action: 'Implement AI-optimized content calendar',
        estimatedImpact: '+47% engagement rate',
      },
      {
        id: generateId(), title: 'Influencer Partnership ROI', type: 'opportunity', priority: 'high', confidence: 89,
        description: 'Sarah Wellness (96% match score) has 3x higher conversion rate than paid ads for your demographic. Estimated 8.5x ROAS on influencer spend.',
        action: 'Initiate partnership with top 3 matched influencers',
        estimatedImpact: '8.5x ROAS',
      },
      {
        id: generateId(), title: 'Content Gap Detected', type: 'recommendation', priority: 'medium', confidence: 87,
        description: 'Competitors significantly underserving video content on TikTok and YouTube Shorts. Only 22% competitor presence on Reddit — massive blue ocean.',
        action: 'Launch TikTok content series and Reddit community',
        estimatedImpact: '+120K new audience reach',
      },
      {
        id: generateId(), title: 'Budget Reallocation Opportunity', type: 'recommendation', priority: 'medium', confidence: 85,
        description: 'Facebook ad ROAS declining (-18% QoQ) while TikTok ROAS increasing (+45% QoQ). Shifting 25% budget would optimize overall returns.',
        action: 'Reduce Facebook budget 25%, increase TikTok allocation',
        estimatedImpact: '+22% overall ROAS',
      },
      {
        id: generateId(), title: 'Seasonal Trend Alert', type: 'prediction', priority: 'medium', confidence: 92,
        description: 'Historical data indicates 35% demand surge in next 6 weeks. Competitors historically increase spend 2 weeks before peak — act now for first-mover advantage.',
        action: 'Pre-load campaigns and increase inventory',
        estimatedImpact: '+35% seasonal revenue capture',
      },
    ],

    // Funnel Analytics
    funnelData: [
      { stage: 'Impressions', value: 8500000, rate: 100 },
      { stage: 'Clicks', value: 425000, rate: 5.0 },
      { stage: 'Landing Page Views', value: 340000, rate: 80.0 },
      { stage: 'Add to Cart', value: 51000, rate: 15.0 },
      { stage: 'Checkout Initiated', value: 28000, rate: 54.9 },
      { stage: 'Purchases', value: 12450, rate: 44.5 },
    ],

    // Customer Journey Touchpoints
    touchpointData: [
      { touchpoint: 'Social Media Ad', attribution: 35, avgTouches: 2.4 },
      { touchpoint: 'Organic Search', attribution: 22, avgTouches: 1.8 },
      { touchpoint: 'Influencer Content', attribution: 18, avgTouches: 1.2 },
      { touchpoint: 'Email Marketing', attribution: 12, avgTouches: 3.1 },
      { touchpoint: 'Direct/Brand', attribution: 8, avgTouches: 1.0 },
      { touchpoint: 'Referral', attribution: 5, avgTouches: 1.5 },
    ],

    // Audience Heatmap (engagement by day/time)
    engagementHeatmap: (() => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
      return days.flatMap(day => hours.map(hour => ({
        day, hour,
        value: Math.floor(Math.random() * 100),
      })));
    })(),
  };
};

// ============================================================================
// CUSTOM TOOLTIP COMPONENT
// ============================================================================

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl">
      <p className="text-white font-semibold mb-2 text-sm">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm flex items-center gap-2" style={{ color: entry.color || '#fff' }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {typeof entry.value === 'number' ? formatCompact(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================

const MetricCard = ({ title, value, change, icon: Icon, iconBg, subtitle, prefix, suffix }) => {
  const isPositive = change > 0;
  return (
    <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-5 border border-gray-800 border-opacity-50 hover:border-red-900 hover:border-opacity-40 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-xl', iconBg || 'bg-red-900 bg-opacity-30')}>
          {Icon && <Icon className="w-5 h-5 text-red-400" />}
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold',
            isPositive ? 'bg-green-900 bg-opacity-30 text-green-400' : 'bg-red-900 bg-opacity-30 text-red-400'
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {formatPercent(Math.abs(change))}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-2xl lg:text-3xl font-bold text-gray-100">
        {prefix}{value}{suffix}
      </p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

// ============================================================================
// INSIGHT CARD COMPONENT
// ============================================================================

const InsightCard = ({ insight, onDismiss }) => {
  const iconMap = { opportunity: Lightbulb, anomaly: Zap, risk: AlertTriangle, recommendation: Sparkles, prediction: TrendingUp };
  const colorMap = {
    critical: { bg: 'bg-red-950 bg-opacity-40', border: 'border-red-500 border-opacity-50', icon: 'bg-red-900 bg-opacity-50 text-red-400', badge: 'bg-red-500' },
    high: { bg: 'bg-orange-950 bg-opacity-30', border: 'border-orange-500 border-opacity-40', icon: 'bg-orange-900 bg-opacity-50 text-orange-400', badge: 'bg-orange-500' },
    medium: { bg: 'bg-gray-800 bg-opacity-50', border: 'border-gray-600', icon: 'bg-gray-700 text-gray-300', badge: 'bg-gray-500' },
  };
  const Icon = iconMap[insight.type] || Sparkles;
  const colors = colorMap[insight.priority] || colorMap.medium;

  return (
    <div className={cn('p-5 rounded-xl border', colors.bg, colors.border)}>
      <div className="flex items-start gap-4">
        <div className={cn('p-2.5 rounded-xl flex-shrink-0', colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold text-gray-100 text-sm">{insight.title}</h4>
            <span className={cn('text-xs px-2 py-0.5 rounded-full text-white font-medium', colors.badge)}>
              {insight.priority}
            </span>
            <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
          </div>
          <p className="text-sm text-gray-400 mb-3">{insight.description}</p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 text-xs">
              {insight.action && (
                <span className="text-gray-500 flex items-center gap-1">
                  <Target className="w-3 h-3" /> {insight.action}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {insight.estimatedImpact && (
                <span className="px-2 py-1 bg-green-900 bg-opacity-30 text-green-400 text-xs rounded-lg font-medium">
                  {insight.estimatedImpact}
                </span>
              )}
              <button
                onClick={() => onDismiss?.(insight.id)}
                className="px-3 py-1.5 bg-red-900 bg-opacity-20 hover:bg-opacity-40 text-red-400 text-xs rounded-lg font-medium transition-all flex items-center gap-1"
              >
                <Zap className="w-3 h-3" /> Take Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

const JarvisApp = () => {
  // ---- Auth State ----
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ---- Navigation State ----
  const [currentView, setCurrentView] = useState('login');
  const [currentStep, setCurrentStep] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState('last-30-days');

  // ---- Profile Builder State ----
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    businessType: '',
    category: '',
    subCategory: '',
    serviceArea: '',
    region: '',
    specificProducts: [],
    specificServices: [],
    website: '',
    socialHandles: { instagram: '', facebook: '', twitter: '', linkedin: '', youtube: '', tiktok: '' },
    competitors: [],
    demographics: { gender: [], age: [], income: [], hobbies: [] },
  });

  // ---- Analysis State ----
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // ---- Search/Input State ----
  const [searchingCompetitors, setSearchingCompetitors] = useState(false);
  const [competitorSearch, setCompetitorSearch] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newService, setNewService] = useState('');
  const [influencerFilter, setInfluencerFilter] = useState('all');
  const [dismissedInsights, setDismissedInsights] = useState([]);

  // ---- Handlers ----

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setCurrentView('profile-builder');
      setIsLoggingIn(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
    setCurrentStep(1);
    setFormData({
      businessType: '', category: '', subCategory: '', serviceArea: '', region: '',
      specificProducts: [], specificServices: [], website: '',
      socialHandles: { instagram: '', facebook: '', twitter: '', linkedin: '', youtube: '', tiktok: '' },
      competitors: [],
      demographics: { gender: [], age: [], income: [], hobbies: [] },
    });
    setAnalysisData(null);
    setDismissedInsights([]);
  };

  const toggleDemographic = (category, value) => {
    setFormData(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [category]: prev.demographics[category].includes(value)
          ? prev.demographics[category].filter(v => v !== value)
          : [...prev.demographics[category], value]
      }
    }));
  };

  const addProduct = () => {
    if (newProduct.trim()) {
      setFormData(prev => ({ ...prev, specificProducts: [...prev.specificProducts, newProduct.trim()] }));
      setNewProduct('');
    }
  };

  const removeProduct = (index) => {
    setFormData(prev => ({ ...prev, specificProducts: prev.specificProducts.filter((_, i) => i !== index) }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData(prev => ({ ...prev, specificServices: [...prev.specificServices, newService.trim()] }));
      setNewService('');
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({ ...prev, specificServices: prev.specificServices.filter((_, i) => i !== index) }));
  };

  const searchCompetitors = () => {
    if (!competitorSearch.trim()) return;
    setSearchingCompetitors(true);
    setTimeout(() => {
      const comp = generateCompetitor(competitorSearch);
      setFormData(prev => ({ ...prev, competitors: [...prev.competitors, comp] }));
      setCompetitorSearch('');
      setSearchingCompetitors(false);
    }, 1800);
  };

  const removeCompetitor = (index) => {
    setFormData(prev => ({ ...prev, competitors: prev.competitors.filter((_, i) => i !== index) }));
  };

  const generateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const stages = [
      { progress: 15, delay: 400 },
      { progress: 30, delay: 600 },
      { progress: 50, delay: 500 },
      { progress: 70, delay: 700 },
      { progress: 85, delay: 500 },
      { progress: 95, delay: 400 },
      { progress: 100, delay: 300 },
    ];
    let totalDelay = 0;
    stages.forEach(stage => {
      totalDelay += stage.delay;
      setTimeout(() => setAnalysisProgress(stage.progress), totalDelay);
    });
    setTimeout(() => {
      setAnalysisData(generateAnalysisData(formData));
      setIsAnalyzing(false);
      setCurrentView('dashboard');
      setActiveTab('overview');
    }, totalDelay + 500);
  };

  const dismissInsight = (id) => {
    setDismissedInsights(prev => [...prev, id]);
  };

  const getStepProgress = () => (currentStep / totalSteps) * 100;

  // ============================================================================
  // LOGIN SCREEN
  // ============================================================================

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-black flex relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" />
        </div>

        {/* Left branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-3/5 relative z-10 flex-col justify-center px-16 xl:px-24">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Eye className="w-12 h-12 text-gray-100" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-75" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-gray-100">JARVIS</h1>
                <p className="text-gray-400">Marketing Intelligence Platform</p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            See Everything.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Know Everything.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-lg mb-12">
            The all-seeing eye for your marketing operations. AI-powered analytics that transform data into market dominance.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            {[
              { icon: Brain, title: 'AI-Powered Insights', desc: 'Actionable recommendations from Claude AI' },
              { icon: Target, title: 'Competitor Intelligence', desc: 'Track ad spend, creatives, and positioning' },
              { icon: BarChart3, title: 'Predictive Analytics', desc: 'Forecast revenue, conversions, and trends' },
              { icon: Zap, title: 'Real-time Monitoring', desc: 'Live metrics with anomaly detection' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-900 bg-opacity-30 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div><p className="text-3xl font-bold text-white">500+</p><p className="text-sm text-gray-500">Active Brands</p></div>
            <div className="w-px h-12 bg-gray-800" />
            <div><p className="text-3xl font-bold text-white">$2.8B</p><p className="text-sm text-gray-500">Ad Spend Tracked</p></div>
            <div className="w-px h-12 bg-gray-800" />
            <div><p className="text-3xl font-bold text-white">98%</p><p className="text-sm text-gray-500">Accuracy Rate</p></div>
          </div>
        </div>

        {/* Right login form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Eye className="w-10 h-10 text-gray-100" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-gray-100">JARVIS</h1>
              <p className="text-gray-400 text-sm">Marketing Intelligence Platform</p>
            </div>

            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-red-900 border-opacity-30">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-200 text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500 transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500 transition-all pr-12"
                      placeholder="••••••••"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <Eye className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-red-500" />
                    <span className="text-sm text-gray-400">Remember me</span>
                  </label>
                  <button className="text-sm text-red-400 hover:text-red-300">Forgot password?</button>
                </div>
                <button
                  onClick={handleLogin} disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoggingIn ? <><Activity className="w-5 h-5 animate-spin" /><span>Signing in...</span></> : <><span>Sign in</span><ChevronRight className="w-5 h-5" /></>}
                </button>
              </div>

              {/* OAuth */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-gray-900 text-gray-500">or continue with</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Google', 'Microsoft', 'GitHub'].map(provider => (
                  <button key={provider} onClick={handleLogin} className="flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all text-sm text-gray-300 font-medium">
                    {provider}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                <p className="text-gray-500 text-xs mb-2">Exclusive to Open Jar Studios clients</p>
                <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
                  <Shield className="w-3 h-3" />
                  <span>Enterprise-grade security</span>
                  <span>•</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>All systems operational</span>
                </div>
              </div>
            </div>

            <p className="text-center mt-6 text-xs text-gray-600 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" /> Powered by Claude Sonnet 4.5
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DASHBOARD VIEWS
  // ============================================================================

  const renderDashboardOverview = () => {
    if (!analysisData) return null;
    const { revenueData, psychographics, contentStrategy, adIntelligence, predictions, funnelData } = analysisData;
    const activeInsights = analysisData.insights.filter(i => !dismissedInsights.includes(i.id));

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <MetricCard title="Total Revenue" value={formatCurrency(2847500, true)} change={18.5} icon={DollarSign} iconBg="bg-green-900 bg-opacity-30" subtitle="vs last 30 days" />
          <MetricCard title="Ad Spend" value={formatCurrency(485000, true)} change={12.3} icon={Target} iconBg="bg-blue-900 bg-opacity-30" subtitle="Across all platforms" />
          <MetricCard title="ROAS" value="5.87" change={8.2} icon={TrendingUp} suffix="x" subtitle="Return on ad spend" />
          <MetricCard title="Conversions" value={formatCompact(12450)} change={24.7} icon={Users} iconBg="bg-purple-900 bg-opacity-30" subtitle="+2,480 vs last period" />
          <MetricCard title="Total Reach" value={formatCompact(8500000)} change={15.3} icon={Globe} iconBg="bg-cyan-900 bg-opacity-30" subtitle="Unique users" />
          <MetricCard title="Engagement Rate" value="4.8" change={6.1} icon={Heart} iconBg="bg-pink-900 bg-opacity-30" suffix="%" subtitle="Across all channels" />
        </div>

        {/* AI Insights */}
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-red-900 border-opacity-30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-900 to-purple-900 bg-opacity-50">
                <Sparkles className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">AI-Powered Insights</h3>
                <p className="text-sm text-gray-400">{activeInsights.length} actionable recommendations from JARVIS</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-900 bg-opacity-30 text-red-400 text-xs font-semibold rounded-full">{activeInsights.length} active</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeInsights.slice(0, 6).map(insight => (
              <InsightCard key={insight.id} insight={insight} onDismiss={dismissInsight} />
            ))}
          </div>
        </div>

        {/* Revenue Performance + Psychographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Revenue Performance & Forecast</h3>
                <p className="text-sm text-gray-400">Actual vs predicted with confidence bounds</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-red-500" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-blue-500" />Predicted</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-green-500" />Profit</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC143C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DC143C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} />
                <YAxis stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#DC143C" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted" />
                <Bar dataKey="profit" fill="#22C55E" fillOpacity={0.4} radius={[2, 2, 0, 0]} name="Profit" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Audience Psychology</h3>
            <p className="text-sm text-gray-400 mb-4">Behavioral traits vs industry benchmark</p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={psychographics}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#aaa', fontSize: 10 }} />
                <PolarRadiusAxis stroke="#555" tick={{ fill: '#666', fontSize: 9 }} />
                <Radar name="Your Audience" dataKey="value" stroke="#DC143C" fill="#DC143C" fillOpacity={0.4} strokeWidth={2} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={1} strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Performance + Market Share */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Platform Ad Spend & ROAS</h3>
            <p className="text-sm text-gray-400 mb-4">Performance by advertising platform</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adIntelligence.platformBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickFormatter={v => `$${v / 1000}K`} />
                <YAxis dataKey="platform" type="category" stroke="#666" tick={{ fill: '#999', fontSize: 11 }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spend" fill="#DC143C" radius={[0, 4, 4, 0]} name="Spend" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Marketing Funnel</h3>
            <p className="text-sm text-gray-400 mb-4">Conversion rates at each stage</p>
            <div className="space-y-3">
              {funnelData.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{stage.stage}</span>
                    <span className="text-sm text-gray-400">{formatCompact(stage.value)} {i > 0 && `(${stage.rate}%)`}</span>
                  </div>
                  <div className="h-6 bg-gray-800 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-1000"
                      style={{
                        width: `${(stage.value / funnelData[0].value) * 100}%`,
                        backgroundColor: COLORS.chart[i % COLORS.chart.length],
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor Ad Spend Trend */}
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
          <h3 className="text-lg font-semibold text-gray-100 mb-2">Competitor Ad Spend vs Yours</h3>
          <p className="text-sm text-gray-400 mb-4">Track spending patterns and find opportunities</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={adIntelligence.spendTrend}>
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="yourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="totalSpend" stroke="#F59E0B" fill="url(#compGrad)" strokeWidth={2} name="Competitor Total" />
              <Area type="monotone" dataKey="yourSpend" stroke="#22C55E" fill="url(#yourGrad)" strokeWidth={2} name="Your Spend" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Influencer Matches */}
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-900 bg-opacity-30"><Users className="w-6 h-6 text-purple-400" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">Top Influencer Matches</h3>
                <p className="text-sm text-gray-400">AI-curated based on your audience profile</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'Instagram', 'YouTube', 'TikTok'].map(f => (
                <button key={f} onClick={() => setInfluencerFilter(f)} className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  influencerFilter === f ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysisData.influencerOpportunities
              .filter(inf => influencerFilter === 'all' || inf.platform === influencerFilter)
              .slice(0, 8)
              .map(inf => (
                <div key={inf.id} className="p-4 bg-gray-800 bg-opacity-40 rounded-xl border border-gray-700 border-opacity-50 hover:border-red-900 hover:border-opacity-40 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {inf.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate text-sm">{inf.name}</h4>
                      <p className="text-xs text-gray-400">{inf.handle}</p>
                    </div>
                  </div>

                  <div className="mb-3 p-2 bg-red-950 bg-opacity-30 border border-red-900 border-opacity-30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Match Score</span>
                      <span className="text-lg font-bold text-red-400">{inf.matchScore}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{ width: `${inf.matchScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Followers</span><span className="text-white font-medium">{formatCompact(inf.followers)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Engagement</span><span className="text-white font-medium">{inf.engagement}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Authenticity</span><span className="text-green-400 font-medium">{inf.authenticity}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Est. Rate</span><span className="text-white font-medium">{formatCurrency(inf.estimatedCost.min, true)}-{formatCurrency(inf.estimatedCost.max, true)}</span></div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn('px-2 py-1 text-xs rounded-lg font-medium capitalize',
                      inf.platform === 'Instagram' ? 'bg-pink-900 bg-opacity-50 text-pink-400' :
                      inf.platform === 'YouTube' ? 'bg-red-900 bg-opacity-50 text-red-400' :
                      inf.platform === 'TikTok' ? 'bg-gray-700 text-gray-300' :
                      'bg-blue-900 bg-opacity-50 text-blue-400'
                    )}>{inf.platform}</span>
                    <span className="px-2 py-1 text-xs rounded-lg bg-gray-700 text-gray-300">{inf.niche}</span>
                  </div>

                  <button className="w-full py-2 bg-red-900 bg-opacity-20 hover:bg-opacity-40 text-red-400 text-sm font-medium rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <UserPlus className="w-4 h-4 inline mr-1" /> Connect
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Content Strategy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Platform Recommendation Matrix</h3>
            <p className="text-sm text-gray-400 mb-4">Where to focus your content efforts</p>
            <div className="space-y-3">
              {contentStrategy.filter(p => p.recommended).map(platform => (
                <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-800 bg-opacity-40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center',
                      platform.trend === 'up' ? 'bg-green-900 bg-opacity-30' : 'bg-gray-700'
                    )}>
                      <Globe className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{platform.platform}</p>
                      <p className="text-xs text-gray-500">{platform.bestContent} • {platform.optimalTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{platform.engagement}% eng.</p>
                    <p className="text-xs text-gray-400">{formatCompact(platform.reach)} reach</p>
                  </div>
                  <div className={cn('px-2 py-1 rounded text-xs font-medium',
                    platform.trend === 'up' ? 'bg-green-900 bg-opacity-30 text-green-400' : 'bg-gray-700 text-gray-400'
                  )}>
                    {platform.trend === 'up' ? '↑' : platform.trend === 'down' ? '↓' : '→'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Content Mix Analysis</h3>
            <p className="text-sm text-gray-400 mb-4">Optimal content type distribution</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={analysisData.contentMix} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={3} dataKey="percentage"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#555' }}>
                  {analysisData.contentMix.map((_, i) => (<Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-900 bg-opacity-30"><Brain className="w-6 h-6 text-blue-400" /></div>
            <div>
              <h3 className="text-xl font-bold text-gray-100">Predictive Revenue Forecast</h3>
              <p className="text-sm text-gray-400">3 scenarios based on different growth strategies</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={predictions.revenueForcast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="actual" stroke="#22C55E" strokeWidth={3} dot={{ fill: '#22C55E', r: 4 }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="conservative" stroke="#6B7280" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Conservative" />
              <Line type="monotone" dataKey="moderate" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Moderate Growth" />
              <Line type="monotone" dataKey="aggressive" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Aggressive" />
              <Legend wrapperStyle={{ color: '#999', fontSize: 12 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SEO Intelligence */}
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 border-opacity-50">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">SEO Keyword Intelligence</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-3 px-4">Keyword</th>
                  <th className="text-right py-3 px-4">Search Volume</th>
                  <th className="text-right py-3 px-4">Difficulty</th>
                  <th className="text-right py-3 px-4">Position</th>
                  <th className="text-right py-3 px-4">Est. CPC</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.seoIntelligence.topKeywords.map((kw, i) => (
                  <tr key={i} className="border-b border-gray-800 border-opacity-50 hover:bg-gray-800 hover:bg-opacity-30">
                    <td className="py-3 px-4 text-white font-medium">{kw.keyword}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{formatCompact(kw.volume)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium',
                        kw.difficulty > 60 ? 'bg-red-900 bg-opacity-30 text-red-400' :
                        kw.difficulty > 40 ? 'bg-yellow-900 bg-opacity-30 text-yellow-400' :
                        'bg-green-900 bg-opacity-30 text-green-400'
                      )}>{kw.difficulty}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">#{kw.position}</td>
                    <td className="py-3 px-4 text-right text-gray-300">${kw.cpc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // PROFILE BUILDER
  // ============================================================================

  const renderProfileBuilder = () => (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-red-900 border-opacity-30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className="flex items-center">
                <button onClick={() => setCurrentStep(step)} className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                  currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                )}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </button>
                {step < 5 && <div className={cn('w-6 lg:w-12 h-1 mx-1', currentStep > step ? 'bg-red-600' : 'bg-gray-800')} />}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500" style={{ width: `${getStepProgress()}%` }} />
        </div>
      </div>

      {/* Step 1: Business Info */}
      {currentStep === 1 && (
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 border border-red-900 border-opacity-30">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-red-900 bg-opacity-30"><Target className="w-8 h-8 text-red-400" /></div>
            <div><h2 className="text-2xl font-bold text-gray-100">Business Information</h2><p className="text-sm text-gray-400">Tell us about your business</p></div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-200 text-sm font-semibold mb-3">Business Type</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {BUSINESS_TYPES.map(type => (
                  <button key={type.value} onClick={() => setFormData({...formData, businessType: type.value})}
                    className={cn('p-4 rounded-xl border-2 transition-all text-left',
                      formData.businessType === type.value ? 'border-red-500 bg-red-950 bg-opacity-30' : 'border-gray-700 bg-gray-800 bg-opacity-30 hover:border-gray-600'
                    )}>
                    <span className="text-2xl mb-2 block">{type.icon}</span>
                    <p className="font-bold text-white">{type.label}</p>
                    <p className="text-xs text-gray-500">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-200 text-sm font-semibold mb-3">Industry Category</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setFormData({...formData, category: cat})}
                    className={cn('px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      formData.category === cat ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    )}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-2">Distribution</label>
                <select value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500">
                  <option value="">Select...</option>
                  {SUB_CATEGORIES.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-2">Service Area</label>
                <select value={formData.serviceArea} onChange={e => setFormData({...formData, serviceArea: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500">
                  <option value="">Select...</option>
                  {SERVICE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
            </div>
            {formData.serviceArea === 'Local' && (
              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-2">Region / ZIP</label>
                <input type="text" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}
                  placeholder="e.g., 90210 or California" className="w-full px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Products & Services */}
      {currentStep === 2 && (
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 border border-red-900 border-opacity-30">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-blue-900 bg-opacity-30"><BarChart3 className="w-8 h-8 text-blue-400" /></div>
            <div><h2 className="text-2xl font-bold text-gray-100">Products & Services</h2><p className="text-sm text-gray-400">What do you offer?</p></div>
          </div>
          {formData.category && CATEGORY_PRODUCTS[formData.category] && (
            <div className="mb-6">
              <label className="block text-gray-200 text-sm font-semibold mb-3">Suggested for {formData.category}</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_PRODUCTS[formData.category].map(product => (
                  <button key={product} onClick={() => setFormData(prev => ({
                    ...prev, specificProducts: prev.specificProducts.includes(product)
                      ? prev.specificProducts.filter(p => p !== product) : [...prev.specificProducts, product]
                  }))} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    formData.specificProducts.includes(product) ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  )}>{product}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-semibold mb-2">Custom Products</label>
            <div className="flex gap-2">
              <input type="text" value={newProduct} onChange={e => setNewProduct(e.target.value)} onKeyDown={e => e.key === 'Enter' && addProduct()}
                placeholder="Enter product name..." className="flex-1 px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500" />
              <button onClick={addProduct} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"><Plus className="w-5 h-5" />Add</button>
            </div>
            {formData.specificProducts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">{formData.specificProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-gray-200 text-sm">{p}</span>
                  <button onClick={() => removeProduct(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}</div>
            )}
          </div>
          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-2">Services</label>
            <div className="flex gap-2">
              <input type="text" value={newService} onChange={e => setNewService(e.target.value)} onKeyDown={e => e.key === 'Enter' && addService()}
                placeholder="Enter service name..." className="flex-1 px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500" />
              <button onClick={addService} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"><Plus className="w-5 h-5" />Add</button>
            </div>
            {formData.specificServices.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">{formData.specificServices.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-gray-200 text-sm">{s}</span>
                  <button onClick={() => removeService(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}</div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Online Presence */}
      {currentStep === 3 && (
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 border border-red-900 border-opacity-30">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-purple-900 bg-opacity-30"><Globe className="w-8 h-8 text-purple-400" /></div>
            <div><h2 className="text-2xl font-bold text-gray-100">Online Presence</h2><p className="text-sm text-gray-400">Connect your digital properties</p></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-200 text-sm font-semibold mb-2">Website URL</label>
              <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})}
                placeholder="https://yourwebsite.com" className="w-full px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLATFORMS.map(p => (
                <div key={p.id}>
                  <label className="block text-gray-200 text-sm font-semibold mb-2 flex items-center gap-2">
                    {p.icon ? <p.icon className="w-4 h-4" /> : null}<span>{p.name}</span>
                  </label>
                  <input type="text" value={formData.socialHandles[p.id] || ''} onChange={e => setFormData({...formData, socialHandles: {...formData.socialHandles, [p.id]: e.target.value}})}
                    placeholder="@username" className="w-full px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Competitor Research */}
      {currentStep === 4 && (
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 border border-red-900 border-opacity-30">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-yellow-900 bg-opacity-30"><Search className="w-8 h-8 text-yellow-400" /></div>
            <div><h2 className="text-2xl font-bold text-gray-100">Competitor Research</h2><p className="text-sm text-gray-400">Analyze ad spend, performance & strategy</p></div>
          </div>
          <div className="mb-6">
            <div className="flex gap-2">
              <input type="text" value={competitorSearch} onChange={e => setCompetitorSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchCompetitors()}
                placeholder="Enter competitor name..." className="flex-1 px-4 py-3 bg-gray-950 bg-opacity-50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500" />
              <button onClick={searchCompetitors} disabled={searchingCompetitors}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
                {searchingCompetitors ? <Activity className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}<span>Search</span>
              </button>
            </div>
          </div>
          {formData.competitors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">Found Competitors ({formData.competitors.length})</h3>
              {formData.competitors.map((comp, idx) => (
                <div key={comp.id} className="bg-gray-800 bg-opacity-50 p-5 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-100 text-lg mb-1">{comp.name}</h4>
                      <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
                        <Globe className="w-3 h-3" />{comp.website}<ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <button onClick={() => removeCompetitor(idx)} className="p-2 bg-red-900 bg-opacity-30 hover:bg-opacity-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Ad Spend/mo</p><p className="text-lg font-bold text-gray-100">{formatCurrency(comp.monthlyAdSpend, true)}</p></div>
                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Est. Revenue</p><p className="text-lg font-bold text-green-400">{formatCurrency(comp.estimatedRevenue, true)}</p></div>
                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">CTR</p><p className="text-lg font-bold text-blue-400">{comp.adPerformance.ctr}%</p></div>
                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">ROAS</p><p className="text-lg font-bold text-purple-400">{comp.adPerformance.roas}x</p></div>
                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">DA Score</p><p className="text-lg font-bold text-yellow-400">{comp.domainAuthority}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Demographics */}
      {currentStep === 5 && (
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 border border-red-900 border-opacity-30">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-green-900 bg-opacity-30"><Users className="w-8 h-8 text-green-400" /></div>
            <div><h2 className="text-2xl font-bold text-gray-100">Target Audience</h2><p className="text-sm text-gray-400">Define your ideal customers</p></div>
          </div>
          <div className="space-y-8">
            {Object.entries(DEMOGRAPHIC_OPTIONS).map(([category, options]) => (
              <div key={category} className="pb-6 border-b border-gray-800 last:border-0">
                <label className="block text-gray-200 text-sm font-semibold mb-3 capitalize">{category}</label>
                <div className="flex flex-wrap gap-2">
                  {options.map(option => (
                    <button key={option} onClick={() => toggleDemographic(category, option)}
                      className={cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                        formData.demographics[category].includes(option)
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                          : 'bg-gray-950 bg-opacity-50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                      )}>{option}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
          <ChevronLeft className="w-5 h-5" /><span>Back</span>
        </button>
        {currentStep < totalSteps ? (
          <button onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2">
            <span>Continue</span><ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={generateAnalysis} disabled={isAnalyzing}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3">
            {isAnalyzing ? (
              <><Activity className="w-6 h-6 animate-spin" /><span>Analyzing... {analysisProgress.toFixed(0)}%</span></>
            ) : (
              <><Brain className="w-6 h-6" /><span>Generate Intelligence Report</span><Sparkles className="w-5 h-5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // MAIN AUTHENTICATED LAYOUT
  // ============================================================================

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, view: 'dashboard' },
    { id: 'competitors', label: 'Competitor Intel', icon: Target, view: 'dashboard' },
    { id: 'influencers', label: 'Influencers', icon: Users, view: 'dashboard' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, view: 'dashboard' },
    { id: 'reports', label: 'Reports', icon: FileBarChart, view: 'dashboard' },
    { id: 'integrations', label: 'Integrations', icon: Plug, view: 'dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-black">
      {/* Header */}
      <header className="bg-gray-900 bg-opacity-80 backdrop-blur-xl border-b border-red-900 border-opacity-30 shadow-2xl sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { if (analysisData) { setCurrentView('dashboard'); setActiveTab('overview'); } }}>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-gray-100" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-gray-100">JARVIS</h1>
                <p className="text-xs text-gray-500">Lidless Analytics</p>
              </div>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="hidden lg:flex items-center gap-1">
            <button onClick={() => setCurrentView('profile-builder')} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              currentView === 'profile-builder' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800')}>
              Profile Builder
            </button>
            {analysisData && navItems.slice(0, 4).map(item => (
              <button key={item.id} onClick={() => { setCurrentView('dashboard'); setActiveTab('overview'); }}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  currentView === 'dashboard' && activeTab === item.id ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800')}>
                <item.icon className="w-4 h-4" />{item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search..." className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500" />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 text-gray-400 hover:text-red-400 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 z-50">
                  <div className="p-4 border-b border-gray-800"><h3 className="font-semibold text-white">Notifications</h3></div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { title: 'New AI Insight', desc: 'Untapped audience segment detected', time: '2m ago' },
                      { title: 'Campaign Goal Achieved', desc: 'Summer Sale exceeded ROAS target', time: '1h ago' },
                      { title: 'Competitor Alert', desc: 'Brand X increased ad spend by 40%', time: '3h ago' },
                    ].map((n, i) => (
                      <div key={i} className="p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-800 border-opacity-50">
                        <p className="text-sm text-white font-medium">{n.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                        <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-all"><Settings className="w-5 h-5" /></button>

            {/* User */}
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 hover:bg-gray-800 rounded-xl transition-all">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">OJ</div>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden lg:block" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 z-50 py-2">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <p className="font-semibold text-white text-sm">Open Jar Studios</p>
                    <p className="text-xs text-gray-500">Enterprise Plan</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"><Settings className="w-4 h-4" />Settings</button>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-950 flex items-center gap-2"><LogOut className="w-4 h-4" />Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dropdowns backdrop */}
      {(notificationsOpen || userMenuOpen) && <div className="fixed inset-0 z-40" onClick={() => { setNotificationsOpen(false); setUserMenuOpen(false); }} />}

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6">
        {currentView === 'profile-builder' && renderProfileBuilder()}
        {currentView === 'dashboard' && analysisData && (
          <div>
            {/* Dashboard header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Analytics Dashboard</h1>
                <p className="text-gray-400">Real-time insights and performance metrics across all channels</p>
              </div>
              <div className="flex items-center gap-3">
                <select value={dateRange} onChange={e => setDateRange(e.target.value)}
                  className="px-4 py-2.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-red-500">
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-90-days">Last 90 Days</option>
                  <option value="this-quarter">This Quarter</option>
                  <option value="this-year">This Year</option>
                </select>
                <button className="p-2.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all"><RefreshCw className="w-5 h-5" /></button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-red-900 bg-opacity-30 border border-red-900 border-opacity-40 rounded-xl text-red-400 hover:bg-opacity-50 transition-all">
                  <Download className="w-4 h-4" /><span className="text-sm font-medium">Export</span>
                </button>
              </div>
            </div>
            {renderDashboardOverview()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-80 backdrop-blur-xl border-t border-red-900 border-opacity-30 mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-medium">&copy; 2026 Open Jar Studios, LLC. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />Powered by Claude Sonnet 4.5</span>
            <span>&bull;</span>
            <span>Lidless Analytics Engine v2.0</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JarvisApp;
