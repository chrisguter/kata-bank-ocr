let Account = require("../account.js");

let assert = require("assert");

describe("Account.parse", function() {
  it("parses all zeros", function() {
    let zerosRaw =
      " _  _  _  _  _  _  _  _  _ \n" +
      "| || || || || || || || || |\n" +
      "|_||_||_||_||_||_||_||_||_|\n" +
      "                           \n";
    assert.equal(Account.parse(zerosRaw).number, "000000000");
  });

  it("parses all ones", function(){
    let onesRaw =
      "                           \n" +
      "  |  |  |  |  |  |  |  |  |\n" +
      "  |  |  |  |  |  |  |  |  |\n" +
      "                           \n";
    assert.equal(Account.parse(onesRaw).number, "111111111");
  });

  it("parses one through nine", function() {
    let raw =
      "    _  _     _  _  _  _  _ \n" +
      "  | _| _||_||_ |_   ||_||_|\n" +
      "  ||_  _|  | _||_|  ||_| _|\n" +
      "                           \n";
    assert.equal(Account.parse(raw).number, "123456789");
  });

  describe("illegibility", function() {
    let illegibleRaw =
      "    _  _  _  _  _  _  _  _ \n" +
      "| || || || || || || || || |\n" +
      "|_||_|| ||_||_||_||_||_||_|\n" +
      "                           \n";
    let act = Account.parse(illegibleRaw);

    it("replaces illegible digits with question marks", function() {
      assert.equal(act.number, "?0?000000");
    });

    it("is not legible", function() {
      assert.ok(!act.isLegible());
    });

    it("is not valid", function() {
      assert.ok(!act.isValid());
    });
  });
});

describe("Account.isValid", function() {
  it("all ones is invalid", function() {
    assert.ok(!new Account("111111111").isValid());
  });

  it("345882865 is valid", function() {
    assert.ok(new Account("345882865").isValid());
  });

  it("457508000 is valid and legible", function() {
    let act = new Account("457508000");
    assert.ok(act.isValid());
    assert.ok(act.isLegible());
  });
});

describe("Account.format", function() {
  it("passes through a valid account", function() {
    let actString = "345882865";
    assert.equal(new Account(actString).format(), actString);
  });

  it("adds ILL to an illegible account", function() {
    assert.equal(new Account("?00000000").format(), "?00000000 ILL");
  });

  it("adds ERR to an invalid account", function() {
    assert.equal(new Account("664371495").format(), "664371495 ERR");
  });
});

describe("Account.rawDigit", function() {
  it("extracts the original raw digit", function() {
    let raw =
      "    _  _     _  _  _  _  _ \n" +
      "  | _| _||_||_ |_   ||_||_|\n" +
      "  ||_  _|  | _||_|  ||_| _|\n" +
      "                           \n";
    let act = Account.parse(raw);
    assert.equal(act.rawDigit(2), Account.VALUE_TO_RAW["3"]);
  });
});

describe("Account.alternateDigits", function() {
  it("provides alternates for one", function() {
    assert.deepEqual(Account.alternateDigits(Account.VALUE_TO_RAW["1"]), ["7"]);
  });

  it("provides alternates for one", function() {
    assert.deepEqual(Account.alternateDigits(
      "   " +
      " _|" +
      "  |" +
      "   "), ["1", "4"]);
  });
});

describe("Account.alternates", function() {
  it("all eights", function() {
    let raw =
     " _  _  _  _  _  _  _  _  _ \n" +
     "|_||_||_||_||_||_||_||_||_|\n" +
     "|_||_||_||_||_||_||_||_||_|\n" +
     "                           \n";
    assert.deepEqual(Account.parse(raw).alternates(), ['888886888', '888888988', '888888880']);
  });
});

