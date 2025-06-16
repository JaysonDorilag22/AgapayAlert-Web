import React, { forwardRef, useEffect, useState } from "react";

const MissingPosterPDF = forwardRef(({ report }, ref) => {
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const url = report.personInvolved.mostRecentPhoto?.url;
    if (!url) {
      setPhotoUrl("");
      return;
    }
    // Convert image to base64 for PDF reliability
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoUrl(reader.result);
        reader.readAsDataURL(blob);
      })
      .catch(() => setPhotoUrl(""));
  }, [report.personInvolved.mostRecentPhoto?.url]);

  const name = `${report.personInvolved.firstName} ${report.personInvolved.lastName}`;
  const missingSince = report.personInvolved.lastSeenDate || report.createdAt;
  const age = report.personInvolved.age || "N/A";
  const lastKnownLocation = report.personInvolved.lastKnownLocation || "N/A";

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d)) return "N/A";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div
      ref={ref}
      style={{
        width: 794,
        height: 1123,
        margin: "0 auto",
        border: "4px solid black",
        padding: 32,
        background: "#fff",
        color: "#000",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
        display: "block",
      }}
    >
      <h1 style={{
        fontSize: 64,
        fontWeight: 900,
        color: "#dc2626",
        textAlign: "center",
        marginBottom: 32,
        letterSpacing: 2,
      }}>
        MISSING
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <img
          src={photoUrl}
          alt={`Missing person: ${name}`}
          style={{
            width: 400,
            height: 400,
            objectFit: "cover",
            border: "4px solid #374151",
            background: "#eee",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: 0 }}>
        <h2 style={{ fontSize: 40, fontWeight: 700 }}>{name}</h2>
        <p style={{ fontSize: 24, margin: "16px 0" }}>
          Missing since: <span style={{ fontWeight: 600 }}>{formatDate(missingSince)}</span>
        </p>
        <p style={{ fontSize: 24, margin: "16px 0" }}>
          Age: <span style={{ fontWeight: 600 }}>{age}</span>
        </p>
        <p style={{ fontSize: 24, margin: "16px 0" }}>
          Last Known Location: <span style={{ fontWeight: 600 }}>{lastKnownLocation}</span>
        </p>
      </div>
    </div>
  );
});

export default MissingPosterPDF;