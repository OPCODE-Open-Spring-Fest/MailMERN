import api from "./api";

export const sendEmail = async (emailData) => {
  try {
    const response = await api.post("/emails/send", emailData);
    return response.data;
  } catch (error) {
    console.error("Failed to send email:", error.response || error);
    throw error;
  }
};

export const sendBulkEmail = async (formData) => {
  try {
    const response = await api.post("/emails/bulk-send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send bulk email:", error.response || error);
    throw error;
  }
};
export const getCampaignStatus = async (campaignId) => {
  try {
    const response = await api.get(`/emails/campaign/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get campaign status:", error.response || error);
    throw error;
  }
};
export const getCampaigns = async (page = 1, limit = 20) => {
  try {
    const response = await api.get("/emails/campaigns", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get campaigns:", error.response || error);
    throw error;
  }
};