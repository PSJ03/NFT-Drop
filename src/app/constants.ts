import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

export const nftDropAddress = "0xD5139fA48D47c10d3acA2ccBb4Ba108fF337925f";

export const nftDropContract = getContract({
  client: client,
  chain: sepolia,
  address: nftDropAddress,
});
