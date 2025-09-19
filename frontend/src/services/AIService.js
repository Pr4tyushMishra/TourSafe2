/**
 * TourSafe AI Service - Modular AI Integration Layer
 * Supports Gemini API with easy switching to other AI providers
 */

class AIService {
  constructor(config = {}) {
    this.provider = config.provider || 'gemini';
    this.apiKey = config.apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
    this.model = config.model || 'gemini-1.5-flash'; // Use flash model for better quota
    this.fallbackModel = 'gemini-1.5-pro'; // Fallback to pro if flash fails
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Generic AI request handler with retry logic
   */
  async makeAIRequest(prompt, options = {}) {
    const requestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxTokens || 1024,
        }
      })
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        let response;
        let currentModel = this.model;
        
        try {
          response = await fetch(
            `${this.baseUrl}/models/${currentModel}:generateContent`,
            { ...requestConfig, signal: controller.signal }
          );
        } catch (modelError) {
          // Try fallback model if primary fails
          if (currentModel !== this.fallbackModel) {
            currentModel = this.fallbackModel;
            response = await fetch(
              `${this.baseUrl}/models/${currentModel}:generateContent`,
              { ...requestConfig, signal: controller.signal }
            );
          } else {
            throw modelError;
          }
        }

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI API Error Details:', errorText);
          
          if (response.status === 429) {
            throw new Error(`API quota exceeded. Daily limit reached. Service will resume tomorrow or upgrade your plan.`);
          } else if (response.status === 404) {
            throw new Error(`Model '${currentModel}' not found. Please check the model name.`);
          } else if (response.status === 403) {
            throw new Error(`API access forbidden. Please check your API key permissions.`);
          } else {
            throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
          }
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!content) {
          throw new Error('Invalid AI response format');
        }

        return content.trim();
      } catch (error) {
        console.warn(`AI request attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.maxRetries) {
          throw new Error(`AI service failed after ${this.maxRetries} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Tourist Safety Score (AI-backed)
   * Dynamic scoring with AI reasoning instead of static rules
   */
  async calculateSafetyScore(touristData) {
    try {
      const prompt = `
You are a tourist safety expert. Analyze the following data and provide a safety score.

Tourist Data:
- Current Time: ${touristData.currentTime || new Date().toLocaleString()}
- Location Area: ${touristData.areaName || 'Unknown'}
- Area Risk Level: ${touristData.areaRiskLevel || 'medium'}
- Duration of Inactivity: ${touristData.inactivityDuration || '0'} minutes
- Past Incidents in Area: ${touristData.pastIncidents || 0}
- Crowd Density: ${touristData.crowdDensity || 'medium'}
- Weather Conditions: ${touristData.weather || 'clear'}
- Tourist Profile: ${touristData.touristProfile || 'solo traveler'}

Provide response in this exact JSON format:
{
  "safetyScore": <number 0-100>,
  "riskLevel": "<low/medium/high>",
  "reasoning": "<brief explanation>",
  "recommendations": ["<recommendation1>", "<recommendation2>"]
}`;

      const response = await this.makeAIRequest(prompt, { temperature: 0.3 });
      
      // Parse JSON from AI response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing
      return this.parseSafetyScoreResponse(response);
    } catch (error) {
      console.error('AI Safety Score calculation failed:', error);
      return this.getFallbackSafetyScore(touristData);
    }
  }

  /**
   * Predictive Alerts
   * AI-powered risk prediction based on location and context
   */
  async generatePredictiveAlert(locationData) {
    try {
      const prompt = `
You are a predictive safety system for tourists. Analyze the current situation and predict risks.

Current Situation:
- Location: ${locationData.location || 'Unknown'}
- Coordinates: ${locationData.lat || 0}, ${locationData.lng || 0}
- Time: ${locationData.time || new Date().toLocaleString()}
- Nearby Points: ${JSON.stringify(locationData.nearbyPOIs || [])}
- Historical Incidents: ${locationData.historicalIncidents || 0}
- Current Events: ${locationData.currentEvents || 'none'}
- Tourist Behavior: ${locationData.touristBehavior || 'normal'}

Predict risks and provide response in this exact JSON format:
{
  "riskLevel": "<low/medium/high>",
  "message": "<short warning message>",
  "specificRisks": ["<risk1>", "<risk2>"],
  "preventiveMeasures": ["<measure1>", "<measure2>"],
  "alertPriority": "<info/warning/critical>"
}`;

      const response = await this.makeAIRequest(prompt, { temperature: 0.4 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.parsePredictiveAlertResponse(response);
    } catch (error) {
      console.error('AI Predictive Alert generation failed:', error);
      return this.getFallbackPredictiveAlert(locationData);
    }
  }

  /**
   * Anomaly Detection
   * AI-powered detection of unusual tourist behavior
   */
  async detectAnomaly(behaviorData) {
    try {
      const prompt = `
You are an anomaly detection system for tourist safety. Analyze the behavior pattern.

Behavior Data:
- Tourist ID: ${behaviorData.touristId || 'unknown'}
- Location History: ${JSON.stringify(behaviorData.locationHistory || [])}
- Activity Pattern: ${behaviorData.activityPattern || 'unknown'}
- Duration of Inactivity: ${behaviorData.inactivityDuration || 0} minutes
- Expected vs Actual Location: ${behaviorData.expectedLocation || 'N/A'} vs ${behaviorData.actualLocation || 'N/A'}
- Communication Status: ${behaviorData.communicationStatus || 'normal'}
- Previous Patterns: ${JSON.stringify(behaviorData.previousPatterns || [])}

Analyze if this behavior is unusual or potentially dangerous. Respond in this exact JSON format:
{
  "isAnomalous": <true/false>,
  "anomalyLevel": "<low/medium/high>",
  "description": "<brief description>",
  "potentialCauses": ["<cause1>", "<cause2>"],
  "recommendedActions": ["<action1>", "<action2>"],
  "urgency": "<low/medium/high>"
}`;

      const response = await this.makeAIRequest(prompt, { temperature: 0.2 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.parseAnomalyResponse(response);
    } catch (error) {
      console.error('AI Anomaly Detection failed:', error);
      return this.getFallbackAnomalyDetection(behaviorData);
    }
  }

  /**
   * Multilingual Support
   * AI-powered translation for alerts and messages
   */
  async translateMessage(message, targetLanguage = 'hindi') {
    try {
      const languageMap = {
        'hindi': 'Hindi (हिंदी)',
        'bengali': 'Bengali (বাংলা)',
        'telugu': 'Telugu (తెలుగు)',
        'marathi': 'Marathi (मराठी)',
        'tamil': 'Tamil (தமிழ்)',
        'gujarati': 'Gujarati (ગુજરાતી)',
        'kannada': 'Kannada (ಕನ್ನಡ)',
        'malayalam': 'Malayalam (മലയാളം)',
        'punjabi': 'Punjabi (ਪੰਜਾਬੀ)',
        'urdu': 'Urdu (اردو)'
      };

      const prompt = `
Translate the following emergency/safety message to ${languageMap[targetLanguage] || targetLanguage}.

Message: "${message}"

Requirements:
- Keep the urgency and tone of the original message
- Use appropriate formal/emergency language
- Ensure cultural sensitivity
- For emergency terms, include both translation and English in parentheses

Provide response in this exact JSON format:
{
  "originalMessage": "${message}",
  "translatedMessage": "<translated message>",
  "language": "${targetLanguage}",
  "confidence": <0-100>
}`;

      const response = await this.makeAIRequest(prompt, { temperature: 0.1 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.parseTranslationResponse(response, message, targetLanguage);
    } catch (error) {
      console.error('AI Translation failed:', error);
      return this.getFallbackTranslation(message, targetLanguage);
    }
  }

  /**
   * Dashboard Summarization
   * AI-powered summary generation for authorities
   */
  async generateDashboardSummary(dashboardData) {
    try {
      const prompt = `
You are an AI assistant for police/emergency authorities. Summarize today's tourist safety situation.

Dashboard Data:
- Total Tourists Monitored: ${dashboardData.totalTourists || 0}
- Active Alerts: ${dashboardData.activeAlerts || 0}
- High Risk Areas: ${JSON.stringify(dashboardData.highRiskAreas || [])}
- Recent Incidents: ${JSON.stringify(dashboardData.recentIncidents || [])}
- Weather Conditions: ${dashboardData.weather || 'normal'}
- Special Events: ${JSON.stringify(dashboardData.specialEvents || [])}
- Resource Deployment: ${JSON.stringify(dashboardData.resourceDeployment || [])}

Provide a concise summary for police officers in this exact JSON format:
{
  "overallStatus": "<safe/cautious/critical>",
  "summary": "<brief overview>",
  "top3Risks": ["<risk1>", "<risk2>", "<risk3>"],
  "recommendedActions": ["<action1>", "<action2>"],
  "resourceAllocation": "<brief suggestion>",
  "nextReviewTime": "<time suggestion>"
}`;

      const response = await this.makeAIRequest(prompt, { temperature: 0.3 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.parseDashboardSummaryResponse(response);
    } catch (error) {
      console.error('AI Dashboard Summary generation failed:', error);
      return this.getFallbackDashboardSummary(dashboardData);
    }
  }

  /**
   * Fallback Methods for Error Handling
   */
  parseSafetyScoreResponse(response) {
    // Extract key information from unstructured response
    const score = response.match(/\b(\d{1,3})\b/)?.[1] || '75';
    const riskLevel = response.toLowerCase().includes('high') ? 'high' : 
                     response.toLowerCase().includes('low') ? 'low' : 'medium';
    
    return {
      safetyScore: parseInt(score),
      riskLevel,
      reasoning: response.substring(0, 100) + '...',
      recommendations: ['Stay alert', 'Follow safety guidelines']
    };
  }

  getFallbackSafetyScore(touristData) {
    const baseScore = 75;
    const riskAdjustment = touristData.areaRiskLevel === 'high' ? -20 : 
                          touristData.areaRiskLevel === 'low' ? 10 : 0;
    
    return {
      safetyScore: Math.max(0, Math.min(100, baseScore + riskAdjustment)),
      riskLevel: touristData.areaRiskLevel || 'medium',
      reasoning: 'Calculated based on area risk level and basic safety factors',
      recommendations: ['Stay in well-lit areas', 'Keep emergency contacts ready']
    };
  }

  parsePredictiveAlertResponse(response) {
    const riskLevel = response.toLowerCase().includes('high') ? 'high' : 
                     response.toLowerCase().includes('low') ? 'low' : 'medium';
    
    return {
      riskLevel,
      message: response.substring(0, 100) + '...',
      specificRisks: ['General safety concern'],
      preventiveMeasures: ['Stay vigilant'],
      alertPriority: riskLevel === 'high' ? 'critical' : 'warning'
    };
  }

  getFallbackPredictiveAlert(locationData) {
    return {
      riskLevel: 'medium',
      message: 'General safety advisory for this area',
      specificRisks: ['Unknown area conditions'],
      preventiveMeasures: ['Stay with groups', 'Keep emergency contacts ready'],
      alertPriority: 'info'
    };
  }

  parseAnomalyResponse(response) {
    const isAnomalous = response.toLowerCase().includes('unusual') || 
                       response.toLowerCase().includes('anomal');
    
    return {
      isAnomalous,
      anomalyLevel: isAnomalous ? 'medium' : 'low',
      description: response.substring(0, 100) + '...',
      potentialCauses: ['Unknown factors'],
      recommendedActions: ['Monitor situation'],
      urgency: 'medium'
    };
  }

  getFallbackAnomalyDetection(behaviorData) {
    const isAnomalous = (behaviorData.inactivityDuration || 0) > 120;
    
    return {
      isAnomalous,
      anomalyLevel: isAnomalous ? 'high' : 'low',
      description: isAnomalous ? 'Extended period of inactivity detected' : 'Normal behavior pattern',
      potentialCauses: isAnomalous ? ['Device issues', 'Emergency situation'] : ['Normal activity'],
      recommendedActions: isAnomalous ? ['Immediate contact attempt', 'Send welfare check'] : ['Continue monitoring'],
      urgency: isAnomalous ? 'high' : 'low'
    };
  }

  parseTranslationResponse(response, originalMessage, targetLanguage) {
    return {
      originalMessage,
      translatedMessage: response || originalMessage,
      language: targetLanguage,
      confidence: 50
    };
  }

  getFallbackTranslation(message, targetLanguage) {
    const basicTranslations = {
      'hindi': 'आपातकाल - तुरंत सहायता की जरूरत है',
      'bengali': 'জরুরী - অবিলম্বে সাহায্য প্রয়োজন',
      'tamil': 'அவசரம் - உடனடி உதவி தேவை'
    };
    
    return {
      originalMessage: message,
      translatedMessage: basicTranslations[targetLanguage] || message,
      language: targetLanguage,
      confidence: 30
    };
  }

  parseDashboardSummaryResponse(response) {
    return {
      overallStatus: 'cautious',
      summary: response.substring(0, 200) + '...',
      top3Risks: ['Monitor high-risk areas', 'Weather conditions', 'Crowd management'],
      recommendedActions: ['Increase patrols', 'Monitor communications'],
      resourceAllocation: 'Standard deployment recommended',
      nextReviewTime: 'In 2 hours'
    };
  }

  getFallbackDashboardSummary(dashboardData) {
    return {
      overallStatus: dashboardData.activeAlerts > 5 ? 'critical' : 'safe',
      summary: `Monitoring ${dashboardData.totalTourists || 0} tourists with ${dashboardData.activeAlerts || 0} active alerts`,
      top3Risks: ['General safety monitoring', 'Area patrol needs', 'Communication check'],
      recommendedActions: ['Continue monitoring', 'Maintain patrol schedules'],
      resourceAllocation: 'Current deployment adequate',
      nextReviewTime: 'In 1 hour'
    };
  }

  /**
   * Utility method to test AI connectivity
   */
  async testConnection() {
    try {
      const response = await this.makeAIRequest('Respond with "AI Service Connected" if you can read this message.');
      return {
        connected: true,
        provider: this.provider,
        model: this.model,
        response: response
      };
    } catch (error) {
      // Check for quota exceeded error
      const isQuotaError = error.message.includes('quota') || error.message.includes('429');
      
      return {
        connected: false,
        provider: this.provider,
        model: this.model,
        error: error.message,
        isQuotaExceeded: isQuotaError,
        fallbackMode: isQuotaError
      };
    }
  }

  /**
   * Check if AI service is available (for quota management)
   */
  async isServiceAvailable() {
    const result = await this.testConnection();
    return !result.isQuotaExceeded;
  }
}

// Export singleton instance
const aiService = new AIService();

export default aiService;
export { AIService };