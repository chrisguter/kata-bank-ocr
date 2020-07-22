let Account = require("./account.js");

let RAW_ACCOUNT_LINE_HEIGHT = 4;

function AccountsReader(fileData) {
  this.fileData = fileData;
}

AccountsReader.prototype.accounts = function() {
  let inputLines = this.fileData.split("\n");
  let recordBuffer = [];
  let accounts = [];

  inputLines.forEach(function(inputLine) {
    recordBuffer.push(inputLine);
    if (recordBuffer.length === RAW_ACCOUNT_LINE_HEIGHT) {
      accounts.push(Account.parse(recordBuffer.join("\n")));
      recordBuffer = [];
    }
  });

  return accounts;
};

module.exports = AccountsReader;
