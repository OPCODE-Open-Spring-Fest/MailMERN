import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Send, FileText, Users, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { sendBulkEmail, getCampaignStatus } from "../services/emailService";
import toast from "react-hot-toast";

export default function BulkEmail() {
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [campaignId, setCampaignId] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setCsvFile(file);

    // Parse CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const preview = [];
      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        preview.push(row);
      }
      
      setCsvPreview(preview);
      toast.success(`CSV file loaded. Found ${lines.length - 1} recipients.`);
    };
    reader.readAsText(file);
  };

  //form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!campaignName || !subject) {
      toast.error("Please fill in campaign name and subject");
      return;
    }

    if (!htmlContent && !textContent) {
      toast.error("Please provide either HTML or text content");
      return;
    }

    if (!csvFile) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("name", campaignName);
      formData.append("subject", subject);
      formData.append("html", htmlContent);
      formData.append("text", textContent);
      formData.append("file", csvFile);

      const response = await sendBulkEmail(formData);
      
      if (response.success) {
        setCampaignId(response.campaignId);
        toast.success(response.message || "Campaign started successfully!");
        
        startPolling(response.campaignId);
      } else {
        toast.error(response.error || "Failed to start campaign");
      }
    } catch (error) {
      console.error("Error sending bulk email:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to send bulk emails");
    } finally {
      setIsSending(false);
    }
  };

  const startPolling = (id) => {
    const interval = setInterval(async () => {
      try {
        const status = await getCampaignStatus(id);
        setCampaignStatus(status.campaign);
        
        if (status.campaign.status === 'completed' || status.campaign.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
        }
      } catch (error) {
        console.error("Error fetching campaign status:", error);
      }
    }, 2000);
    
    setPollingInterval(interval);
  };

  React.useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Email Sending</h1>
          <p className="text-gray-600">Send mass emails from a CSV list with batch processing</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Name */}
                <div>
                  <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Q4 Product Launch"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Exciting News About Our New Product"
                    required
                  />
                </div>

                {/* HTML Content */}
                <div>
                  <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-2">
                    HTML Content
                  </label>
                  <textarea
                    id="htmlContent"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="<html><body><h1>Hello {{name}}</h1><p>Your email content here...</p></body></html>"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use {"{{name}}"} to personalize emails with recipient names
                  </p>
                </div>

                {/* Text Content */}
                <div>
                  <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-2">
                    Text Content (Plain Text)
                  </label>
                  <textarea
                    id="textContent"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hello {{name}},\n\nYour email content here..."
                  />
                </div>

                {/* CSV File Upload */}
                <div>
                  <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                    CSV File *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="csvFile"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a CSV file</span>
                          <input
                            id="csvFile"
                            name="csvFile"
                            type="file"
                            accept=".csv"
                            className="sr-only"
                            onChange={handleFileUpload}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">CSV with email and name columns</p>
                      {csvFile && (
                        <p className="text-sm text-green-600 mt-2">
                          <FileText className="inline w-4 h-4 mr-1" />
                          {csvFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Starting Campaign...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Start Campaign
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-6"
          >
            {/* CSV Preview */}
            {csvPreview.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  CSV Preview
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {csvPreview.map((row, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="font-medium text-gray-900">
                        {row.name || row['full name'] || row.fullname || 'N/A'}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {row.email || row['e-mail'] || row['email address'] || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Status */}
            {campaignStatus && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {campaignStatus.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : campaignStatus.status === 'failed' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  Campaign Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {campaignStatus.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{campaignStatus.progress || 0}%</span>
                        <span>
                          {campaignStatus.sentCount || 0} / {campaignStatus.totalRecipients || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${campaignStatus.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Sent</p>
                      <p className="text-lg font-semibold text-green-600">
                        {campaignStatus.sentCount || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-lg font-semibold text-red-600">
                        {campaignStatus.failedCount || 0}
                      </p>
                    </div>
                  </div>
                  {campaignStatus.errors && campaignStatus.errors.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Errors</p>
                      <div className="max-h-32 overflow-y-auto text-xs text-red-600 space-y-1">
                        {campaignStatus.errors.slice(0, 5).map((error, index) => (
                          <p key={index} className="flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {error}
                          </p>
                        ))}
                        {campaignStatus.errors.length > 5 && (
                          <p className="text-gray-500">
                            +{campaignStatus.errors.length - 5} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}


