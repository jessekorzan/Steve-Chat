
// UI utility functions
export function scrollPageToEnd() {
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 250);
}

export function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const pValue = urlParams.get('p');

    if (pValue && pValue.trim()) {
        // Clear the URL parameter after reading it
        const url = new URL(window.location);
        url.searchParams.delete('p');
        window.history.replaceState({}, document.title, url.pathname + url.search);

        // Return the value to be handled by the calling function
        return pValue.trim();
    }
    return null;
}
