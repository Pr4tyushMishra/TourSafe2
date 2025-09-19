import React, { useState, useEffect, useCallback } from 'react';
import aiService from '../../services/AIService';

const AIDashboardSummary = ({ 
  enabled = true, 
  dashboardData = null, 
  refreshInterval = 30000, // 30 seconds
  showDetailedBreakdown = true 
}) => {
  const [summary, setSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [summaryHistory, setSummaryHistory] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock dashboard data for demonstration
  const [mockDashboardData] = useState({
    totalTourists: 1247,
    activeAlerts: 8,
    highRiskAreas: [
      { name: 'Kamakhya Temple Area', riskLevel: 'medium', tourists: 34 },
      { name: 'Fancy Bazaar', riskLevel: 'high', tourists: 67 },
      { name: 'Railway Station', riskLevel: 'medium', tourists: 89 }
    ],
    recentIncidents: [
      { type: 'theft', location: 'Pan Bazaar', time: '2 hours ago', severity: 'medium' },
      { type: 'medical', location: 'Uzanbazar', time: '45 minutes ago', severity: 'low' },
      { type: 'lost_tourist', location: 'Dispur', time: '1 hour ago', severity: 'medium' }
    ],
    weather: 'clear with occasional clouds',
    specialEvents: [
      { name: 'Durga Puja Festival', location: 'City Center', impact: 'high_crowd' },
      { name: 'Cultural Program', location: 'Khanapara', impact: 'medium_crowd' }
    ],
    resourceDeployment: [
      { type: 'patrol_units', count: 15, status: 'active' },
      { type: 'emergency_responders', count: 8, status: 'standby' },
      { type: 'tourist_helpdesks', count: 12, status: 'operational' }
    ],
    timeframe: 'last_24_hours'
  });

  // Generate AI-powered dashboard summary
  const generateSummary = useCallback(async () => {
    if (!enabled) return;

    setIsGenerating(true);
    try {
      const currentDashboardData = dashboardData || mockDashboardData;
      
      // Enhance data with current context
      const enhancedData = {
        ...currentDashboardData,
        currentTime: new Date().toLocaleString(),
        timeOfDay: getTimeOfDay(),
        dayOfWeek: getDayOfWeek(),
        operationalStatus: getOperationalStatus(currentDashboardData),
        trendAnalysis: getTrendAnalysis(summaryHistory),
        emergencyLevel: getEmergencyLevel(currentDashboardData)
      };

      const aiSummary = await aiService.generateDashboardSummary(enhancedData);
      
      const summaryRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        overallStatus: aiSummary.overallStatus,
        summary: aiSummary.summary,
        top3Risks: aiSummary.top3Risks,
        recommendedActions: aiSummary.recommendedActions,
        resourceAllocation: aiSummary.resourceAllocation,
        nextReviewTime: aiSummary.nextReviewTime,
        confidence: calculateSummaryConfidence(aiSummary),
        aiProvider: 'Gemini',
        dataSnapshot: {
          totalTourists: enhancedData.totalTourists,
          activeAlerts: enhancedData.activeAlerts,
          highRiskAreas: enhancedData.highRiskAreas?.length || 0,
          recentIncidents: enhancedData.recentIncidents?.length || 0
        },
        contextualInsights: generateContextualInsights(enhancedData),
        urgentActions: identifyUrgentActions(enhancedData, aiSummary)
      };

      setSummary(summaryRecord);
      setSummaryHistory(prev => [summaryRecord, ...prev.slice(0, 23)]); // Keep last 24 summaries
      setLastUpdate(new Date());

    } catch (error) {
      console.error('Dashboard summary generation failed:', error);
      generateFallbackSummary();
    } finally {
      setIsGenerating(false);
    }
  }, [enabled, dashboardData, mockDashboardData, summaryHistory]);

  // Generate fallback summary when AI fails
  const generateFallbackSummary = useCallback(() => {
    const currentDashboardData = dashboardData || mockDashboardData;
    
    const fallbackSummary = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      overallStatus: currentDashboardData.activeAlerts > 10 ? 'critical' : 
                   currentDashboardData.activeAlerts > 5 ? 'cautious' : 'safe',
      summary: `Monitoring ${currentDashboardData.totalTourists} tourists with ${currentDashboardData.activeAlerts} active alerts. ${currentDashboardData.highRiskAreas?.length || 0} high-risk areas require attention.`,
      top3Risks: [
        'Monitor high-risk tourist areas',
        'Weather-related safety concerns',
        'Crowd management at events'
      ],
      recommendedActions: [
        'Maintain current patrol schedules',
        'Monitor communication channels',
        'Prepare for weather changes'
      ],
      resourceAllocation: 'Current deployment appears adequate for current conditions',
      nextReviewTime: 'Review in 1 hour',
      confidence: 60,
      aiProvider: 'Rule-based System',
      dataSnapshot: {
        totalTourists: currentDashboardData.totalTourists,
        activeAlerts: currentDashboardData.activeAlerts,
        highRiskAreas: currentDashboardData.highRiskAreas?.length || 0,
        recentIncidents: currentDashboardData.recentIncidents?.length || 0
      }
    };

    setSummary(fallbackSummary);
    setSummaryHistory(prev => [fallbackSummary, ...prev.slice(0, 23)]);
  }, [dashboardData, mockDashboardData]);

  // Auto-refresh summary (DISABLED to save quota)
  useEffect(() => {
    if (!enabled || !autoRefresh) return;

    // Initial generation
    generateSummary();

    // Disable automatic refresh to save API quota
    // const interval = setInterval(() => {
    //   generateSummary();
    // }, refreshInterval);

    // return () => clearInterval(interval);
  }, [enabled, autoRefresh, refreshInterval, generateSummary]);

  // Helper functions
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getOperationalStatus = (data) => {
    const activeResources = data.resourceDeployment?.filter(r => r.status === 'active').length || 0;
    const totalResources = data.resourceDeployment?.length || 0;
    
    if (activeResources / totalResources > 0.8) return 'optimal';
    if (activeResources / totalResources > 0.6) return 'adequate';
    return 'limited';
  };

  const getTrendAnalysis = (history) => {
    if (history.length < 2) return 'insufficient_data';
    
    const recent = history[0];
    const previous = history[1];
    
    if (recent?.dataSnapshot.activeAlerts > previous?.dataSnapshot.activeAlerts) return 'increasing_alerts';
    if (recent?.dataSnapshot.activeAlerts < previous?.dataSnapshot.activeAlerts) return 'decreasing_alerts';
    return 'stable';
  };

  const getEmergencyLevel = (data) => {
    if (data.activeAlerts > 15) return 'high';
    if (data.activeAlerts > 8) return 'medium';
    return 'low';
  };

  const calculateSummaryConfidence = (aiSummary) => {
    let confidence = 70;
    
    if (aiSummary.top3Risks?.length >= 3) confidence += 10;
    if (aiSummary.recommendedActions?.length >= 2) confidence += 10;
    if (aiSummary.summary?.length > 50) confidence += 10;
    
    return Math.min(100, confidence);
  };

  const generateContextualInsights = (data) => {
    const insights = [];
    
    if (data.specialEvents?.length > 0) {
      insights.push(`${data.specialEvents.length} special event(s) affecting crowd patterns`);
    }
    
    if (data.highRiskAreas?.length > 0) {
      const highestRisk = data.highRiskAreas.reduce((prev, current) => 
        (prev.tourists > current.tourists) ? prev : current
      );
      insights.push(`Highest concentration: ${highestRisk.tourists} tourists in ${highestRisk.name}`);
    }
    
    if (data.recentIncidents?.length > 0) {
      const recentIncident = data.recentIncidents[0];
      insights.push(`Latest incident: ${recentIncident.type} in ${recentIncident.location}`);
    }
    
    return insights;
  };

  const identifyUrgentActions = (data, aiSummary) => {
    const urgent = [];
    
    if (data.activeAlerts > 10) {
      urgent.push('Consider activating additional response teams');
    }
    
    if (data.emergencyLevel === 'high') {
      urgent.push('Escalate to senior command staff');
    }
    
    const criticalAreas = data.highRiskAreas?.filter(area => area.riskLevel === 'high') || [];
    if (criticalAreas.length > 0) {
      urgent.push(`Deploy additional patrols to ${criticalAreas.length} high-risk area(s)`);
    }
    
    return urgent;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'cautious': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe': return '✅';
      case 'cautious': return '⚠️';
      case 'critical': return '🚨';
      default: return '📊';
    }
  };

  if (!enabled) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <p className="font-medium">AI Dashboard Summary Disabled</p>
          <p className="text-sm">Enable AI features to receive intelligent dashboard insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🎯</span>
            <h3 className="text-lg font-semibold">AI Command Summary</h3>
            <span className="text-sm text-gray-500">for Authorities</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-1"
              />
              Auto-refresh
            </label>
            {isGenerating && (
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Analyzing...</span>
              </div>
            )}
            <button
              onClick={generateSummary}
              disabled={isGenerating}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
        {lastUpdate && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()} • 
            Next review: {summary?.nextReviewTime || 'In 30 minutes'}
          </p>
        )}
      </div>

      {summary ? (
        <div className="space-y-4 p-4">
          {/* Overall Status */}
          <div className={`border rounded-lg p-4 ${getStatusColor(summary.overallStatus)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getStatusIcon(summary.overallStatus)}</span>
                <span className="text-lg font-semibold uppercase tracking-wide">
                  {summary.overallStatus} Status
                </span>
              </div>
              <div className="text-sm flex items-center space-x-2">
                <span>🤖 {summary.aiProvider}</span>
                <span>({summary.confidence}%)</span>
              </div>
            </div>
            <p className="text-sm font-medium">{summary.summary}</p>
          </div>

          {/* Data Snapshot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{summary.dataSnapshot.totalTourists}</div>
              <div className="text-sm text-blue-700">Total Tourists</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-600">{summary.dataSnapshot.activeAlerts}</div>
              <div className="text-sm text-orange-700">Active Alerts</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{summary.dataSnapshot.highRiskAreas}</div>
              <div className="text-sm text-red-700">Risk Areas</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{summary.dataSnapshot.recentIncidents}</div>
              <div className="text-sm text-purple-700">Recent Incidents</div>
            </div>
          </div>

          {/* Top 3 Risks */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">🚨 Top 3 Risks</h4>
            <ul className="space-y-1">
              {summary.top3Risks.map((risk, index) => (
                <li key={index} className="text-sm text-red-700 flex items-center space-x-2">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Recommended Actions</h4>
            <ul className="space-y-1">
              {summary.recommendedActions.map((action, index) => (
                <li key={index} className="text-sm text-green-700 flex items-center space-x-2">
                  <span>→</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Urgent Actions */}
          {summary.urgentActions?.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚡ Urgent Actions Required</h4>
              <ul className="space-y-1">
                {summary.urgentActions.map((action, index) => (
                  <li key={index} className="text-sm text-yellow-700 flex items-center space-x-2">
                    <span>!</span>
                    <span className="font-medium">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contextual Insights */}
          {summary.contextualInsights?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Contextual Insights</h4>
              <ul className="space-y-1">
                {summary.contextualInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-center space-x-2">
                    <span>•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resource Allocation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">🏢 Resource Allocation</h4>
            <p className="text-sm text-gray-700">{summary.resourceAllocation}</p>
          </div>

          {/* Summary History */}
          {showDetailedBreakdown && summaryHistory.length > 1 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">📊 Recent Summaries</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {summaryHistory.slice(1, 4).map((historySummary) => (
                  <div key={historySummary.id} className="flex justify-between text-xs text-gray-600 p-2 bg-gray-50 rounded">
                    <span>{getStatusIcon(historySummary.overallStatus)} {historySummary.overallStatus}</span>
                    <span>{historySummary.dataSnapshot.activeAlerts} alerts</span>
                    <span>{new Date(historySummary.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <div className="mb-2">🎯</div>
          <p className="font-medium">No summary available</p>
          <p className="text-sm">Click "Refresh" to generate AI-powered dashboard insights</p>
        </div>
      )}
    </div>
  );
};

export default AIDashboardSummary;