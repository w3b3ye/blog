var blog = artifacts.require("./blog.sol");

module.exports = function (deployer) {
    deployer.deploy(blog);
};