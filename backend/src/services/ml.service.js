import axios from 'axios';
import { config } from '../config/env.js';

/**
 * Sends profile text to the Python ML Inference service for Top-3 prediction.
 * Handles timeouts and connection errors gracefully by returning a safe fallback.
 * 
 * @param {string} text Normalized skill profile text.
 * @returns {Promise<object>} Model classification result or fallback response.
 */
export const predict = async (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      success: false,
      fallback: true,
      error: 'Empty or invalid profile text input'
    };
  }
  
  try {
    const response = await axios.post(`${config.mlServiceUrl}/predict`, {
      text: text
    }, {
      timeout: 1000 // 1000ms timeout protection per requirements
    });
    
    return response.data;
  } catch (error) {
    console.warn(
      `[WARNING] ML Inference API unavailable — reverting to Rule Engine. Details: ${error.message}`
    );
    return {
      success: false,
      fallback: true,
      error: `ML Service Connection Failed: ${error.message}`
    };
  }
};
