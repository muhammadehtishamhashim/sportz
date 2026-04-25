// Match status constants
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Helper functions for match status
export const isMatchScheduled = (status) => status === MATCH_STATUS.SCHEDULED;
export const isMatchLive = (status) => status === MATCH_STATUS.LIVE;
export const isMatchFinished = (status) => status === MATCH_STATUS.FINISHED;

// Get all match statuses as array
export const getAllMatchStatuses = () => Object.values(MATCH_STATUS);

// Validate if a status is valid
export const isValidMatchStatus = (status) => getAllMatchStatuses().includes(status);

// Get status display name (capitalize first letter)
export const getStatusDisplayName = (status) => {
  if (!isValidMatchStatus(status)) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Check if match can transition to a new status
export const canTransitionTo = (currentStatus, newStatus) => {
  const transitions = {
    [MATCH_STATUS.SCHEDULED]: [MATCH_STATUS.LIVE],
    [MATCH_STATUS.LIVE]: [MATCH_STATUS.FINISHED],
    [MATCH_STATUS.FINISHED]: [], // No transitions from finished
  };

  return transitions[currentStatus]?.includes(newStatus) || false;
};