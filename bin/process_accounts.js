(function() {
  let AccountsReader = require("../accounts_reader.js");
  let fs = require('fs');

  let inputFile = process.argv[2];

  fs.readFile(inputFile, 'utf8', function(err, data){
    if (err) {
      console.error("Could not open file %s: %s", inputFile, err);
      process.exit(1);
    }
    let reader = new AccountsReader(data);
    let formattedAccounts = reader.accounts().map(function(act){ return act.format(); });
    console.log(formattedAccounts.join("\n"));
  });
}());
