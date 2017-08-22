var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', accounts => {

    var instance;

    beforeEach(() => {
        return Splitter.new().then(thisInstance => {
            instance = thisInstance;
        });
    });

    it("should split funds evenly", () => {
        const sent = 4;
        const half = sent / 2;

        return instance.splitSend(accounts[1], accounts[2], {from: accounts[0], value: sent}).then(txHash => {
            return instance.balances(accounts[1]);
        }).then(balance => {
            assert.equal(balance, half, "account 1's balance is not half of amount sent");
            return instance.balances(accounts[2]);
        }).then(balance => {
            assert.equal(balance, half, "account 2's balance is not half of amount sent");
        });
    });

    it("should should give remainder to sender", () => {
        const sent = 11;
        const half = Math.floor(sent / 2);
        const remainder = 1;

        return instance.splitSend(accounts[1], accounts[2], {from: accounts[0], value: sent}).then(txHash => {
            return instance.balances(accounts[1]);
        }).then(balance => {
            assert.equal(balance, half, "account 1's balance is not half of amount sent");
            return instance.balances(accounts[2]);
        }).then(balance => {
            assert.equal(balance, half, "account 2's balance is not half of amount sent");
            return instance.balances(accounts[0]);
        }).then(balance => {
            assert.equal(balance, remainder, "account 0's balance does is not the remainder of the split");
        });
    });

    it("should handle different senders", () => {
        const sent = 4;
        const half = sent / 2;

        return instance.splitSend(accounts[1], accounts[2], {from: accounts[0], value: sent}).then(txHash => {
            return instance.splitSend(accounts[0], accounts[1], {from: accounts[2], value: sent})
        }).then(txHash => {
            return instance.balances(accounts[0]);
        }).then(balance => {
            assert.equal(balance, half, "account 0's balance is not half of amount sent");
            return instance.balances(accounts[1]);
        }).then(balance => {
            assert.equal(balance, sent, "account 1's balance is not amount sent");
            return instance.balances(accounts[2]);
        }).then(balance => {
            assert.equal(balance, half, "account 2's balance is not half of amount sent");
        });
    });

});
