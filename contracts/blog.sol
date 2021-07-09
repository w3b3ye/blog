// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.7.4;

contract blog {
    struct blogfeed {
        address publisher;
        string blogdesc;
    }

    mapping(uint256 => blogfeed) public blogfeeds;
    uint256 public blogcount;

    function addblog(string memory blogdesc) public {
        blogcount++;
        blogfeeds[blogcount].publisher = msg.sender;
        blogfeeds[blogcount].blogdesc = blogdesc;
    }
}
