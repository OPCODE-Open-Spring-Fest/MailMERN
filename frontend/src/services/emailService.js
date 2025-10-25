import api from "../api";

export const sendEmail = async (emailData) => {
  try {
    const response = await api.post("/emails/send", emailData);
    return response.data;
  } catch (error) {
    console.error("Failed to send email:", error.response || error);
    throw error;
  }
};
