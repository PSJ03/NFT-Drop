import { client } from "@/app/client";
import { nftDropContract } from "@/app/constants";
import React from "react";
import { readContract } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer } from "thirdweb/react";

export default async function ContractInfo() {
  const contractMetadata = await getContractMetadata({
    contract: nftDropContract,
  });

  const owner = await readContract({
    contract: nftDropContract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const totalMinted = await readContract({
    contract: nftDropContract,
    method: "function totalMinted() view returns (uint256)",
    params: [],
  });

  const nextTokenIdToMint = await readContract({
    contract: nftDropContract,
    method: "function nextTokenIdToMint() view returns (uint256)",
    params: [],
  });

  return (
    <div className="text-gray-800 rounded-md bg-slate-300 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Contract Infomation (Server-Side)
      </h1>
      <MediaRenderer
        client={client}
        src={contractMetadata.image}
        className="rounded-2xl"
      />
      <p>Name: {contractMetadata.name}</p>
      {/* <p>Symbol: {contractMetadata.symbol}</p> */}
      <p>Description: {contractMetadata.description}</p>
      <p>Owner: {owner}</p>

      <p>Total Minted: {totalMinted.toString()}</p>
      <p>Total supply: {nextTokenIdToMint.toString()}</p>
    </div>
  );
}
