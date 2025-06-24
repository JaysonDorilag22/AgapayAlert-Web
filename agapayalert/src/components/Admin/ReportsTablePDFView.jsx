import React from "react";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "numeric", hour12: true
  });
};

const getFilterLabel = (value, allLabel) => {
  if (!value || value === "" || value === undefined) return allLabel;
  if (Array.isArray(value)) return value.length ? value.join(", ") : allLabel;
  return value;
};

const ReportsTablePDFView = React.forwardRef(
  ({ reports, totalReports, filters }, ref) => {
    const {
      status,
      city,
      type,
      barangay,
      policeStation,
      gender,
      ageCategory,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    } = filters || {};

    // Format date range
    let dateRange = "all";
    if (startDate || endDate) {
      dateRange = `Start Date: ${formatDate(startDate) || "N/A"} - End Date: ${formatDate(endDate) || "N/A"}`;
    }

    // Format now
    const now = new Date();
    const datePrinted = now.toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric",
      hour: "numeric", minute: "numeric", hour12: true
    });

    return (
      <div ref={ref} style={{ padding: 32, fontFamily: "Arial, sans-serif", color: "#222", background: "#fff", width: 1000 }}>
        <h1 style={{ color: "#123F7B", fontSize: 32, marginBottom: 8 }}>Report Summary</h1>
        <hr style={{ marginBottom: 16 }} />
        <div style={{ marginBottom: 24, fontSize: 18 }}>
          <p><b>Total Reports:</b> {totalReports}</p>
          <p>
            <b>List of:</b> {getFilterLabel(status, "all status")} from {getFilterLabel(city, "all cities")}
          </p>
          <p>
            <b>Type:</b> {getFilterLabel(type, "all")}
          </p>
          <p>
            <b>Barangay included:</b> {getFilterLabel(barangay, "all barangays")}
          </p>
          <p>
            <b>Police Station included:</b> {getFilterLabel(policeStation, "all Police Station")}
          </p>
          <p>
            <b>Gender applied:</b> {getFilterLabel(gender, "all Gender")}
          </p>
          <p>
            <b>Age range applied:</b> {getFilterLabel(ageCategory, "all")}
          </p>
          <p>
            <b>Date range applied:</b> {dateRange}
          </p>
          <p>
            <b>Sort by:</b> {sortBy || "createdAt"}
          </p>
          <p>
            <b>Order:</b> {sortOrder || "desc"}
          </p>
          <p>
            <b>Date printed:</b> {datePrinted}
          </p>
        </div>
        <h2 style={{ color: "#123F7B", fontSize: 24, marginBottom: 8 }}>Report List</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ background: "#123F7B", color: "#fff" }}>
              <th style={{ padding: 8, border: "1px solid #ccc" }}>Report ID</th>
              <th style={{ padding: 8, border: "1px solid #ccc" }}>Type</th>
              <th style={{ padding: 8, border: "1px solid #ccc" }}>Name</th>
              <th style={{ padding: 8, border: "1px solid #ccc" }}>Date & Time Reported</th>
              <th style={{ padding: 8, border: "1px solid #ccc" }}>Last Known Location</th>
              <th style={{ padding: 8, border: "1px solid #ccc" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} style={{ background: "#f9f9f9" }}>
                <td style={{ padding: 8, border: "1px solid #ccc" }}>{report.caseId}</td>
                <td style={{ padding: 8, border: "1px solid #ccc" }}>{report.type}</td>
                <td style={{ padding: 8, border: "1px solid #ccc" }}>
                  {report.personInvolved.firstName} {report.personInvolved.lastName}
                </td>
                <td style={{ padding: 8, border: "1px solid #ccc" }}>
                  {formatDateTime(report.createdAt)}
                </td>
                <td style={{ padding: 8, border: "1px solid #ccc" }}>{report.personInvolved.lastKnownLocation}</td>
                <td style={{ padding: 8, border: "1px solid #ccc" }}>{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default ReportsTablePDFView;