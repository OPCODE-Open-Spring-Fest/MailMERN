import React, { useState } from "react";

export default function EmailTemplateBuilder({ onSave }) {
  const [template, setTemplate] = useState({
    subject: "",
    body: "",
    imageUrl: "",
  });

  const [preview, setPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsertVariable = (variable) => {
    setTemplate((prev) => ({
      ...prev,
      body: prev.body + ` {{${variable}}}`,
    }));
  };

  const handleSave = () => {
    if (onSave) onSave(template);
    alert("Template saved successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Email Template Builder
      </h2>

      {/* Subject Input */}
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
        Subject
      </label>
      <input
        type="text"
        name="subject"
        value={template.subject}
        onChange={handleChange}
        placeholder="Enter email subject"
        className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-800 dark:text-gray-100"
      />

      {/* Body Input */}
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
        Email Body
      </label>
      <textarea
        name="body"
        value={template.body}
        onChange={handleChange}
        placeholder="Write your email body here..."
        rows="6"
        className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-800 dark:text-gray-100"
      />

     
      {/* Insert Variables */}
      <div className="flex gap-2 mb-4">
        {["name", "email", "date"].map((v) => (
          <button
            key={v}
            onClick={() => handleInsertVariable(v)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
          >
            Insert {"{{" + v + "}}"}
          </button>
        ))}
      </div>


      {/* Image URL */}
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
        Image URL (optional)
      </label>
      <input
        type="text"
        name="imageUrl"
        value={template.imageUrl}
        onChange={handleChange}
        placeholder="Paste image URL"
        className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-800 dark:text-gray-100"
      />

      {/* Preview Toggle */}
      <button
        onClick={() => setPreview(!preview)}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-800"
      >
        {preview ? "Hide Preview" : "Preview"}
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Save Template
      </button>

      {/* Preview Section */}
      {preview && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-bold text-lg mb-2">📧 Preview</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Subject:</strong> {template.subject}
          </p>
          <p
            className="text-gray-700 dark:text-gray-200 mb-4 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: template.body.replace(/\{\{(\w+)\}\}/g, "<b>$1</b>"),
            }}
          />
          {template.imageUrl && (
            <img
              src={template.imageUrl}
              alt="Email visual"
              className="max-w-full rounded-lg shadow-md"
            />
          )}
        </div>
      )}
    </div>
  );
}
