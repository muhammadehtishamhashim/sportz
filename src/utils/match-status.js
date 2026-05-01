import { MATCH_STATUS } from '../validation/matches.js';

// Function to determine match status
export function getMatchStatus(startTime, endTime, now = new Date()) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Invalid date check
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
    }

    // Match not started yet
    if (now < start) {
        return MATCH_STATUS.SCHEDULED;
    }

    // Match finished
    if (now >= end) {
        return MATCH_STATUS.FINISHED;
    }

    // Match is live
    return MATCH_STATUS.LIVE;
}

// Function to sync match status
export async function syncMatchStatus(match, updateStatus) {
    const nextStatus = getMatchStatus(match.startTime, match.endTime);

    // If status can't be determined, keep current
    if (!nextStatus) {
        return match.status;
    }

    // If status changed, update it
    if (match.status !== nextStatus) {
        await updateStatus(nextStatus);
        match.status = nextStatus;
    }

    return match.status;
}