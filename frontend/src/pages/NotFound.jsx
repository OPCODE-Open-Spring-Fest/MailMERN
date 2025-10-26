import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.illustrationBox}>
        <div style={styles.circle}></div>
        <h1 style={styles.title}>404</h1>
      </div>

      <div style={styles.contentBox}>
        <h2 style={styles.subtitle}>Oops! You seem lost.</h2>
        <p style={styles.description}>
          The page you’re looking for doesn’t exist or may have been moved. Let’s get you back on track.
        </p>
        <Link to="/" style={styles.button}>
          ⬅️ Return to Home
        </Link>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          a:hover {
            background-color: #fff !important;
            color: #ff416c !important;
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    overflow: "hidden",
    textAlign: "center",
    animation: "fadeIn 1s ease-in-out",
    padding: "0 20px",
  },
  illustrationBox: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    animation: "float 3s ease-in-out infinite",
  },
  circle: {
    width: "200px",
    height: "200px",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "50%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    margin: "auto",
    filter: "blur(5px)",
    zIndex: 0,
  },
  title: {
    fontSize: "7rem",
    fontWeight: "900",
    zIndex: 2,
    textShadow: "0 5px 20px rgba(0, 0, 0, 0.3)",
  },
  contentBox: {
    marginTop: "30px",
    maxWidth: "600px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "15px",
    padding: "30px 40px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    backdropFilter: "blur(12px)",
    animation: "fadeIn 1.5s ease-in-out",
  },
  subtitle: {
    fontSize: "2.5rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  description: {
    fontSize: "1.1rem",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  button: {
    display: "inline-block",
    padding: "14px 30px",
    backgroundColor: "#ffebee",
    color: "#ff416c",
    borderRadius: "50px",
    fontWeight: "600",
    textDecoration: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.3)",
  },
};
