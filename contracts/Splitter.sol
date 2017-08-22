pragma solidity ^0.4.4;

contract Splitter {
    mapping (address => uint) public balances;

    function splitSend(address recipient1, address recipient2)
        public
        payable
        returns(bool success) {

        require(msg.value > 0);

        uint half = msg.value / 2;

        balances[recipient1] += half;
        balances[recipient2] += half;

        if (msg.value % 2 == 1) {
            balances[msg.sender] += 1;
        }

        return true;
    }

    function withdraw()
        public
        returns(bool success) {

        uint amt = balances[msg.sender];

        require(amt > 0);

        balances[msg.sender] = 0;
        msg.sender.transfer(amt);

        return true;
    }
}
