import axios from 'axios';
import { ULDK_CONFIG } from './config';
import { ULDKRequestParams, ULDKError } from './types';
import { useNotificationStore } from '../../store/notificationStore';

// Create dedicated axios instance for ULDK API
const uldkApi = axios.create({
  baseURL: ULDK_CONFIG.API_URL,
  headers: {
    'Accept': 'text/plain',
    'Cache-Control': 'no-cache'
  },
  timeout: 15000
});

// Add retry functionality
async function retryRequest(fn: () => Promise<any>, retries = ULDK_CONFIG.MAX_RETRIES): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error) && (!error.response || error.response.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, ULDK_CONFIG.RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
}

export async function makeULDKRequest(params: ULDKRequestParams): Promise<string> {
  const { addNotification } = useNotificationStore.getState();

  try {
    if (!params.request || !params.xy) {
      throw new Error('Missing required parameters');
    }

    const searchParams = new URLSearchParams({
      request: params.request,
      xy: params.xy,
      result: params.result || ULDK_CONFIG.RESULT_FIELDS[params.request],
      srid: params.srid || ULDK_CONFIG.DEFAULT_SRID
    });

    const url = `${ULDK_CONFIG.API_URL}?${searchParams}`;
    
    const response = await retryRequest(() => uldkApi.get(url));
    const data = response.data;

    if (!data) {
      throw new Error('Empty response from ULDK API');
    }

    if (typeof data === 'string' && data.includes('ERROR')) {
      throw new Error('ULDK API returned error response');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error fetching parcel data';
    
    addNotification({
      type: 'error',
      message: errorMessage,
      timeout: 5000
    });

    throw error;
  }
}