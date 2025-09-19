import React, { createContext, useContext, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

const DigitalIDContext = createContext();

export const DigitalIDProvider = ({ children }) => {
  const [digitalIDs, setDigitalIDs] = useState([]);
  const [currentID, setCurrentID] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock blockchain service for hash anchoring
  const mockBlockchainService = {
    anchor: async (payload) => {
      const hash = CryptoJS.SHA256(JSON.stringify(payload) + Date.now()).toString();
      // Simulate blockchain anchoring delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return hash;
    },
    
    verify: async (payload, anchorHash) => {
      // Simple verification - in real app this would check against blockchain
      return typeof anchorHash === 'string' && anchorHash.length === 64;
    }
  };

  const generateDigitalID = useCallback(async (userData, itinerary) => {
    setIsGenerating(true);
    
    try {
      const validFrom = new Date();
      const validTo = new Date();
      validTo.setDate(validTo.getDate() + (itinerary?.duration || 7)); // Default 7 days
      
      const idPayload = {
        id: `tourist_${Date.now()}`,
        touristId: userData.id || `user_${Date.now()}`,
        name: userData.name,
        nationality: userData.nationality,
        passportHash: CryptoJS.SHA256(userData.passport || 'mock_passport').toString(),
        itinerary: itinerary || [],
        validFrom: validFrom.toISOString(),
        validTo: validTo.toISOString(),
        issuedAt: new Date().toISOString()
      };

      // Generate anchor hash using mock blockchain service
      const anchorHash = await mockBlockchainService.anchor(idPayload);
      
      // Create QR code data
      const qrData = {
        id: idPayload.id,
        name: userData.name,
        validTo: validTo.toISOString(),
        verifyUrl: `https://safetourist.app/verify/${idPayload.id}`,
        anchorHash: anchorHash
      };

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      const digitalID = {
        ...idPayload,
        anchorHash,
        qrCode: qrCodeDataURL,
        status: 'active'
      };

      setDigitalIDs(prev => [digitalID, ...prev]);
      setCurrentID(digitalID);
      
      return digitalID;
    } catch (error) {
      console.error('Error generating digital ID:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const verifyDigitalID = useCallback(async (idData) => {
    try {
      const isValid = await mockBlockchainService.verify(idData, idData.anchorHash);
      const now = new Date();
      const validTo = new Date(idData.validTo);
      
      return {
        isValid,
        isExpired: now > validTo,
        daysRemaining: Math.ceil((validTo - now) / (1000 * 60 * 60 * 24))
      };
    } catch (error) {
      console.error('Error verifying digital ID:', error);
      return { isValid: false, isExpired: true, daysRemaining: 0 };
    }
  }, []);

  const revokeDigitalID = useCallback((idToRevoke) => {
    setDigitalIDs(prev => 
      prev.map(id => 
        id.id === idToRevoke 
          ? { ...id, status: 'revoked', revokedAt: new Date().toISOString() }
          : id
      )
    );
    
    if (currentID?.id === idToRevoke) {
      setCurrentID(null);
    }
  }, [currentID]);

  const getActiveDigitalID = useCallback(() => {
    return digitalIDs.find(id => 
      id.status === 'active' && 
      new Date(id.validTo) > new Date()
    );
  }, [digitalIDs]);

  return (
    <DigitalIDContext.Provider
      value={{
        digitalIDs,
        currentID,
        isGenerating,
        generateDigitalID,
        verifyDigitalID,
        revokeDigitalID,
        getActiveDigitalID,
        setCurrentID
      }}
    >
      {children}
    </DigitalIDContext.Provider>
  );
};

export const useDigitalID = () => {
  const context = useContext(DigitalIDContext);
  if (!context) {
    throw new Error('useDigitalID must be used within a DigitalIDProvider');
  }
  return context;
};

export default DigitalIDContext;