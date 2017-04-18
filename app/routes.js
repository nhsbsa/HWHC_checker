var querystring = require('querystring');

//import the person constructor
var person = require("./person.js");

//create an applicant
var applicant = person.createPerson(
  this.age = undefined,
  this.need = undefined,
  this.country = "england",
  this.education = undefined,
  this.namedOnTaxCredits = undefined,
  this.claimsTaxCredits = false,
  this.incomeSupport = false,
  this.isPregnant = false,
  this.hasMatexCard = false,
  this.hasMedexCard = false,
  this.hasHealthCondition = false
);

var thisYear = 2016;
var parentTc = false;
var pregnancy = false;
var medicalEx = false;
var warPension = false;

var variText = {
    sightText : "sight test",
    setSightText : function() {
      if(applicant.country === "scotland") {
        this.sightText = "eye exam";
      }
    }
};


//partner question variable
 var setPartnerText = function (partner) {
    if (applicant.partner === false) {
      partnerBothText = 'you';
      partnerCommaText = 'you';
      partnerOrText = 'you';
      partnerAndText = 'you';
      partnerAndTextDo = 'Do you';
      partnersText = 'your';
      partnersAndText = "your";
      parentText = "Does your parent or guardian";
      iWe = 'I';
      jointOrText = 'your';
      combinedOrText = 'your';
      partnerPlustext = 'your';
      singleJointUC = 'Was your take-home pay for your last Universal Credit period £935 or less?';
      parentUC = 'Was your take-home pay for your last Universal Credit period £935 or less?';
    } else {
      partnerBothText = 'you, your partner or both of you';
      partnerCommaText = 'you, your partner';
      partnerOrText = 'you or your partner';
      partnerAndText = 'you and your partner';
      partnerAndTextDo = 'Do you and your partner';
      partnersText = "your or your partner's";
      partnersAndText = "your and your partner's";
      parentText = "Does your parent or guardian";
      parentOrText = "your or your parents";
      iWe = 'we';
      jointOrText = 'your joint';
      combinedOrText = "your and your partner's combined";
      partnerPlustext = "yours plus your partner's";
      singleJointUC = 'Did you and your partner have a combined take-home pay of £935 or less in your last Universal Credit period?';
      parentUC = 'Did you and your partner have a combined take-home pay of £935 or less in your last Universal Credit period?';
    }
  };

var querystring = require('querystring');

