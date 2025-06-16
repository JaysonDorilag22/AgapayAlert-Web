import React, { createContext, useContext, useState } from "react";


const ReportModalContext = createContext();

export const useReportModal = () => useContext(ReportModalContext);

export function ReportModalProvider({ children }) {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (reportId) => {
    setSelectedReportId(reportId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedReportId(null);
    setIsOpen(false);
  };

  return (
    <ReportModalContext.Provider value={{ selectedReportId, isOpen, openModal, closeModal }}>
      {children}
    </ReportModalContext.Provider>
  );
}