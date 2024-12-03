// Check if MetaMask is installed
window.onload = () => {
    if (typeof window.ethereum === 'undefined') {
        document.getElementById('status').innerText = 'MetaMask is not installed. Please install it to use this site.';
        document.getElementById('connectButton').disabled = true;
    }
};

// Handle MetaMask connection
document.getElementById('connectButton').addEventListener('click', async () => {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        document.getElementById('status').innerText = `Connected: ${accounts[0]}`;
    } catch (error) {
        if (error.code === 4001) {
            // User rejected the request
            document.getElementById('status').innerText = 'Connection request rejected. Please try again.';
        } else {
            console.error(error);
            document.getElementById('status').innerText = 'An error occurred. Please try again.';
        }
    }
});