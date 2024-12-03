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
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Display the connected account
        document.getElementById('status').innerText = `Connected: ${accounts[0]}`;
    } catch (error) {
        console.error(error);
        document.getElementById('status').innerText = 'Connection failed. Please try again.';
    }
});