function Person(
  firstName,
  lastName,
  dobDay,
  dobMonth,
  dobYear,
  email,
  telephone,
  partner,
  statePension,
  statePensionAmount,
  statePensionFrequency,
  privatePension,
  privatePensionAmount,
  employmentPension,
  employmentPensionAmount,
  warPension,
  warWidowPension,
  savingsCredit,
  savings,
  disabilityLivingAllowance,
  attendanceAllowance,
  childTaxCredits,
  homeOwner,
  tennant,
  guest,
  othersAtHome,
  fullName,
  bankAccount,
  premiumBonds,
  contactPref
) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.dobDay = dobDay,
  this.dobMonth = dobMonth,
  this.dobYear = dobYear,
  this.email = email;
  this.telephone = telephone;
  this.partner = partner;
  this.statePension = statePension;
  this.statePensionFrequency = statePensionFrequency;
  this.statePensionAmount = statePensionAmount;
  this.privatePensionAmount = privatePensionAmount;
  this.employmentPension = employmentPension;
  this.employmentPensionAmount = employmentPensionAmount;
  this.warPension = warPension;
  this.warWidowPension = warWidowPension;
  this.savingsCredit = savingsCredit;
  this.savings = savings;
  this.disabilityLivingAllowance = disabilityLivingAllowance;
  this.attendanceAllowance = attendanceAllowance;
  this.childTaxCredits = childTaxCredits;
  this.homeOwner = homeOwner;
  this.tennant = tennant;
  this.guest = guest;
  this.othersAtHome = othersAtHome;
  this.bankAccount = bankAccount;
  this.premiumBonds = premiumBonds;
  this.contactPref = contactPref;
}

var i,
  benefit,
  firstBenefit,
  savingsType;

Person.prototype.pensionChecker = function (pensionsList) {
  for (i = 0; i < pensionsList.length; i += 1) {
    console.log(pensionsList[i]);
    if (pensionsList[i] === 'state') {
      this.statePension = true;
    } else if (pensionsList[i] === 'private') {
      this.privatePension = true;
    } else if (pensionsList[i] === 'employment') {
      this.employmentPension = true;
    } else if (pensionsList[i] === 'wardisablement') {
      this.warPension = true;
    } else if (pensionsList[i] === 'warwidow') {
      this.warWidowPension = true;
    }
  }
};

Person.prototype.fullName = function () {
  return this.firstName + " " + this.lastName;
};

Person.prototype.printPerson = function () {
  console.log(
    this.firstName + "\n" +
      "statePension = " + this.statePension + " \n" +
      "privatePension = " + this.privatePension + " \n" +
      "employmentPension = " + this.employmentPension + " \n" +
      "warPension = " + this.warPension + " \n" +
      "warWidowPension = " + this.warWidowPension + " \n" +
      "disabilityLivingAllowance = " + this.disabilityLivingAllowance + " \n" +
      "child tax credits = " + this.childTaxCredits + " \n" +
      "attendanceAllowance = " + this.attendanceAllowance + "\n" +
      "partner = " + this.partner + "\n"
  );
};

Person.prototype.resetBenefits = function () {
  this.disabilityLivingAllowance = false;
  this.attendanceAllowance = false;
  this.personalIndependence = false;
  this.childTaxCredits = false;
  console.log('resetting benefits...');
};

Person.prototype.resetVars = function () {
  this.firstName = null;
  this.lastName = null;
  this.dobDay = null;
  this.dobMonth = null;
  this.dobYear = null;
  this.email = null;
  this.telephone = null;
  this.contactPref = null;
  console.log('resetting vars...');
};

Person.prototype.resetLivingSituation = function () {
  this.homeOwner = false;
  this.tennant = false;
  this.guest = false;
  console.log('resetting living situation...');
};

Person.prototype.resetAccounts = function () {
  this.savings = false;
  this.premiumBonds = false;
  console.log('resetting bank accounts...');
};

Person.prototype.resetPartner = function () {
  this.partner = true;
  console.log('resetting partner status...');
};

Person.prototype.resetPension = function () {
  this.statePension = false;
  this.statePensionAmount = null;
  this.statePensionFrequency = null;
  this.privatePension = false;
  this.employmentPension = false;
  this.warPension = false;
  this.warWidowPension = false;
  console.log('resetting pensions...');
};

Person.prototype.benefitChecker = function (benefits) {
  if (typeof benefits === "string") {
    //if (benefits === "aa") {
    //  this.attendanceAllowance = true;
    //  console.log("aa");
    //  return "aa";
    //} else if (benefits === "ctc") {
    //  this.childTaxCredits = true;
    //  console.log("ctc");
    //  return "ctc";
    //} else 
    if (benefits === "dla") {
      this.disabilityLivingAllowance = true;
      console.log("dla");
      return "dla";
    } else if (benefits === "pip") {
      this.personalIndependence = true;
      console.log("pip");
      return "pip";
    } else {
      console.log("none");
      return "none";
    }
  } else if (typeof benefits === "object") {
    firstBenefit = null;
    for (i = 0; i < benefits.length; i += 1) {
      //if (benefits[i] === 'aa') {
      //  this.attendanceAllowance = true;
      //  console.log("aa");
      //  if (firstBenefit === null) {
      //    firstBenefit = "aa";
      // }
      //} else if (benefits[i] === 'ctc') {
      //  this.childTaxCredits = true;
      //  console.log("ctc");
      //  if (firstBenefit === null) {
      //    firstBenefit =  "ctc";
      //  }
      //} else 
      if (benefits[i] === 'dla') {
        this.disabilityLivingAllowance = true;
        console.log("dla");
        if (firstBenefit === null) {
          firstBenefit =  "dla";
        }
      } else if (benefits[i] === 'pip') {
        this.personalIndependence = true;
        console.log("pip");
        if (firstBenefit === null) {
          firstBenefit = "pip";
        }
      } else if (benefits[i] === 'none') {
        console.log("none");
        if (firstBenefit === null) {
          firstBenefit = "none";
        }
      }
    }
    return firstBenefit;
  }
};

Person.prototype.savingChecker = function (savings) {
  if (typeof savings === "string") {
    if (savings === "bank") {
      this.bankAccount = true;
      return "bank";
    } else if (savings === "pb") {
      this.premiumBonds = true;
      return "pb";
    } else {
      return "none";
    }
  } else if (typeof savings === "object") {
    var firstSaving = null;
    for (i = 0; i < savings.length; i += 1) {
      if (savings[i] === 'bank') {
        this.bankAccount = true;
        if (firstSaving === null) {
          firstSaving = "bank";
        }
      } else if (savings[i] === 'pb') {
        this.premiumBonds = true;
        if (firstSaving === null) {
          firstSaving =  "pb";
        }
      } else if (savings[i] === 'none') {
        if (firstSaving === null) {
          firstSaving = "none";
        }
      }
    }
    return firstSaving;
  }
};

function createPerson() {
  return new Person();
}

module.exports.createPerson = createPerson;