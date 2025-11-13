// controllers/googleController.js
let google;
try {
  google = require("googleapis").google;
} catch (error) {
  console.warn('  googleapis package not found. Google Calendar features will be disabled.');
  google = null;
}
const { DateTime } = require("luxon");

let oauth2Client;
if (google) {
  oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5001/api/google-calendar/oauth2callback"
  );
} else {
  oauth2Client = null;
}

exports.getAuthUrl = (req, res) => {
  if (!google || !oauth2Client) {
    return res.status(503).json({
      success: false,
      error: "Google Calendar feature is not available. Please install googleapis package: npm install googleapis"
    });
  }
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  res.json({ url });
};

exports.oauthCallback = async (req, res) => {
  if (!google || !oauth2Client) {
    return res.status(503).send("Google Calendar feature is not available. Please install googleapis package.");
  }
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send("✅ Google Calendar connected. You can close this tab now.");
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).send("Failed to authenticate with Google Calendar.");
  }
};

exports.scheduleMeeting = async (req, res) => {
  if (!google || !oauth2Client) {
    return res.status(503).json({
      success: false,
      error: "Google Calendar feature is not available. Please install googleapis package: npm install googleapis"
    });
  }
  try {
    const { title, date, time, duration = 30 } = req.body;

    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
      return res
        .status(401)
        .json({ success: false, message: "Google Calendar not connected" });
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Helper: parse AM/PM time
    const normalizeTime = (t) => {
      const match = t.match(/(\d{1,2})(:(\d{2}))?\s*(am|pm)?/i);
      let hour = parseInt(match[1]);
      const minute = match[3] ? parseInt(match[3]) : 0;
      const meridian = match[4]?.toLowerCase();

      if (meridian === "pm" && hour < 12) hour += 12;
      if (meridian === "am" && hour === 12) hour = 0;

      return { hour, minute };
    };

    const { hour, minute } = normalizeTime(time);

    const startDateTime = DateTime.fromObject(
      {
        year: Number(date.split("-")[0]),
        month: Number(date.split("-")[1]),
        day: Number(date.split("-")[2]),
        hour,
        minute,
      },
      { zone: "Asia/Kolkata" }
    );

    const endDateTime = startDateTime.plus({ minutes: duration });

    const event = {
      summary: title || "Untitled Meeting",
      start: {
        dateTime: startDateTime.toISO(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime.toISO(),
        timeZone: "Asia/Kolkata",
      },
    };

    const result = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    res.json({
      success: true,
      message: "Meeting scheduled successfully!",
      eventLink: result.data.htmlLink,
      start: startDateTime.toFormat("yyyy-MM-dd HH:mm"),
    });
  } catch (error) {
    console.error("❌ Google Calendar error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export OAuth client for reuse if needed
exports.oauth2Client = oauth2Client;
