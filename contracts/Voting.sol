// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// @title Voting Contract
// @notice This contract allows for a decentralized voting process.
contract Voting {
    // Represents a candidate in the election
    struct Candidate {
        uint id; // Unique identifier for the candidate
        string name; // Name of the candidate
        uint voteCount; // Total number of votes the candidate has received
    }

    // Represents a voter in the election
    struct Voter {
        bool registered; // Indicates if the voter is registered
        bool voted; // Indicates if the voter has already voted
        uint voteIndex; // Index of the candidate that the voter voted for
    }

    // Address of the admin who has special privileges
    address public admin;
    // Mapping of voter's address to their Voter struct
    mapping(address => Voter) public voters;
    // Dynamic array containing all candidates
    Candidate[] public candidates;

    // Event emitted when a vote is cast
    event VoteCast(address indexed voter, uint indexed candidateId);
    // Event emitted when a voter is registered
    event VoterRegistered(address indexed voter);

    // Modifier to restrict function calls to only the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Modifier to prevent someone from voting more than once
    modifier hasNotVoted() {
        require(!voters[msg.sender].voted, "You have already voted");
        _;
    }

    // Modifier to ensure that only registered voters can vote
    modifier isRegistered() {
        require(voters[msg.sender].registered, "Voter is not registered");
        _;
    }

    // @notice Constructor to initialize the contract with a list of candidate names
    // @param candidateNames An array of candidate names to initialize the candidates
    constructor(string[] memory candidateNames) {
        admin = msg.sender; // Set the contract deployer as the admin
        // Initialize the candidates array with the provided names
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(
                Candidate({id: i, name: candidateNames[i], voteCount: 0})
            );
        }
    }

    // @notice Register a voter
    // @dev Only callable by the admin
    // @param voter The address of the voter to register
    function registerVoter(address voter) public onlyAdmin {
        require(!voters[voter].registered, "Voter is already registered");
        voters[voter].registered = true;
        emit VoterRegistered(voter);
    }

    // @notice Cast a vote for a candidate
    // @dev The function includes checks to ensure the voter is registered and has not already voted
    // @param candidateId The ID of the candidate to vote for
    function vote(uint candidateId) public hasNotVoted isRegistered {
        require(candidateId < candidates.length, "Invalid candidate ID");

        voters[msg.sender].voted = true;
        voters[msg.sender].voteIndex = candidateId;

        candidates[candidateId].voteCount += 1;

        emit VoteCast(msg.sender, candidateId);
    }

    // @notice Retrieve a candidate's information
    // @param candidateId The ID of the candidate
    // @return Candidate The candidate struct with id, name, and voteCount
    function getCandidate(
        uint candidateId
    ) public view returns (Candidate memory) {
        require(candidateId < candidates.length, "Invalid candidate ID");
        return candidates[candidateId];
    }

    // @notice Get the total number of candidates
    // @return uint The total number of candidates
    function getTotalCandidates() public view returns (uint) {
        return candidates.length;
    }
}
