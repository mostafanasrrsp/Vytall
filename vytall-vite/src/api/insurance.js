import axios from 'axios';

const BASE_URL = '/api/insurance';

// Insurance Verification APIs
export const verifyInsurance = async (insuranceData) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify`, insuranceData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to verify insurance');
  }
};

export const getInsuranceStatus = async (verificationId) => {
  try {
    const response = await axios.get(`${BASE_URL}/verify/${verificationId}/status`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get insurance verification status');
  }
};

export const getInsuranceProviders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/providers`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch insurance providers');
  }
};

// Claim Submission APIs
export const submitClaim = async (claimData) => {
  try {
    const response = await axios.post(`${BASE_URL}/claims`, claimData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to submit claim');
  }
};

export const getClaimStatus = async (claimId) => {
  try {
    const response = await axios.get(`${BASE_URL}/claims/${claimId}/status`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get claim status');
  }
};

export const getClaims = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/claims`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch claims');
  }
};

export const getClaimDetails = async (claimId) => {
  try {
    const response = await axios.get(`${BASE_URL}/claims/${claimId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch claim details');
  }
};

export const updateClaim = async (claimId, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}/claims/${claimId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update claim');
  }
};

export const cancelClaim = async (claimId) => {
  try {
    const response = await axios.post(`${BASE_URL}/claims/${claimId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to cancel claim');
  }
};

// Claim Documents APIs
export const uploadClaimDocument = async (claimId, documentData) => {
  try {
    const formData = new FormData();
    formData.append('file', documentData.file);
    formData.append('documentType', documentData.type);
    
    const response = await axios.post(
      `${BASE_URL}/claims/${claimId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload claim document');
  }
};

export const getClaimDocuments = async (claimId) => {
  try {
    const response = await axios.get(`${BASE_URL}/claims/${claimId}/documents`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch claim documents');
  }
};

export const deleteClaimDocument = async (claimId, documentId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/claims/${claimId}/documents/${documentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete claim document');
  }
}; 