export const SOCKET_EVENTS = {
    NEW_REPORT: 'NEW_REPORT',
    REPORT_UPDATED: 'REPORT_UPDATED', 
    JOIN_ROOM: 'joinRoom',
    LEAVE_ROOM: 'leaveRoom',
    DUTY_STATUS_CHANGED: 'DUTY_STATUS_CHANGED',
    OFFICER_UPDATED: 'OFFICER_UPDATED'
};


export const REPORT_TYPES = {
    ABSENT: 'Absent',
    MISSING: 'Missing',
    ABDUCTED: 'Abducted',
    KIDNAPPED: 'Kidnapped',
    HIT_AND_RUN: 'Hit-and-Run'
  };
  
  export const REPORT_TYPE_OPTIONS = Object.values(REPORT_TYPES);