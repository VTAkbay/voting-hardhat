import { expect } from "chai";
import { ethers } from "hardhat";

describe("Voting", function () {
  let admin: any;
  let voter1: any;
  let voter2: any;
  let voting: any;
  const candidateNames = ["Alice", "Bob", "Charlie"];

  beforeEach(async function () {
    [admin, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(candidateNames);

    await voting.deployed();
  });

  it("Should deploy the contract and initialize candidates correctly", async function () {
    expect(await voting.getTotalCandidates()).to.equal(candidateNames.length);

    for (let i = 0; i < candidateNames.length; i++) {
      const candidate = await voting.getCandidate(i);
      expect(candidate.id).to.equal(i);
      expect(candidate.name).to.equal(candidateNames[i]);
      expect(candidate.voteCount).to.equal(0);
    }
  });

  it("Should allow the admin to register voters", async function () {
    await voting.registerVoter(voter1.address);
    const voter = await voting.voters(voter1.address);
    expect(voter.registered).to.be.true;
  });

  it("Should not allow non-admins to register voters", async function () {
    await expect(
      voting.connect(voter1).registerVoter(voter2.address)
    ).to.be.revertedWith("Only admin can call this function");
  });

  it("Should prevent registering a voter multiple times", async function () {
    await voting.registerVoter(voter1.address);
    await expect(voting.registerVoter(voter1.address)).to.be.revertedWith(
      "Voter is already registered"
    );
  });

  it("Should allow voting and update vote counts correctly", async function () {
    await voting.registerVoter(voter1.address);
    await voting.registerVoter(voter2.address);

    await voting.connect(voter1).vote(0);

    let candidate0 = await voting.getCandidate(0);
    expect(candidate0.voteCount).to.equal(1);

    await voting.connect(voter2).vote(1);

    candidate0 = await voting.getCandidate(0);
    const candidate1 = await voting.getCandidate(1);

    expect(candidate0.voteCount).to.equal(1);
    expect(candidate1.voteCount).to.equal(1);
  });

  it("Should prevent double voting", async function () {
    await voting.registerVoter(voter1.address);

    await voting.connect(voter1).vote(0);

    await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
      "You have already voted"
    );
  });

  it("Should revert on invalid candidate ID", async function () {
    await voting.registerVoter(voter1.address);
    await expect(voting.connect(voter1).vote(999)).to.be.revertedWith(
      "Invalid candidate ID"
    );
  });

  it("Should emit a VoteCast event when a vote is cast", async function () {
    await voting.registerVoter(voter1.address);
    await expect(voting.connect(voter1).vote(0))
      .to.emit(voting, "VoteCast")
      .withArgs(0);
  });

  it("Should allow the admin to initialize the contract", async function () {
    expect(await voting.admin()).to.equal(admin.address);
  });

  it("Should not allow voting without registering voters", async function () {
    await expect(voting.connect(admin).vote(0)).to.be.revertedWith(
      "Voter is not registered"
    );
  });

  it("Should not allow voting if the candidate ID is invalid", async function () {
    await voting.registerVoter(voter1.address);
    await expect(
      voting.connect(voter1).vote(candidateNames.length)
    ).to.be.revertedWith("Invalid candidate ID");
  });

  it("Should handle multiple votes and update counts accurately", async function () {
    await voting.registerVoter(voter1.address);
    await voting.registerVoter(voter2.address);

    await voting.connect(voter1).vote(0);
    await voting.connect(voter2).vote(0);

    const candidate0 = await voting.getCandidate(0);
    expect(candidate0.voteCount).to.equal(2);

    const candidate1 = await voting.getCandidate(1);
    const candidate2 = await voting.getCandidate(2);

    expect(candidate1.voteCount).to.equal(0);
    expect(candidate2.voteCount).to.equal(0);
  });

  it("Should handle zero candidates case", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const emptyVoting = await Voting.deploy([]);

    await emptyVoting.deployed();

    expect(await emptyVoting.getTotalCandidates()).to.equal(0);
  });
});
