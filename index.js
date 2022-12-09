const web3 = require("@solana/web3.js");
const spl_token = require("@solana/spl-token");
const bs58 = require("bs58");

async function transfer_token() {
  const wallet = web3.Keypair.fromSecretKey(
    bs58.decode(
      "t9BdQhEB7FVwqX3jB2jxvFAxwyTdxEoQwh2huq3kTe2Mqm1WhvZhiQM6pCwikQ5fMMjbKUuvycX4PL2z1JNFs5d"
    )
  ); //token owner wallet
  const lumos_token_address = "kvZPY6ccCnvGVwFziHUqwabijEzAz4vYo9iCKpApddw";
  const new_owner = web3.Keypair.generate(); // sent address ...

  const connection = new web3.Connection(
    web3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  console.log("wallet:", wallet.publicKey.toBase58());

  const assoicated_token_account = await spl_token.getAssociatedTokenAddress(
    new web3.PublicKey(lumos_token_address),
    wallet.publicKey
  );
  console.log("assoicated_token_account:", assoicated_token_account.toBase58());

  const new_assoicated_token_account =
    await spl_token.getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      new web3.PublicKey(lumos_token_address),
      new_owner.publicKey
    );

  console.log(
    "new_assoicated_token_account:",
    new_assoicated_token_account.address.toBase58()
  );

  let txhash = await spl_token.transferChecked(
    connection, // connection
    wallet, // payer
    assoicated_token_account, // from (should be a token account)
    new web3.PublicKey(lumos_token_address), // mint
    new_assoicated_token_account.address, // to (should be a token account)
    wallet, // from's owner
    1e4, // amount, if your deciamls is 8, send 10^8 for 1 token
    4 // decimals
  );
  console.log(`txhash: ${txhash}`);
}

transfer_token();