module.exports = {
  bind : function (app) {
    function find_gp_practice(slug) {
      return app.locals.gp_practices.filter(
        function(p) {
          return p.slug === slug;
        }
      )[0];
    }
    
    
    app.get('/', function (req, res) {
      res.render('index');
    });

    app.get('/examples/template-data', function (req, res) {
      res.render('examples/template-data', { 'name' : 'Foo' });
    });

    app.get('/diabetes-content*', function (req, res) {
      res.redirect('/type-2-diabetes' + req.params[0]);
    });

    // add your routes here


    
    //foogle search
    app.get(/go-handler/, function (req, res) {
      var term = req.query.search;
      if(term === 'LIS' || term === 'low income scheme' || term === 'HC2' || term === 'hc2') {
        res.render('sprints/b6/google/prescription-result', {
          term : term
        });
        console.log(term);
      } else {
        res.render('sprints/b6/google/result', {
          term : term
        });
      }
    });




          // partner handler v2
    app.get(/p2-handler/, function (req, res) {
      sprint = req.url.charAt(5);
      if (req.query.partner === 'yes') {
        applicant.partner = true;
        //aboutPartnerStatus = "Started";
        //aboutPartnerLink = continueText;
      } else if (req.query.partner === 'no') {
        applicant.partner = false;
        //aboutPartnerStatus = completedText;
        //aboutPartnerLink = changeText;
      }
      setPartnerText(applicant.partner);
        if(applicant.age >= 20) {
          res.render('sprints/b4/tax-credits-over20', {
            'partnerortext' : partnerOrText,
              'iwe' : iWe
            });
        } else {
            res.render('sprints/b4/tax-credits-under20', {
                'partnerortext' : partnerOrText,
                'iwe' : iWe
            });
        }
    });
    
    

    //condition clearer
    app.get('sprints/8/condition', function (req, res) {
        applicant.need = null;
        console.log(applicant.condition);
    });

    //treatment type router
    app.get(/treatment-handler/, function (req, res) {
      applicant.need = req.query.condition;
      if (applicant.need === 'prescription') {
        res.redirect('../country_v2');
      } else if (applicant.need === 'dental') {
        res.redirect('../country_v2');
      }
    });

    
//    // eu handler
//      app.get(/uk-handler/, function (req, res) {
//      var sprint = req.url.charAt(9);
//      if (req.query.nationality === 'uk') {
//        res.render('sprints/'+ sprint +'/country_v2');
//      } else {
//        res.render('sprints/'+ sprint +'/country-info');
//      }
//    });

    // dob-handler
    app.get(/dob-handler/, function (req, res) {
      applicant.age = (thisYear - req.query.dobyear);
      console.log(applicant.age);
      if (applicant.age >= 60 && applicant.need === 'prescription') {
        res.redirect('../results/prescription-over60');
      } else if (applicant.age >= 60 && applicant.need === 'dental' && applicant.country === 'england') {
        res.redirect('../tax-credits-exemption');
      //} if (applicant.age >= 60 && applicant.need === 'dental' && applicant.country === 'wales') {
      //  res.redirect('../tax-credits');
      //} if (applicant.age >= 60 && applicant.need === 'dental' && applicant.country === 'scotland') {
      //  res.redirect('../tax-credits');
      } else if (applicant.age >= 19) {
        res.redirect('../tax-credits-19yo');
      } else if (applicant.age  > 15) {
        res.redirect('../full-time-education');
      } else {
        res.redirect('../full-exemption-under-16');
      }
    });

    // dob-2-handler
    app.get(/dateofbirth-handler/, function (req, res) {
      applicant.age = (thisYear - req.query.dobyearBeta);
      console.log(applicant.age);
      if (applicant.age >= 20) {
        setPartnerText(applicant.partner);
        res.render('sprints/b4/partner', {
            'iwe' : iWe
        });
      } else if (applicant.age == 19) {
        res.redirect('../partner');
      } else if (applicant.age >= 16) {
        res.redirect('../full-time-education');
      } else if (applicant.age <= 15) {
        res.redirect('../results/full-exemption-under-16');
      }
    });

            // country-handler with scotland and wales added
      app.get(/country-b4-handler/, function (req, res) {
      if (req.query.countryBeta  === 'englandBeta'&& req.query.gp === 'no'){
        res.redirect('../date-of-birth');
      } else if (req.query.countryBeta  === 'englandBeta'&& req.query.gp === 'yes'){
        res.redirect('../date-of-birth');
      } else if (req.query.countryBeta  === 'scotlandBeta') {
        applicant.country = "scotland";
        res.render('sprints/b4/date-of-birth', {
            sightText : variText.sightText
        });
      } else if (req.query.countryBeta  === 'walesBeta') {
        res.redirect('../date-of-birth');
      } else {
        res.redirect('../results/country-kickout-ni');
      }
    });
                  // country-handler in sprint B4
//      app.get(/country-b4-handler/, function (req, res) {
//      if (req.query.countryBeta  === 'englandBeta'&& req.query.gp === 'no'){
//        res.redirect('../date-of-birth');
//      } else if (req.query.countryBeta  === 'englandBeta'&& req.query.gp === 'yes'){
//        res.redirect('../results/prescription-eng');
//      } else if (req.query.countryBeta  === 'scotlandBeta') {
//        res.render('sprints/b4/results/country-kickout-scot', {
//            sightText : variText.sightText
//        });
//      } else if (req.query.countryBeta  === 'walesBeta') {
//        res.redirect('../results/country-kickout-wales');
//      } else {
//        res.redirect('../results/country-kickout-ni');
//      }
//    });


      // country-handler in sprint B2
      app.get(/country-2-handler/, function (req, res) {
      if (req.query.countryBeta  === 'englandBeta'){
        res.redirect('../border-gp');
      } else if (req.query.countryBeta  === 'scotlandBeta') {
        res.redirect('../results/prescription-scot');
      } else if (req.query.countryBeta  === 'walesBeta') {
        res.redirect('../results/prescription-wales');
      } else {
        res.redirect('../results/ni-kickout');
      }
    });
      
    // country router sprint 8 and B1
      app.get(/country-handler/, function (req, res) {
      applicant.country = req.query.country;
      if (applicant.country === 'england' && applicant.need === 'prescription') {
        res.redirect('../border-gp');
      } else if (applicant.country === 'england' && applicant.need === 'dental') { 
        res.redirect('../date-of-birth');
      } else if (applicant.country === 'wales' && applicant.need === 'prescription') {
        res.redirect('../results/prescription-wales');
      } else if (applicant.country === 'wales' && applicant.need === 'dental') {
        res.redirect('../date-of-birth');
      } else if (applicant.country === 'scotland' && applicant.need === 'prescription') {
        res.redirect('../results/prescription-scot');
      } else if (applicant.country === 'scotland' && applicant.need === 'dental') {
        res.redirect('../results/dental-scot');
      } else if (applicant.country === 'northernIreland') {
        res.redirect('../ni-kickout');
      }
    });


     //wales dental
    app.get(/dental-wales-handler/, function (req, res) {
      if (applicant.age >= 19) { 
        res.redirect('../tax-credits');
      } else if (applicant.age > 15) {
        res.redirect('../full-time-education');
      } else {
        res.redirect('../../date-of-birth');
      }
    });

    // gp router
      app.get(/gp-handler/, function (req, res) {
      if (req.query.gp === 'yes') {
        res.redirect('../results/prescription-eng');
      } else {
        res.redirect('../date-of-birth');
      }
    });


    // full time education handler
      app.get(/fe-handler/, function (req, res) {
      applicant.education = req.query.eligibilityfte;
      if (applicant.education === 'fte' || applicant.education === 'apprenticeship' ) {
        res.redirect('../full-exemption-fte');
      } else {
        res.redirect('../tax-credits-19yo');
      }
    });
          // full time higher education handler
      app.get(/fte-higher-handler/, function (req, res) {
      if (req.query.ftehigher  === 'yes'){
      res.redirect('../results/full-exemption-fte');
      } else {
        res.redirect('../partner');
      }
    });

                      // tax credits exemption card 19yo
      app.get(/tc-card-19yo-handler/, function (req, res) {
      if (req.query.tc19Card  === 'yes'){
        res.redirect('../taxcredit-info-shortcut');
      } else if (req.query.tc19Card  === 'nk') {
        res.redirect('../tax-credits-19yo');
      } else {
        res.redirect('../passported-benefits');
      }
    });

            // tax credits exemption card
      app.get(/tc-card-handler/, function (req, res) {
      if (req.query.tcCard  === 'yes'){
        res.redirect('../taxcredit-info-shortcut');
      } else if (req.query.tcCard  === 'nk') {
        res.redirect('../tax-credits');
      } else {
        res.redirect('../passported-benefits');
      }
    });



    // tax credits claim yes or no under 20
      app.get(/taxcredits-under20/, function (req, res) {
      applicant.namedOnTaxCredits = req.query.taxcredits;
      if (applicant.namedOnTaxCredits === 'yes' || applicant.namedOnTaxCredits === 'nk' ) {
        setPartnerText(applicant.partner);
        res.render('sprints/b4/tax-credits-income', {
        'partnerandtextdo' : partnerAndTextDo
      });
      } else {
        res.redirect('../tax-credits-under20-parents');
      }
    });


          // tax credits claim yes or no under 20
      app.get(/taxcredits-parents/, function (req, res) {
      if (req.query.taxcreditsParents  === 'yes'){
        parentTc = true;
        setPartnerText(applicant.partner);
        res.render('sprints/b4/tax-credits-income', {
        'parenttext' : parentText
      });
      } else {
        parentTc = false;
        res.redirect('../passported-benefits-under20');
      }
    });

          // tax credits claim yes or no
      app.get(/taxcredits-over20/, function (req, res) {
      applicant.namedOnTaxCredits = req.query.taxcredits;
      if (applicant.namedOnTaxCredits === 'yes' || applicant.namedOnTaxCredits === 'nk' ) {
        res.redirect('../tax-credits-income');
      } else {
        res.redirect('../passported-benefits');
      }
    });


    // tax credits income handler
    app.get(/taxcredit-income-handler/, function (req, res) {
        if (applicant.age < 20 ) {
            if (req.query.taxcreditsIncome === 'no') {
                res.redirect('../passported-benefits-under20');
            } else { //yes
                if (parentTc === true) {
                    res.render('sprints/b4/taxcredit-info', {
                    'tctype' : tcType
            });
                } else {
                    setPartnerText(applicant.partner);
                    res.render('sprints/b4/tax-credits-claim-type', {
                        'partnerortext' : partnerOrText
                    });
                }
            }
        } else { //over 20
            if (req.query.taxcreditsIncome === 'no') {
                res.redirect('../passported-benefits');
            } else {
                    res.render('sprints/b4/taxcredit-info', {
                    'tctype' : tcType
            });
            }
          }
    });


//    // tax credits type handler
//      app.get(/taxcredit-type-handler/, function (req, res) {
//        if (applicant.age >= 20) {
//            if (req.query.taxcreditsType ==="wtcctc") {
//              var tcType = 'Working Tax Credit and Child Tax Credit together';
//            } else if (req.query.taxcreditsType ==="ctcdis") {
//              var tcType = 'Working Tax Credit including a disability element';
//            } else if (req.query.taxcreditsType ==="ctc") {
//              var tcType = 'Child Tax Credit';
//            } else if (req.query.taxcreditsType === 'wtc' || req.query.taxcreditsType === 'no') {
//                setPartnerText(applicant.partner);
//                res.render('sprints/b4/passported-benefits', {
//                    'partnerandtext' : partnerAndText
//                });
//            }
//            res.render('sprints/b4/tax-credits-income');
//        } else { //under 20
//            if (req.query.taxcreditsType ==="wtcctc") {
//              var tcType = 'Working Tax Credit and Child Tax Credit together';
//            } else if (req.query.taxcreditsType ==="ctcdis") {
//              var tcType = 'Working Tax Credit including a disability element';
//            } else if (req.query.taxcreditsType ==="ctc") {
//              var tcType = 'Child Tax Credit';
//            } else if (req.query.taxcreditsType === 'wtc' || req.query.taxcreditsType === 'no') {
//                setPartnerText(applicant.partner);
//                res.render('sprints/b4/passported-benefits-under20', {
//                    'partnercommatext' : partnerCommaText
//                });
//            }
//            res.render('sprints/b3/taxcredit-info', {
//                'tctype' : tcType
//            });
//        }
//        });

      //new tax credits type handler
    var tcType;
      app.get(/taxcredit-type-handler/, function (req, res) {
        if (req.query.taxcreditsType ==="wtcctc") {
          tcType = 'Working Tax Credit and Child Tax Credit together';
        } else if (req.query.taxcreditsType ==="ctcdis") {
          tcType = 'Working Tax Credit including a disability element';
        } else if (req.query.taxcreditsType ==="ctc") {
          tcType = 'Child Tax Credit';
        } else {
          tcType = 'none';
          setPartnerText(applicant.partner);
        }
        if (applicant.age >= 20) {
          if (tcType === 'none') {
            res.render('sprints/b4/passported-benefits', {
              'partnerortext' : partnerOrText,
                'iwe' : iWe
            });
          } else {
            res.render('sprints/b4/tax-credits-income', {
                'partnerandtext' : partnerAndText
            });
          }
        } else {
          if (tcType === 'none') {
            setPartnerText(applicant.partner);
            res.render('sprints/b4/passported-benefits-under20', {
              'partnercommatext' : partnerCommaText
            });
          } else {
            res.render('sprints/b4/taxcredit-info', {
              'tctype' : tcType
            });
          }
        }
      });

var benType;
// passported benefits under 20 handler
      app.get(/passportedBen-u20/, function (req, res) {
        if (req.query.benefits ==="incomeSupport") {
          benType = 'Income Support';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="uniCredit") {
          benType = 'Universal Credit';
          setPartnerText(applicant.partner);
          res.render('sprints/b4/uc-claim-type-v2', {
            'bentype' : benType,
            'parenttext' : parentText
      });
        } else if (req.query.benefits ==="jsa") {
          benType = 'income based Job Seekers Allowance (JSA)';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="esa") {
          benType = 'income related Employment and Support Allowance (ESA)';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="penCredit") {
          benType = 'Pension Credit (Guarantee Credit)';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits === 'continue') {
            if (applicant.age > 60) {
                res.redirect('../war-pension');
            } else {
                res.redirect('../pregnancy');
            }
      }
    });
      

    // passported benefits handler
      app.get(/passportedBen-handler/, function (req, res) {
        if (req.query.benefits ==="incomeSupport") {
          benType = 'Income Support';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="uniCredit") {
          benType = 'Universal Credit';
          setPartnerText(applicant.partner);
          res.render('sprints/b4/uc-claim-type-v2', {
            'bentype' : benType,
            'partnerortext' : partnerOrText
      });
        } else if (req.query.benefits ==="jsa") {
          benType = 'income based Job Seekers Allowance (JSA)';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="esa") {
          benType = 'income related Employment and Support Allowance (ESA)';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="penCredit") {
          benType = 'Pension Credit (Guarantee Credit)';
          res.render('sprints/b4/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits === 'continue') {
            if (applicant.age > 60) {
                res.redirect('../war-pension');
            } else {
                res.redirect('../pregnancy');
            }
      }
    });

          // universal credits income handler
      app.get(/uc-type-handler/, function (req, res) {
      if (req.query.ucElement === 'yes') {
        res.redirect('../uc-income-with-element-v3');
      } else {
        res.redirect('../uc-income-without-element-v2');
      }
    });
                // universal credits without element handler (£435)
      app.get(/uc-element-income-handle/, function (req, res) {
      if (req.query.ucelementIncome === 'yes') {
        res.redirect('../results/full-exemption-uc');
            } else {
                res.redirect('../pregnancy');
      }
    });

                      // universal credits with element handler(£935)
            app.get(/uc-without-elements-handler/, function (req, res) {
      if (req.query.ucIncome === 'yes') {
        res.redirect('../results/full-exemption-uc');
      } else {
        res.redirect('../pregnancy');
      }
    });



      app.get(/guarantee-credit-handler/, function (req, res) {
        if (req.query.gcredit ==="yes") {
          var benType = 'Pension Credit Guarantee Credit';
          res.render('sprints/8/full-exemption-benefits', {
            'bentype' : benType
          });
        } else {
        res.redirect('../care-home');
      }
    });

                // pregnancy b4 router
      app.get(/preg-b4handler/, function (req, res) {
      if (req.query.pregnancy === 'yes') {
          pregnancy = true;
      res.redirect('../war-pension');
      } else {
          pregnancy = false;
        res.redirect('../war-pension');
      }
    });

          // pregnancy b2 router
      app.get(/preg-all-handler/, function (req, res) {
      if (req.query.pregnancy === 'yes') {
      res.redirect('../results/all-preg');
      } else {
        res.redirect('../war-pension');
      }
    });

//    // pregnancy router
//      app.get(/preg-handler/, function (req, res) {
//      if (req.query.pregnancy === 'yes') {
//      applicant. = true && applicant.need === 'prescription';
//      res.redirect('../results/prescription-preg');
//      } else {
//        res.redirect('../war-pension');
//      }
//    });

          // war pensioner handler
      app.get(/war-b4handler/, function (req, res) {
      if (req.query.warPension === 'yes') {
        warPension = true;
        res.redirect('../medical-exemption');
      } else {
        warPension = false;
        res.redirect('../medical-exemption');
      }
    });

    // war pensioner handler
      app.get(/war-pension-handler/, function (req, res) {
      if (req.query.warPension === 'yes') {
        res.redirect('../results/prescription-war-pension');
      } else {
        res.redirect('../do-you-have-a-medical-exemption');
      }
    });

    // medex card yes or no router
      app.get(/medex-handler/, function (req, res) {
      if (req.query.medex === 'yes') {
      applicant.hasMedexCard = true;
      res.redirect('../care-home');
      } else {
        res.redirect('../medical-exemption');
      }
    });


// long term illness
app.get(/illness-b4/, function (req, res) {
  if (req.query.illness === 'yes') {
    medicalEx = true;
    setPartnerText(applicant.partner);
    res.render('sprints/b4/care-home', {
      'partnerortext' : partnerOrText
    });
  } else {
    medicalEx = false;
    res.render('sprints/b4/care-home', {
      'partnerortext' : partnerOrText
    });
  }
});

    // long term illness
//      app.get(/illness-handler/, function (req, res) {
//      if (req.query.illness === 'yes') {
//        res.redirect('../results/medex-apply');
//      } else {
//        res.redirect('../care-home');
//      }
//    });


//    // long term condition
//      app.get(/longterm-illness-handler/, function (req, res) {
//      if (req.query.longtermIllness === 'yes') {
//      res.redirect('../results/prescription-medex');
//      } else {
//        res.redirect('../care-home');
//      }
//    });

    // carehome router
      app.get(/care-home-handler/, function (req, res) {
      if (req.query.carehome === 'yes') {
           setPartnerText(applicant.partner);
          res.render('sprints/b4/sc/authority-assessed', {
            'partnerortext' : partnerOrText
      });
  } else {
    res.render('sprints/b4/savings1', {
      'partnerortext' : partnerOrText
    });
  }
});


//      // saving-handler
//      app.get(/saving-handler/, function (req, res) {
//        //scotland
//          if (applicant.country === 'scotland'){
//                if (req.query.savings === 'yes') {
//           if (pregnancy === true) {
//                res.redirect('../answers-preg-nolis');
//           } else if (warPension === true) {
//              res.redirect ('../answers-warpension-nolis');
//           } else if (medicalEx === true) {
//              res.redirect ('../answers-medex-nolis');
//           } else {
//              res.redirect ('../savings-kickout');
//           }
//        } else if (req.query.savings === 'no') {
//            if (pregnancy === true) {
//                res.redirect('../answers-preg-lis-v2');
//            } else if (warPension === true) {
//                res.redirect ('../answers-warpension-lis-v2');
//            } else if (medicalEx === true) {
//                res.redirect ('../answers-medex-lis-v3');
//            } else {
//                res.redirect ('../answers-lis-scot');
//            }
//        }
//        // wales
//         if (applicant.country === 'wales'){
//                if (req.query.savings === 'yes') {
//           if (pregnancy === true) {
//                res.redirect('../answers-preg-nolis');
//           } else if (warPension === true) {
//              res.redirect ('../answers-warpension-nolis');
//           } else if (medicalEx === true) {
//              res.redirect ('../answers-medex-nolis');
//           } else {
//              res.redirect ('../savings-kickout');
//           }
//        } else if (req.query.savings === 'no') {
//            if (pregnancy === true) {
//                res.redirect('../answers-preg-lis-v2');
//            } else if (warPension === true) {
//                res.redirect ('../answers-warpension-lis-v2');
//            } else if (medicalEx === true) {
//                res.redirect ('../answers-medex-lis-v3');
//            } else {
//                res.redirect ('../answers-lis-scot');
//            }
//
//        }
//              } if (applicant.country === 'england'){
//        if (req.query.savings === 'yes') {
//           if (pregnancy === true) {
//                res.redirect('../answers-preg-nolis');
//           } else if (warPension === true) {
//              res.redirect ('../answers-warpension-nolis');
//           } else if (medicalEx === true) {
//              res.redirect ('../answers-medex-nolis');
//           } else {
//              res.redirect ('../savings-kickout');
//           }
//        } else if (req.query.savings === 'no') {
//            if (pregnancy === true) {
//                res.redirect('../answers-preg-lis-v2');
//            } else if (warPension === true) {
//                res.redirect ('../answers-warpension-lis-v2');
//            } else if (medicalEx === true) {
//                res.redirect ('../answers-medex-lis-v3');
//            } else {
//                res.redirect ('../lis-v3');
//            }
//        }//end scot
//        }//else wales
//        }
//    });
        
// saving-handler
      app.get(/saving-handler/, function (req, res) {
        //england
                if (req.query.savings === 'yes') {
           if (pregnancy === true) {
                res.redirect('../answers-preg-nolis');
           } else if (warPension === true) {
              res.redirect ('../answers-warpension-nolis');
           } else if (medicalEx === true) {
              res.redirect ('../answers-medex-nolis');
           } else {
              res.redirect ('../savings-kickout');
           }
        } else if (req.query.savings === 'no') {
            if (pregnancy === true) {
                res.redirect('../answers-preg-lis-v2');
            } else if (warPension === true) {
                res.redirect ('../answers-warpension-lis-v2');
            } else if (medicalEx === true) {
                res.redirect ('../answers-medex-lis-v3');
            } else {
                setPartnerText(applicant.partner);
          res.render('sprints/b4/lis-v3', {
            'partnerortext' : partnerOrText,
            });
        }
        }
    });

    // authority assessment handler
    app.get(/authority-assessed-handler/, function (req, res) {
      if (req.query.authority === 'yes') {
        res.redirect('../sc/lis-application');
      } else {
           setPartnerText(applicant.partner);
          res.render('sprints/b4/sc/savings', {
            'partnerortext' : partnerAndText,
      });
      }
    });
      
    // savings kickout handler
    app.get(/savings-ko-handler/, function (req, res) {
      if (req.query.savings === 'yes') {
        res.redirect('../savings-kickout');
      } else {
        res.redirect('../guarantee-credit');
      }
    });

    // carehome savings kickout handler
    app.get(/carehome-savings-handler/, function (req, res) {
      if (req.query.savings === 'no') {
        res.redirect('../lis-v2');
      } else {
        res.redirect('../savings-kickout');
      }
    });
      
    }
  };

