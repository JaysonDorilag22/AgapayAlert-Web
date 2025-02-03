import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getReportDetails } from '../redux/actions/reportActions';
import { HiOutlineEye } from "react-icons/hi2";

const ReportDetailsModal = ({ reportId, onClose }) => {
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      const result = await dispatch(getReportDetails(reportId));
      if (result.success) {
        setReport(result.data);
      }
    };

    fetchReportDetails();
  }, [dispatch, reportId]);

  const renderField = (label, value) => (
    <p><strong>{label}:</strong> {value !== undefined && value !== null && value !== '' ? value : 'No Data'}</p>
  );

  return (
    <Dialog open={!!reportId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1120px] sm:max-h-[980px]">
        {report ? (
          <div className="p-6 overflow-auto max-h-[600px]">
            <h2 className="text-2xl font-bold mb-4">Report Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderField('Type', report.type)}
                {renderField('Name', `${report.personInvolved.firstName} ${report.personInvolved.lastName}`)}
                {renderField('Age', report.personInvolved.age)}
                {renderField('Last Seen Date', report.personInvolved.lastSeenDate ? new Date(report.personInvolved.lastSeenDate).toLocaleDateString() : null)}
                {renderField('Last Seen Time', report.personInvolved.lastSeentime)}
                {renderField('Last Known Location', report.personInvolved.lastKnownLocation)}
                {renderField('Status', report.status)}
                {renderField('Follow Up', report.followUp)}
                {renderField('Broadcast Consent', report.broadcastConsent ? 'Yes' : 'No')}
                {renderField('Is Published', report.isPublished ? 'Yes' : 'No')}
                {renderField('Created At', new Date(report.createdAt).toLocaleString())}
                {renderField('Updated At', new Date(report.updatedAt).toLocaleString())}
                {renderField('Reporter', `${report.reporter.firstName} ${report.reporter.lastName}`)}
                {renderField('Reporter Contact', `${report.reporter.number}, ${report.reporter.email}`)}
                {renderField('Assigned Police Station', report.assignedPoliceStation.name)}
                {renderField('Assigned Officer', `${report.assignedOfficer?.firstName} ${report.assignedOfficer?.lastName}`)}
              </div>
              <div>
                <img src={report.personInvolved.mostRecentPhoto?.url || ''} alt="Most Recent Photo" className="w-full h-auto rounded-lg" />
                {report.additionalImages && report.additionalImages.length > 0 ? (
                  report.additionalImages.map((image, index) => (
                    <img key={index} src={image.url} alt={`Additional Image ${index + 1}`} className="w-full h-auto rounded-lg mt-2" />
                  ))
                ) : (
                  <p>No Additional Images</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Broadcast History</h3>
              {report.broadcastHistory && report.broadcastHistory.length > 0 ? (
                report.broadcastHistory.map((history, index) => (
                  <div key={index} className="mb-2">
                    {renderField('Published By', `${history.publishedBy.firstName} ${history.publishedBy.lastName}`)}
                    {renderField('Roles', history.publishedBy.roles.join(', '))}
                    {renderField('Date', new Date(history.date).toLocaleString())}
                  </div>
                ))
              ) : (
                <p>No Broadcast History</p>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Consent Update History</h3>
              {report.consentUpdateHistory && report.consentUpdateHistory.length > 0 ? (
                report.consentUpdateHistory.map((history, index) => (
                  <div key={index} className="mb-2">
                    {renderField('Updated By', `${history.updatedBy.firstName} ${history.updatedBy.lastName}`)}
                    {renderField('Date', new Date(history.date).toLocaleString())}
                  </div>
                ))
              ) : (
                <p>No Consent Update History</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;