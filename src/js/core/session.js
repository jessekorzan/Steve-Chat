
// Session management functionality
export function initializeSession() {
    if (!localStorage.getItem('sessionID')) {
        const sessionID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionID', sessionID);
    }
}

export function getSessionID() {
    return localStorage.getItem('sessionID');
}
