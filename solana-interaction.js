const { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');

// Connect to the Solana cluster (localhost:8899 in your case)
const connection = new Connection('http://localhost:8899', 'confirmed');

async function getBlockHeight() {
  try {
    const blockHeight = await connection.getSlot();
    console.log('Current block height:', blockHeight);
  } catch (error) {
    console.error('Error fetching block height:', error);
  }
}

// Function to get the token balance of an account
async function getTokenBalance(connection, token, accountPublicKey) {
  try {
    const accountInfo = await connection.getTokenAccountBalance(accountPublicKey);
    return accountInfo.value.uiAmount; // Returns the token balance as a number
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0; // Return 0 if there's an error to indicate balance retrieval failure
  }
}

async function getAccountInfo(connection, publicKey) {
  try {
    const accountInfo = await connection.getAccountInfo(publicKey);
    return accountInfo;
  } catch (error) {
    console.error('Error getting account info:', error);
    return 0; // Return 0 if there's an error to indicate balance retrieval failure
  }
}

getBlockHeight();
