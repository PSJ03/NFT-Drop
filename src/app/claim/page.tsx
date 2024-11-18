"use client";

import { client } from "@/app/client";
import { nftDropContract } from "@/app/constants";
import React, { useState } from "react";
import { toEther } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import {
  claimTo,
  getActiveClaimCondition,
  getTotalClaimedSupply,
  nextTokenIdToMint,
} from "thirdweb/extensions/erc721";
import {
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

export default function NFTDrop() {
  const [quantity, setQuantity] = useState(1);
  const account = useActiveAccount();

  // Metadata 읽어오기
  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useReadContract(getContractMetadata, { contract: nftDropContract });

  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } =
    useReadContract(getTotalClaimedSupply, { contract: nftDropContract });

  const { data: totalNFTSupply, isLoading: isTotalNFTSupplyLoading } =
    useReadContract(nextTokenIdToMint, {
      contract: nftDropContract,
    });

  const { data: claimCondition } = useReadContract(getActiveClaimCondition, {
    contract: nftDropContract,
  });

  const getPrice = (quantity: number) => {
    const total =
      quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="text-3xl font-bold mb-4">ClaimNFT</h1>
      {isContractMetadataLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <MediaRenderer
            client={client}
            src={contractMetadata?.image}
            className="rounded-xl"
          />
          <h2 className="text-2xl font-bold mt-4">{contractMetadata?.name}</h2>
          <p className="text-lg mt-2">{contractMetadata?.description}</p>
        </>
      )}

      {isClaimedSupplyLoading || isTotalNFTSupplyLoading ? (
        <p>Loading...</p>
      ) : (
        <p className="text-lg mt-2 font-bold">
          Total NFT Supply: {claimedSupply?.toString()}/
          {totalNFTSupply?.toString()}
        </p>
      )}
      <div className="flex flex-row items-center justify-center my-4 ">
        <button
          className="text-lg px-4 py-2 rounded-md mx-4 bg-slate-300"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-20 text-lg text-center border border-gray-300 rounded-md"
        />
        <button
          className="text-lg px-4 py-2 rounded-md mx-4 bg-slate-300"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
      <TransactionButton
        transaction={() =>
          claimTo({
            contract: nftDropContract,
            to: account?.address || "",
            quantity: BigInt(quantity),
          })
        }
        onTransactionConfirmed={async () => {
          alert("NFT claimed!");
          setQuantity(1);
        }}
      >
        {`Claim NFT (${getPrice(quantity)} ETH)`}
      </TransactionButton>
    </div>
  );
}
