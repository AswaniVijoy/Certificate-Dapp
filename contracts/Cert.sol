// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Cert {
    address public admin;

    // 🔥 Updated event (hybrid design)
    event Issued(
        uint256 indexed id,          // for fast filtering
        bytes32 indexed courseHash, // for blockchain filtering
        string course,              // for UI display
        string grade                // for UI display
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Access Denied");
        _;
    }

    struct Certificate {
        string name;
        string course;
        string grade;
        string date;
    }

    mapping(uint256 => Certificate) public Certificates;

    function issue(
        uint256 _id,
        string memory _name,
        string memory _course,
        string memory _grade,
        string memory _date
    ) public onlyAdmin {

        Certificates[_id] = Certificate(
            _name,
            _course,
            _grade,
            _date
        );

        // 🔥 Emit with hash for filtering + string for UI
        emit Issued(
            _id,
            keccak256(bytes(_course)),
            _course,
            _grade
        );
    }
}