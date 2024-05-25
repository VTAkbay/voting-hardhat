// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool registered;
        bool voted;
        uint voteIndex;
    }

    address public admin;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    event VoteCast(address indexed voter, uint indexed candidateId);
    event VoterRegistered(address indexed voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender].voted, "You have already voted");
        _;
    }

    modifier isRegistered() {
        require(voters[msg.sender].registered, "Voter is not registered");
        _;
    }

    constructor(string[] memory candidateNames) {
        admin = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(
                Candidate({id: i, name: candidateNames[i], voteCount: 0})
            );
        }
    }

    function registerVoter(address voter) public onlyAdmin {
        require(!voters[voter].registered, "Voter is already registered");
        voters[voter].registered = true;
        emit VoterRegistered(voter);
    }

    function vote(uint candidateId) public hasNotVoted isRegistered {
        require(candidateId < candidates.length, "Invalid candidate ID");

        voters[msg.sender].voted = true;
        voters[msg.sender].voteIndex = candidateId;

        candidates[candidateId].voteCount += 1;

        emit VoteCast(msg.sender, candidateId);
    }

    function getCandidate(
        uint candidateId
    ) public view returns (Candidate memory) {
        require(candidateId < candidates.length, "Invalid candidate ID");
        return candidates[candidateId];
    }

    function getTotalCandidates() public view returns (uint) {
        return candidates.length;
    }
}
