function Account(number, rawAccountText) {
  this.number = number;
  this.rawAccountText = rawAccountText;
}

Account.RAW_TO_VALUE = {};
Account.RAW_TO_VALUE[
  " _ " +
  "| |" +
  "|_|"
] = "0";
Account.RAW_TO_VALUE[
  "   " +
  "  |" +
  "  |"
] = "1";
Account.RAW_TO_VALUE[
  " _ " +
  " _|" +
  "|_ "
] = "2";
Account.RAW_TO_VALUE[
  " _ " +
  " _|" +
  " _|"
] = "3";
Account.RAW_TO_VALUE[
  "   " +
  "|_|" +
  "  |"
] = "4";
Account.RAW_TO_VALUE[
  " _ " +
  "|_ " +
  " _|"
] = "5";
Account.RAW_TO_VALUE[
  " _ " +
  "|_ " +
  "|_|"
] = "6";
Account.RAW_TO_VALUE[
  " _ " +
  "  |" +
  "  |"
] = "7";
Account.RAW_TO_VALUE[
  " _ " +
  "|_|" +
  "|_|"
] = "8";
Account.RAW_TO_VALUE[
  " _ " +
  "|_|" +
  " _|"
] = "9";

Account.VALUE_TO_RAW = {}
Object.keys(Account.RAW_TO_VALUE).forEach(
  function(raw) {
    Account.VALUE_TO_RAW[Account.RAW_TO_VALUE[raw]] = raw;
  }
);

let RAW_CHARACTER_WIDTH = 3;

Account.parse = function(rawAccountText){
  let parsedAccount = "";
  for (let digitPlace = 0; digitPlace < 9; digitPlace++) {
    parsedAccount += Account.RAW_TO_VALUE[extractRawDigit(digitPlace, rawAccountText)] || "?"
  }

  return new Account(parsedAccount, rawAccountText);
}

Account.alternateDigits = function(incommingRawDigit) {
  let alternates = [];
  Object.keys(Account.RAW_TO_VALUE).forEach(function(rawDigit) {
    let diffCount = 0;
    for(let i = 0; i < rawDigit.length; i++) {
      if(incommingRawDigit.substr(i, 1) != rawDigit.substr(i, 1)) {
        diffCount++;
      }
      if(diffCount > 1) {
        break;
      }
    }
    if(diffCount === 1) {
      alternates.push(Account.RAW_TO_VALUE[rawDigit]);
    }
  });
  return alternates;
}

Account.prototype.isLegible = function() {
  return this.number.indexOf("?") < 0;
}

Account.prototype.isValid = function() {
  if(!this.isLegible()) { return false; }

  let sum = this.number.split('').reduce(
    function(previous,current,index) {
      return (9 - index) * current + previous;
    }, 0);
  return (sum % 11) === 0;
}

Account.prototype.format = function() {
  let suffix = "";
  if(!this.isLegible()) {
    suffix = " ILL";
  } else if(!this.isValid()) {
    suffix = " ERR";
  }
  return this.number + suffix;
}

Account.prototype.rawDigit = function(position) {
  return extractRawDigit(position, this.rawAccountText);
}

Account.prototype.alternates = function() {
  let alternates = [];
  if(this.isValid()) { return alternates; }

  for(let currentPos = 0; currentPos <= 9; currentPos++) {
    let altDigits = Account.alternateDigits(extractRawDigit(currentPos, this.rawAccountText));
    altDigits.forEach(function (altDigit) {
      let accountNum = this.number.substr(0, currentPos) + altDigit + this.number.substr(currentPos + 1);
      let possibleAccount = new Account(accountNum);
      if(possibleAccount.isValid()) {
        alternates.push(possibleAccount.number);
      }
    }, this);
  }
  return alternates;
}

function extractRawDigit(position, accountText) {
  let accountLines = accountText.split("\n");
  let extractedRawDigit = "";
  [0,1,2].forEach(function(lineNum) {
     let start = position * RAW_CHARACTER_WIDTH;
     let end = (position + 1) * RAW_CHARACTER_WIDTH;
     extractedRawDigit += accountLines[lineNum].slice(start, end);
  });

  return extractedRawDigit;
};

function prettyRawDigit(rawDigit) {
  return [rawDigit.slice(0, 3), rawDigit.slice(3, 6), rawDigit.slice(6, 9)].join("\n");
}

module.exports = Account;
