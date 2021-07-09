App = {
  web3Provider: null,
  contracts: {},


  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://172.16.0.10:7545');
    }
    // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('blog.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.blog = TruffleContract(data);

      // Set the provider for our contract
      App.contracts.blog.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
      return App.init();

    });

    // return App.bindEvents();
    return App.AddBlogButton();

  },
  init: async function () {
    // Load Products.
    var postInstance;

    App.contracts.blog.deployed().then(function (instance) {
      postInstance = instance;
      return postInstance.blogCount();
    }).then(function (result) {

      var counts = result.c[0];
      console.log("Total Blog : " + counts);

      for (var i = 1; i <= counts; i++) {
        postInstance.blogfeeds(i).then(function (result) {
          console.log("Publisher Address:" + result[0]);
          console.log("Blog:" + result[1]);

          var blogRow = $('#blogRow');
          var postTemplate = $('#postTemplate');

          postTemplate.find('.panel-title').text(result[0]);
          postTemplate.find('.desc').text(result[1]);
          blogRow.append(postTemplate.html());
        });
      }
    });
  },

  AddBlogButton: function () {
    $(document).on('click', '.addBlog', App.AddBlog);
  },

  AddBlog: function (event) {
    var post = document.getElementById('post').value
    var postInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.blog.deployed().then(function (instance) {
        postInstance = instance;
        return postInstance.addblog(post, { from: account });
      })
    });
    console.log("Blog posted");
  },
};
$(function () {
  $(window).load(function () {
    App.initWeb3();
  });
});