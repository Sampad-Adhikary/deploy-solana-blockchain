const { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair } = require('@solana/web3.js');
const fs = require('fs');

// Connection to the private Solana network
const connection = new Connection('http://localhost:8899', 'confirmed');

// Function to create a new token account
async function createTokenAccount(connection, ownerPublicKey) {
  const tokenAccount = await PublicKey.createWithSeed(ownerPublicKey, 'SOME_RANDOM_SEED', new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'));
  return tokenAccount;
}

// Function to create a custom token (mint)
async function createMint(connection, ownerPublicKey, mintAuthority) {
  const token = await PublicKey.createWithSeed(ownerPublicKey, 'SOME_OTHER_RANDOM_SEED', new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'));
  return token;
}

// Function to mint tokens
async function mintTokens(connection, token, mintAuthority, tokenAccount, amountToMint) {
  // Get the fee payer's public key (the account that will pay for the transaction fees)
  const feePayerPublicKey = mintAuthority.publicKey;
  // Create a transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: feePayerPublicKey,
      toPubkey: tokenAccount,
      lamports: 0, // You can specify some lamports here for the transaction fee (optional)
    }),
  );
  // Sign the transaction with the mintAuthority (fee payer's keypair)
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [mintAuthority], // Signers (in this case, only mintAuthority needs to sign)
  );
  console.log(`Tokens minted successfully! Signature: ${signature}`);
}

// Function to transfer tokens
async function transferTokens(connection, token, mintAuthority, senderAccount, destinationPublicKey, amountToSend) {
  // Create a transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderAccount.publicKey, // Use the sender's public key
      toPubkey: destinationPublicKey,
      lamports: 0, // You can specify some lamports here for the transaction fee (optional)
    }),
  );
  // Sign the transaction with the sender's keypair (not mintAuthority)
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [senderAccount], // Signers (senderAccount needs to sign)
  );
  console.log(`Tokens transferred successfully! Signature: ${signature}`);
}

//Main Function to call all the transaction related functions
async function main() {
    try {
      // Read the keypair.json file and parse the content
      const idJsonContent = fs.readFileSync('config/keypair.json', 'utf8');
      const idJsonData = JSON.parse(idJsonContent);
  
      // Extract the private key from the id.json data (assuming it's a hexadecimal string)
      const privateKeyArray = idJsonData.keypair;
  
      // Convert the hexadecimal string to Uint8Array (private key)
      const privateKeyUint8Array = new Uint8Array(privateKeyArray);
      const senderAccount = Keypair.fromSecretKey(privateKeyUint8Array)
  
   
      // Create the keypair using the private key
      const mintAuthority = Keypair.fromSecretKey(privateKeyUint8Array);
  
      // Replace with the public key of the account owner (use your own public key)
    const ownerPublicKey = new PublicKey('6KJvRrPS34MgvytVzug43VBMLFairSwYYf3a1tk4TcLQ');

    // Create a new token account
    const tokenAccount = await createTokenAccount(connection, ownerPublicKey);
    console.log('Token Account:', tokenAccount.toBase58());

    // Create a custom token (mint)
    const token = await createMint(connection, ownerPublicKey, mintAuthority);
    console.log('Custom Token (Mint):', token.toBase58());

    // Mint tokens
    const amountToMint = 10; // Number of tokens to mint
    await mintTokens(connection, token, mintAuthority, tokenAccount, amountToMint);

    // Replace with the destination public key for the token transfer
    const destinationPublicKey = new PublicKey('7w8rXf59Z6ddiV1D9SE9X1gcP6U7U5cLUMXT6aVzQf1Q');
    const amountToSend = 1; // Number of tokens to transfer
    await transferTokens(connection, token, mintAuthority, senderAccount, destinationPublicKey, amountToSend);

  
    } catch (error) {
      console.error('Error:', error);
    }
  }

// Execute the main function
main();