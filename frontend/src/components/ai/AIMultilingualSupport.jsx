import React, { useState, useEffect, useCallback } from 'react';
import aiService from '../../services/AIService';

const AIMultilingualSupport = ({ 
  message = '', 
  enabled = true, 
  onTranslationComplete = null,
  showLanguageSelector = true,
  autoDetectLanguage = false 
}) => {
  const [translations, setTranslations] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [preferredLanguage, setPreferredLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'hindi'
  );

  // Supported Indian languages with native scripts
  const supportedLanguages = {
    'hindi': { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    'bengali': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    'telugu': { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    'marathi': { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    'tamil': { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    'gujarati': { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    'kannada': { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    'malayalam': { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    'punjabi': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    'urdu': { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    'english': { name: 'English', nativeName: 'English', flag: '🇺🇸' }
  };

  // Emergency and safety phrases for quick translation
  const emergencyPhrases = {
    'I need help': 'मुझे मदद चाहिए',
    'Emergency': 'आपातकाल',
    'Call police': 'पुलिस को बुलाओ',
    'I am lost': 'मैं खो गया हूं',
    'Where is hospital?': 'अस्पताल कहाँ है?',
    'I need water': 'मुझे पानी चाहिए',
    'Help me please': 'कृपया मेरी मदद करें',
    'I am tourist': 'मैं पर्यटक हूं',
    'I don\'t speak Hindi': 'मैं हिंदी नहीं बोलता',
    'Thank you': 'धन्यवाद'
  };

  // Translate message using AI
  const translateMessage = useCallback(async (text, targetLang = selectedLanguage) => {
    if (!enabled || !text.trim()) return;

    setIsTranslating(true);
    try {
      const translationResult = await aiService.translateMessage(text, targetLang);
      
      const translationRecord = {
        id: Date.now(),
        originalMessage: text,
        translatedMessage: translationResult.translatedMessage,
        targetLanguage: targetLang,
        languageName: supportedLanguages[targetLang]?.name || targetLang,
        nativeName: supportedLanguages[targetLang]?.nativeName || targetLang,
        confidence: translationResult.confidence,
        timestamp: new Date().toISOString(),
        aiProvider: 'Gemini'
      };

      setTranslations(prev => ({
        ...prev,
        [targetLang]: translationRecord
      }));

      setTranslationHistory(prev => [translationRecord, ...prev.slice(0, 19)]);

      if (onTranslationComplete) {
        onTranslationComplete(translationRecord);
      }

      return translationRecord;
    } catch (error) {
      console.error('Translation failed:', error);
      return generateFallbackTranslation(text, targetLang);
    } finally {
      setIsTranslating(false);
    }
  }, [enabled, selectedLanguage, onTranslationComplete]);

  // Generate fallback translation when AI fails
  const generateFallbackTranslation = useCallback((text, targetLang) => {
    const fallbackTranslation = {
      id: Date.now(),
      originalMessage: text,
      translatedMessage: emergencyPhrases[text] || text,
      targetLanguage: targetLang,
      languageName: supportedLanguages[targetLang]?.name || targetLang,
      nativeName: supportedLanguages[targetLang]?.nativeName || targetLang,
      confidence: 30,
      timestamp: new Date().toISOString(),
      aiProvider: 'Fallback Dictionary'
    };

    setTranslations(prev => ({
      ...prev,
      [targetLang]: fallbackTranslation
    }));

    return fallbackTranslation;
  }, []);

  // Translate to all supported languages
  const translateToAllLanguages = useCallback(async (text) => {
    if (!enabled || !text.trim()) return;

    const languagesToTranslate = Object.keys(supportedLanguages).filter(lang => lang !== 'english');
    
    setIsTranslating(true);
    try {
      const translationPromises = languagesToTranslate.map(lang => 
        translateMessage(text, lang)
      );
      
      await Promise.all(translationPromises);
    } catch (error) {
      console.error('Bulk translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [enabled, translateMessage]);

  // Auto-translate when message changes
  useEffect(() => {
    if (message && enabled && autoDetectLanguage) {
      translateMessage(message, preferredLanguage);
    }
  }, [message, enabled, autoDetectLanguage, preferredLanguage, translateMessage]);

  // Save preferred language
  useEffect(() => {
    localStorage.setItem('preferredLanguage', preferredLanguage);
  }, [preferredLanguage]);

  // Get translation confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Quick translate emergency phrase
  const translateEmergencyPhrase = async (phrase) => {
    await translateMessage(phrase, selectedLanguage);
  };

  if (!enabled) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <p className="font-medium">AI Translation Disabled</p>
          <p className="text-sm">Enable AI features to access multilingual support</p>
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
            <span className="text-xl">🌐</span>
            <h3 className="text-lg font-semibold">AI Translation</h3>
            <span className="text-sm text-gray-500">
              ({Object.keys(supportedLanguages).length - 1} languages)
            </span>
          </div>
          {isTranslating && (
            <div className="flex items-center space-x-1 text-sm text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span>Translating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Language Selector */}
      {showLanguageSelector && (
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Target Language:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(supportedLanguages)
              .filter(([key]) => key !== 'english')
              .map(([key, lang]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  setPreferredLanguage(key);
                  if (message) translateMessage(message, key);
                }}
                className={`p-2 text-sm rounded-md border transition-colors ${
                  selectedLanguage === key
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>{lang.flag}</span>
                  <span className="font-medium">{lang.nativeName}</span>
                </div>
                <div className="text-xs text-gray-500">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input and Translation */}
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message to Translate:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                // If parent component controls message, this won't work
                // But it allows for manual input when message prop is empty
              }}
              placeholder="Enter message to translate..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => message && translateMessage(message)}
              disabled={!message || isTranslating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Translate
            </button>
          </div>
        </div>

        {/* Translation Result */}
        {translations[selectedLanguage] && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span>{supportedLanguages[selectedLanguage].flag}</span>
                <span className="font-medium">{supportedLanguages[selectedLanguage].nativeName}</span>
                <span className="text-sm text-gray-500">({supportedLanguages[selectedLanguage].name})</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`font-medium ${getConfidenceColor(translations[selectedLanguage].confidence)}`}>
                  {translations[selectedLanguage].confidence}% confidence
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{translations[selectedLanguage].aiProvider}</span>
              </div>
            </div>
            <div className="text-lg font-medium text-gray-800 mb-1">
              {translations[selectedLanguage].translatedMessage}
            </div>
            <div className="text-sm text-gray-600">
              Original: "{translations[selectedLanguage].originalMessage}"
            </div>
          </div>
        )}

        {/* Emergency Phrases */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Emergency Phrases:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(emergencyPhrases).slice(0, 6).map((phrase) => (
              <button
                key={phrase}
                onClick={() => translateEmergencyPhrase(phrase)}
                disabled={isTranslating}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Translation */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Translate to all {Object.keys(supportedLanguages).length - 1} languages
          </span>
          <button
            onClick={() => message && translateToAllLanguages(message)}
            disabled={!message || isTranslating}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Translate All
          </button>
        </div>
      </div>

      {/* All Translations */}
      {Object.keys(translations).length > 1 && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">All Translations:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Object.entries(translations).map(([lang, translation]) => (
              <div key={lang} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <span>{supportedLanguages[lang]?.flag}</span>
                  <span className="font-medium text-sm">{supportedLanguages[lang]?.nativeName}</span>
                </div>
                <div className="flex-1 mx-3 text-sm text-gray-700">
                  {translation.translatedMessage}
                </div>
                <div className="text-xs text-gray-500">
                  {translation.confidence}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Translation History */}
      {translationHistory.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Translations:</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {translationHistory.slice(0, 5).map((translation) => (
              <div key={translation.id} className="flex justify-between text-xs text-gray-600">
                <span>"{translation.originalMessage}" → {translation.nativeName}</span>
                <span>{new Date(translation.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMultilingualSupport;