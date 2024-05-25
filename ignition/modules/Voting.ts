import { ethers } from "hardhat";

async function main() {
  const candidateNames = ["Alice", "Bob", "Charlie"];
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames);

  await voting.deployed();

  console.log(`Voting contract deployed to: ${voting.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
