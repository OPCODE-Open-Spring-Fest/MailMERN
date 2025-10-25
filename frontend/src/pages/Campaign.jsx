import React from "react";
import EmailTemplateBuilder from "../components/EmailBuilder";

export default function TemplateBuilder() {
  const handleSaveTemplate = async (template) => {
    console.log("Saving template:", template);
    // connect to backend via axios.post("/api/email/templates", template)
  };

  return (
    <div className="p-6">
      <EmailTemplateBuilder onSave={handleSaveTemplate} />
    </div>
  );
}
