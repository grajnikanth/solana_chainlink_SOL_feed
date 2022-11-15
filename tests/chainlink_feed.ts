import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ChainlinkFeed } from "../target/types/chainlink_feed";

const CHAINLINK_FEED = "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
const CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";

describe("chainlink_feed", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.ChainlinkFeed as Program<ChainlinkFeed>;

  it("Gets SOL price from Oracle", async () => {
    const resultAccount = anchor.web3.Keypair.generate();

    await program.methods.getSolPrice()
      .accounts({
        resultAccount: resultAccount.publicKey,
        user: provider.wallet.publicKey,
        SystemProgra: anchor.web3.SystemProgram.programId,
        chainlinkFeed: CHAINLINK_FEED,
        chainlinkProgram: CHAINLINK_PROGRAM_ID
      })
      .signers([resultAccount])
      .rpc();
    
    const latestPrice = await program.account.resultAccount.fetch(resultAccount.publicKey);

    console.log("SOL price at current moment is ", latestPrice.value/100000000);



  });
});
