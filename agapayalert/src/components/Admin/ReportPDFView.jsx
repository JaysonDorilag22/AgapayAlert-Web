import React, { forwardRef, useEffect, useState } from "react";

const ReportPDFView = forwardRef(({ report, finderReports, formattedDate }, ref) => {
  const [photoDataUrl, setPhotoDataUrl] = useState("");

  useEffect(() => {
    const url = report.personInvolved.mostRecentPhoto?.url;
    if (!url) {
      setPhotoDataUrl("");
      return;
    }
    // Convert image to base64
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoDataUrl(reader.result);
        reader.readAsDataURL(blob);
      })
      .catch(() => setPhotoDataUrl(""));
  }, [report.personInvolved.mostRecentPhoto?.url]);

  // Helper to conditionally render a field if value is not empty/"N/A"/null/undefined
  const renderField = (label, value) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "N/A"
    )
      return null;
    return (
      <p>
        <b>{label}:</b> {value}
      </p>
    );
  };

  // Helper for date fields
  const renderDateField = (label, value) => {
    if (!value) return null;
    const dateStr = new Date(value).toLocaleDateString();
    if (!dateStr || dateStr === "Invalid Date") return null;
    return (
      <p>
        <b>{label}:</b> {dateStr}
      </p>
    );
  };

  return (
    <div
      ref={ref}
      style={{
        padding: 32,
        fontFamily: "Arial, sans-serif",
        color: "#222",
        width: 800,
        background: "#fff",
      }}
    >
      <h1 style={{ color: "#123F7B", fontSize: 32, marginBottom: 8 }}>Report Details</h1>
      <hr style={{ marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 32 }}>
        <img
          src={photoDataUrl || ""}
          alt="Most Recent"
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "6px solid #123F7B",
            objectFit: "cover",
            background: "#eee",
          }}
        />
        <div>
          <h2 style={{ fontSize: 24, margin: 0 }}>
            {report.personInvolved.firstName} {report.personInvolved.lastName}
          </h2>
          {renderField("Type", report.type ? `${report.type} Person` : null)}
          {renderField("Status", report.status)}
          {renderField("Date & Time Reported", formattedDate)}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: "#123F7B", marginBottom: 8 }}>Reporter Information</h3>
        {renderField("Name", `${report.reporter.firstName} ${report.reporter.lastName}`)}
        {renderField("Relationship", report.personInvolved.relationship)}
        {renderField("Contact Number", report.reporter.number)}
        {renderField("Email", report.reporter.email)}
        {renderField("Assigned Police Station", report.assignedPoliceStation?.name)}
        {report.assignedOfficer &&
          renderField(
            "Assigned Officer",
            `${report.assignedOfficer.firstName} ${report.assignedOfficer.lastName}`
          )}
        {renderField("Broadcast Consent", report.broadcastConsent ? "Yes" : "No")}
        {renderField("Is Published", report.isPublished ? "Yes" : "No")}
      </div>

      {report.followUp && report.followUp.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: "#123F7B", marginBottom: 8 }}>Follow Ups</h3>
          {report.followUp.map((item, idx) => (
            <div key={item._id} style={{ marginBottom: 8, paddingLeft: 8, borderLeft: "2px solid #D46A79" }}>
              <span style={{ color: "#123F7B", fontWeight: "bold" }}>{idx + 1}.</span>{" "}
              <span style={{ color: "#D46A79", fontSize: 12 }}>{new Date(item.updatedAt).toLocaleString()}</span>
              <div>{item.note}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: "#123F7B", marginBottom: 8 }}>Personal Information</h3>
        {renderField("Last Known Location", report.personInvolved.lastKnownLocation)}
        {(report.personInvolved.lastSeenDate || report.personInvolved.lastSeentime) && (
          <p>
            <b>Date & Time Last Seen:</b>{" "}
            {report.personInvolved.lastSeenDate
              ? new Date(report.personInvolved.lastSeenDate).toLocaleDateString()
              : ""}
            {report.personInvolved.lastSeentime
              ? " " + report.personInvolved.lastSeentime
              : ""}
          </p>
        )}
        {renderField("Alias", report.personInvolved.alias)}
        {renderField("Age", report.personInvolved.age)}
        {renderDateField("Date of Birth", report.personInvolved.dateOfBirth)}
        {renderField("Gender", report.personInvolved.gender)}
        {renderField("Last Known Clothing", report.personInvolved.lastKnownClothing)}
        {renderField("Contact Information", report.personInvolved.contactInformation)}
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: "#123F7B", marginBottom: 8 }}>Physical Information</h3>
        {renderField("Race", report.personInvolved.race)}
        {renderField("Height", report.personInvolved.height)}
        {renderField("Weight", report.personInvolved.weight)}
        {renderField("Eye Color", report.personInvolved.eyeColor)}
        {renderField("Scars / Marks / Tattoos", report.personInvolved.scarsMarksTattoos)}
        {renderField("Hair Color", report.personInvolved.hairColor)}
        {renderField("Birth Defects", report.personInvolved.birthDefects)}
        {renderField("Prosthetics", report.personInvolved.prosthetics)}
        {renderField("Blood Type", report.personInvolved.bloodType)}
        {renderField("Medications", report.personInvolved.medications)}
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: "#123F7B", marginBottom: 8 }}>Witness Reports</h3>
        {finderReports && finderReports.length > 0 ? (
          finderReports.map((fr, idx) => (
            <div key={fr._id || idx} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
              {fr.finder?.firstName || fr.finder?.lastName
                ? renderField(
                    "Witness Name",
                    `${fr.finder?.firstName || ""} ${fr.finder?.lastName || ""}`.trim()
                  )
                : null}
              {fr.finder?.createdAt &&
                renderField(
                  "Date & Time Submitted",
                  new Date(fr.finder.createdAt).toLocaleString()
                )}
              {renderField("Status", fr.status)}
              {fr.discoveryDetails?.dateAndTime &&
                renderField(
                  "Discovery Date & Time",
                  new Date(fr.discoveryDetails.dateAndTime).toLocaleString()
                )}
              {renderField("Physical Condition", fr.personCondition?.physicalCondition)}
              {renderField("Emotional Condition", fr.personCondition?.emotionalState)}
              {typeof fr.authoritiesNotified === "boolean" &&
                renderField("Authorities Notified", fr.authoritiesNotified ? "Yes" : "No")}
              {renderField("Statement", fr.statement)}
              {fr.images && fr.images.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <b>Images:</b>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    {fr.images.map((img, i) =>
                      img.url ? (
                        <img
                          key={i}
                          src={img.url}
                          alt={`Finder Report Image ${i + 1}`}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 4,
                            border: "1px solid #ccc",
                          }}
                        />
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No witness reports.</p>
        )}
      </div>
    </div>
  );
});

export default ReportPDFView;