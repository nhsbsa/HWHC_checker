var querystring = require('querystring');

//import the person constructor
var person = require("./person.js");

//create an applicant
var applicant = person.createPerson(
  this.age = undefined,
  this.need = undefined,
  this.country = undefined, 
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

//partner question variable
 var setPartnerText = function (partner) {
    if (applicant.partner === false) {
      partnerBothText = 'you';
      partnerCommaText = 'you';
      partnerOrText = 'you';
      partnerAndText = 'you';
      partnersText = 'your';
      iWe = 'I';
    } else {
      partnerBothText = 'you, your partner or both of you';
      partnerCommaText = 'you, your partner';
      partnerOrText = 'you or your partner';
      partnerAndText = 'you and your partner';
      partnersText = "your or your partner's";
      parentText = "they"
      iWe = 'we';

    }
  };





module.exports = {
  bind : function (app) {
    function find_gp_practice(slug) {
      return app.locals.gp_practices.filter(
        function(p) {
          return p.slug === slug;
        }
      )[0];
    }

    function find_appointment(uuid) {
      return app.locals.appointments.filter(
        function(a) {
          return a.uuid === uuid;
        }
      )[0];
    }

    function find_matching_appointments(filter_functions) {
      return filter_functions.reduce(function(filtered_appointments, filter_func) {
        return filtered_appointments.filter(filter_func);
      }, app.locals.appointments);
    }

//    function find_matching_appointment(filter_functions) {
//      return find_matching_appointments(filter_functions)[0]
//    }

    function getServiceFromSlug(service_slug_param) {
      var service_slug = service_slug_param || 'general-practice',
          service = app.locals.services.filter(function(service) {
            return service.slug === service_slug;
          })[0];

      return service;
    }

    function getPractitionerFromUuid(uuid) {
      return app.locals.practitioners.filter(function(practitioner) {
        return practitioner.uuid === uuid;
      })[0];
    };

    function findPractitionersForService(service_slug) {
      var service_to_uuid = {};  // {'eye-check': [practitioner_uuid_1, practitioner_uuid_2]}

      app.locals.appointments.forEach(function(appointment) {
        if(!service_to_uuid.hasOwnProperty(appointment.service)) {
          service_to_uuid[appointment.service] = [];
        }

        if(-1 == service_to_uuid[appointment.service].indexOf(appointment.practitioner_uuid)) {
          service_to_uuid[appointment.service].push(appointment.practitioner_uuid);
        }
      });

      return service_to_uuid[service_slug].map(getPractitionerFromUuid);
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

    
    
    //********
    //sprint 8
    //********

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
      res.render('sprints/b4/tax-credits-under20', {
        'partnerortext' : partnerOrText,
        'iwe' : iWe
      });
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
          app.get(/dob-2-handler/, function (req, res) {
      applicant.age = (thisYear - req.query.dobyearBeta);
      console.log(applicant.age);
      if (applicant.age >= 20) {
         setPartnerText(applicant.partner);
        res.render('sprints/b4/tax-credits-over20', {
        'iwe' : iWe
      });
      } else if (applicant.age >= 19) {
        res.redirect('../partner');
      } else if (applicant.age  >=16) {
        res.redirect('../full-time-education');
      } else if (applicant.age  <=15) {
        res.redirect('../results/full-exemption-under-16');
      }
    });

            // country-handler in sprint B4
      app.get(/country-b4-handler/, function (req, res) {
      if (req.query.countryBeta  === 'englandBeta'&& req.query.gp === 'no'){
        res.redirect('../date-of-birth');
      } else if (req.query.countryBeta  === 'englandBeta'&& req.query.gp === 'yes'){
        res.redirect('../results/prescription-eng');
      } else if (req.query.countryBeta  === 'scotlandBeta') {
        res.redirect('../results/country-kickout-scot');
      } else if (req.query.countryBeta  === 'walesBeta') {
        res.redirect('../results/country-kickout-wales');
      } else {
        res.redirect('../results/country-kickout-ni');
      }
    });


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

//      Journeys
//      18 year old dental scotland
//      added a HREF to the dental-scot check if I pay button
//      start  >  what costs = Dental  >  country = scotland  >  you get free check ups  >  DOB = 1998
//      >  are you in full time education  > common journey...
    
//      18 year old dental wales
//      start  >  what costs = Dental  >  country = wales  >  DOB = 1998
//      >  are you in full time education  > common journey...
    
//      18 year old dental england
//      start  >  what costs = Dental  >  country = england  >  DOB = 1998
//      >  are you in full time education  > common journey...
    
//       why is wales 18 year old dental different to england 18 year old?

    
    
      // if 60 englad one way, wales wales hander
    
      // DONE
      // age- <16: full-exemption-under-16
      // age- 18: full-time-education
      // age- 19: tax-credits-19yo
      // age- 20-60>: tax-credits 
    
      // TO DO
      // dental-wales-handler & DENTAL-SCOTLAND HANDLER / if 18 go to FTE
      // IF TAX CREDITS
      // 20 - 60 TAX CREDITS 
    
      // 
      // age- 16-17: /entitlements/dental-16-17 *fix
      // age- <25 && wales: /results/dental-wales *fix
    
    
    
    
      // full-time-education- yes: full-exemption-fte
      // full-time-education- no: tax-credits-19yo
      // taxcredits- yes: tax-credits-income
      // taxcredits- no: passported-benefits

      //passported-benefits- yes: full-exemption-benefits
      //passported-benefits- no: guarantee-credit
      //
      //guarantee-credit- yes: full-exemption-benefits
      //guarantee-credit- no: care-home
      //
      //care-home- yes: savings-2
      //care-home- no: savings-1
      //
      //savings-2:




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
        'partnerandtext' : partnerAndText
      });
      } else {
        res.redirect('../tax-credits-under20-parents');
      }
    });


          // tax credits claim yes or no under 20
      app.get(/taxcredits-parents/, function (req, res) {
      if (req.query.taxcreditsParents  === 'yes'){
      var parentTc = true;
        setPartnerText(applicant.partner);
        res.render('sprints/b4/tax-credits-income', {
        'parenttext' : parentText
      });
      } else {
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
//        } else {
//            if (parentTc == true) {
//                res.redirect('../taxcredit-info');
//                //not working!
            } else {
            setPartnerText(applicant.partner);
            res.render('sprints/b3/tax-credits-claim-type', {
            'partnerandtext' : partnerAndText,
      });
            }
    } else {
        if (req.query.taxcreditsIncome === 'no') {
            res.redirect('../passported-benefits');
        } else {
            res.redirect('../tax-credits-claim-type');
        }
      }
    });


    // tax credits type handler
      app.get(/taxcredit-type-handler/, function (req, res) {
        if (req.query.taxcreditsType ==="wtcctc") {
          var tcType = 'Working Tax Credit and Child Tax Credit together';
          res.render('sprints/b3/taxcredit-info', {
            'tctype' : tcType
          });
        } else if (req.query.taxcreditsType ==="ctcdis") {
          var tcType = 'Working Tax Credit including a disability element';
          res.render('sprints/b3/taxcredit-info', {
            'tctype' : tcType
          });
        } else if (req.query.taxcreditsType ==="ctc") {
          var tcType = 'Child Tax Credit';
          res.render('sprints/b3/taxcredit-info', {
            'tctype' : tcType
          });
        } else if (req.query.taxcreditsType === 'wtc' && applicant.age < 20 ) {
        setPartnerText(applicant.partner);
        res.render('sprints/b4/passported-benefits-under20', {
        'partnercommatext' : partnerCommaText
      });
        } else {
            res.redirect('../passported-benefits');
        }
    });

// passported benefits under 20 handler
      app.get(/passportedBen-u20/, function (req, res) {
        if (req.query.benefits ==="incomeSupport") {
          var benType = 'Income Support';
          res.render('sprints/b3/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="uniCredit") {
          var benType = 'Universal Credit';
          setPartnerText(applicant.partner);
          res.render('sprints/b3/uc-claim-type', {
            'bentype' : benType,
            'partnerortext' : partnerOrText
      });
        } else if (req.query.benefits ==="jsa") {
          var benType = 'income based Job Seekers Allowance (JSA)';
          res.render('sprints/b3/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="esa") {
          var benType = 'income related Employment and Support Allowance (ESA)';
          res.render('sprints/b3/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="penCredit") {
          var benType = 'Pension Credit (Guarantee Credit)';
          res.render('sprints/b3/results/full-exemption-benefits', {
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
          var benType = 'Income Support';
          res.render('sprints/b3/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="uniCredit") {
          var benType = 'Universal Credit';
          setPartnerText(applicant.partner);
          res.render('sprints/b3/uc-claim-type', {
            'bentype' : benType,
            'partnerortext' : partnerOrText
      });
        } else if (req.query.benefits ==="jsa") {
          var benType = 'income based Job Seekers Allowance (JSA)';
          res.render('sprints/b3/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="esa") {
          var benType = 'income related Employment and Support Allowance (ESA)';
          res.render('sprints/b3/results/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="penCredit") {
          var benType = 'Pension Credit (Guarantee Credit)';
          res.render('sprints/b3/results/full-exemption-benefits', {
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
        res.redirect('../uc-income-with-element');
      } else {
        res.redirect('../uc-income-without-element');
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

//                // pregnancy b3 router
//      app.get(/preg-b3-handler/, function (req, res) {
//      if (req.query.pregnancy === 'yes') {
//      res.redirect('../results/all-preg');
//      } else {
//        res.redirect('../war-pension');
//      }
//    });

          // pregnancy b2 router
      app.get(/preg-all-handler/, function (req, res) {
      if (req.query.pregnancy === 'yes') {
      res.redirect('../results/all-preg');
      } else {
        res.redirect('../war-pension');
      }
    });

    // pregnancy router
      app.get(/preg-handler/, function (req, res) {
      if (req.query.pregnancy === 'yes') {
      applicant.isPregnant = true && applicant.need === 'prescription';
      res.redirect('../results/prescription-preg');
      } else {
        res.redirect('../war-pension');
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
      if (req.query.illness === 'yes' || 'no') {
          setPartnerText(applicant.partner);
          res.render('sprints/b4/care-home', {
            'partnerortext' : partnerOrText
      });
      } else {
        res.redirect('../care-home');
      }
    });

    // long term illness
      app.get(/illness-handler/, function (req, res) {
      if (req.query.illness === 'yes') {
        res.redirect('../results/medex-apply');
      } else {
        res.redirect('../care-home');
      }
    });


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
        res.redirect('../savings1');
      }
    });
        
      // saving-handler
      app.get(/saving-handler/, function (req, res) {
      if (req.query.savings === 'yes') {
        res.redirect('../savings-kickout');
          //if 'yes' && pregnancy 'yes'
          //res.redirect (../answers-preg-nolis)

          //if 'yes' && warPension 'yes'
          //res.redirect (../answers-warpension-nolis)

          //if 'yes' && medex || illness 'yes'
          //res.redirect (../answers-medex-nolis)

      } else {
          //if 'no' && no preg, war pension or medex/illness
        res.redirect('../lis-v2');
          //if 'no' && pregnancy 'yes'
          //res.redirect (../answers-preg-lis-v2)

          //if 'no' && warPension 'yes'
          //res.redirect (../answers-warpension-lis-v2)

          //if 'no' && medex || illness 'yes'
          //res.redirect (../answers-medex-lis-v3)
      }
    });

    // authority assessment handler
    app.get(/authority-assessed-handler/, function (req, res) {
      if (req.query.authority === 'yes') {
        res.redirect('../sc/lis-application');
      } else {
           setPartnerText(applicant.partner);
          res.render('sprints/b4/sc/savings', {
            'partnerortext' : partnerOrText,
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
        res.redirect('../../lis-v2');
      } else {
        res.redirect('../../savings-kickout');
      }
    });
    


    // Change or cancel appointment fork:
    app.get('/change-or-cancel-an-appointment/path-handler', function(req, res) {
      console.log(req.query);
      if (req.query.appointment === 'change') {
        res.redirect('/change-or-cancel-an-appointment/change-to-next-available-appointment');
      } else {
        res.redirect('/change-or-cancel-an-appointment/cancel-appointment');
      }
    });

    // Register with a GP - suggested GP practices
    app.get('/register-with-a-gp/suggested-gps', function(req, res) {
      res.render(
        'register-with-a-gp/suggested-gps',
        { practices: app.locals.gp_practices }
      );
    });

    // Register with a GP - practice details
    app.get('/register-with-a-gp/practices/:practice', function(req, res) {
      var practice = find_gp_practice(req.params.practice);

      res.render('register-with-a-gp/practice-details',
                 {'practice': practice});
    });

    // Register with a GP - choose a practice to register with
    app.get('/register-with-a-gp/practices/:practice/register', function(req, res) {
      var practice = find_gp_practice(req.params.practice);

      req.session.practice = {
        name: practice.name,
        address: practice.address.join(', ')
      };

      res.redirect('/register-with-a-gp/choose-registration-method');
    });

    // Register with a GP - choose register method fork:
    app.get('/register-with-a-gp/choose-registration-method-handler', function(req, res) {
      if (req.query.registration_method === 'with-signin') {
        res.redirect('/register-with-a-gp/register-with-signin');
      } else {
        res.redirect('/register-with-a-gp/register-without-signin');
      }
    });

    app.get('/register-with-a-gp/application-complete', function(req, res) {
      res.render(
        'register-with-a-gp/application-complete',
        {
          hideDonorQuestions: req.query.hideDonorQuestions
        }
      )
    });

    app.get('/book-an-appointment/:service_slug?/see-particular-person', function(req, res) {
      var service = getServiceFromSlug(req.params.service_slug),
          practitioners = findPractitionersForService(service.slug);

      res.render(
        'book-an-appointment/see-particular-person',
        {
          practice: app.locals.gp_practices[0],
          practitioners: practitioners
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/appointments-with-practitioner', function(req, res) {
      var practitioner_uuid = req.query.practitioner,
          service = getServiceFromSlug(req.params.service_slug),
          practitioner = getPractitionerFromUuid(practitioner_uuid);

      res.render(
        'book-an-appointment/appointments-with-practitioner',
        {
          practice: app.locals.gp_practices[0],
          practitioner: practitioner,
          appointments: find_matching_appointments([
            filterByPractitionerUuid(practitioner_uuid),
            filterByService(service.slug)])
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/next-appointment-early-morning', function(req, res) {
      var service = getServiceFromSlug(req.params.service_slug),
          practice = service.slug === 'general-practice' ? app.locals.gp_practices[0] : null;

      res.render(
        'book-an-appointment/next-appointment-early-morning',
        {
          practice: practice,
          service: service,
          appointments: {
            face_to_face: find_matching_appointment([filterByService(service.slug),filterFaceToFace]),
            early: find_matching_appointment([filterByService(service.slug),filterBefore10]),
          }
        }
      );
    });

    app.get('/book-an-appointment/next-appointment-with-woman', function(req, res) {
      res.render(
        'book-an-appointment/next-appointment-with-woman',
        {
          practice: app.locals.gp_practices[0],
          appointments: {
            face_to_face: find_matching_appointment([filterByService('general-practice'),filterFaceToFace]),
            female_gp: find_matching_appointment([filterByService('general-practice'),filterFemaleGP])
          }
        }
      );
    });

    app.get('/book-an-appointment/next-appointment-with-woman-early-morning', function(req, res) {
      res.render(
        'book-an-appointment/next-appointment-with-woman-early-morning',
        {
          practice: app.locals.gp_practices[0],
          appointments: {
            face_to_face: find_matching_appointment([filterByService('general-practice'),filterFaceToFace]),
            female_gp: find_matching_appointment([filterByService('general-practice'),filterFemaleGP]),
            early_female_gp: find_matching_appointment([filterByService('general-practice'),filterFemaleGP, filterBefore10])
          }
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/find-new-appointment', function(req, res) {
      var service_slug = req.params.service_slug,
          offramp = req.session.service_booking_offramp &&
                    req.session.service_booking_offramp[service_slug];

      if (offramp) {
        delete req.session.service_booking_offramp[service_slug];
      }

      res.render('book-an-appointment/find-new-appointment');
    });

    app.get('/book-an-appointment/:service_slug?/next-available-appointment', function(req, res) {

      var service = getServiceFromSlug(req.params.service_slug),
          practice = service.slug === 'general-practice' ? app.locals.gp_practices[0] : null;

      res.render(
        'book-an-appointment/next-available-appointment',
        {
          practice: practice,
          service: service,
          appointments: {
            face_to_face: find_matching_appointment([filterByService(service.slug),filterFaceToFace]),
          }
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/all-appointments', function(req, res) {

      var service = getServiceFromSlug(req.params.service_slug),
          practice = service.slug === 'general-practice' ? app.locals.gp_practices[0] : null;

      res.render(
        'book-an-appointment/all-appointments',
        {
          practice: practice,
          appointments: find_matching_appointments([filterByService(service.slug)]),
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/confirm-appointment/:uuid', function(req, res) {
      var appointment = find_appointment(req.params.uuid),
          service = getServiceFromSlug(req.params.service_slug),
          practice = app.locals.gp_practices[0],
          address = appointment.address || [practice.name].concat(practice.address);

      res.render(
        'book-an-appointment/confirm-appointment',
        {
          practice: practice,
          service: service,
          appointment: appointment,
          address: address
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/appointment-confirmed/:uuid', function(req, res) {
      var service = getServiceFromSlug(req.params.service_slug),
          offramp = req.session.service_booking_offramp &&
                    req.session.service_booking_offramp[service.slug];

      if (offramp) {
        delete req.session.service_booking_offramp[service.slug];
        res.redirect(offramp.replace('UUID', req.params.uuid));
      }
      else {
        res.render(
          'book-an-appointment/appointment-confirmed',
          {
            practice: app.locals.gp_practices[0],
            service: service,
            appointment: find_appointment(req.params.uuid)
          }
        );
      }
    });

    app.get(/^\/(book-an-appointment\/[^.]+)$/, function (req, res) {
      var path = (req.params[0]);

      res.render(
        path,
        {
          practice: app.locals.gp_practices[0]
        },
        function(err, html) {
          if (err) {
            console.log(err);
            res.send(404);
          } else {
            res.end(html);
          }
        }
      );
    });

    app.get('/planner/main', function(req, res) {
      var booked_eye_test = req.query.booked_eye_test &&
                            find_appointment(req.query.booked_eye_test),
          booked_diabetes_review = req.query.booked_diabetes_review &&
                                   find_appointment(req.query.booked_diabetes_review),
          booked_blood_test = req.query.booked_blood_test &&
                              find_appointment(req.query.booked_blood_test),
          cards = {
            past: [],
            present: [],
            future: []
          };

      // historic stuff
      cards.past.push('test-results');
      cards.past.push('medication');

      // actions to take
      if (!booked_blood_test) {
        cards.present.push('book-your-blood-test');
      }
      if (!booked_diabetes_review) {
        cards.present.push('book-your-first-diabetes-review');
      }
      if (!booked_eye_test) {
        cards.present.push('book-your-first-eye-test');
      }

      // upcoming stuff
      cards.future.push('repeat-prescription');
      if (booked_eye_test) {
        cards.future.push('your-eye-test-appointment');
      }
      if (booked_blood_test) {
        cards.future.push('your-blood-test-appointment');
      }
      if (booked_diabetes_review) {
        cards.future.push('your-diabetes-review-appointment');
      }

      res.render(
        'planner/main',
        {
          cards: cards,
          booked_eye_test: booked_eye_test,
          booked_diabetes_review: booked_diabetes_review,
          booked_blood_test: booked_blood_test,
          querystring: querystring.stringify(req.query)
        }
      );
    });

    app.get('/planner/book-diabetes-review', function(req, res) {
      var query = req.query,
          service_slug = 'diabetes-annual-review';

      // work out a return URL
      query.booked_diabetes_review = 'UUID';
      var return_url = '/planner/main?' + querystring.stringify(query)
          + '#your-diabetes-review-appointment';

      // set the return URL in the session
      if (!req.session.service_booking_offramp) {
        req.session.service_booking_offramp = {};
      }
      req.session.service_booking_offramp[service_slug] = return_url;

      // redirect to the service booking journey, skipping log in
      res.redirect(
        '/book-an-appointment/' + service_slug + '/next-available-appointment'
      );
    });

    app.get('/planner/book-eye-test', function(req, res) {
      var query = req.query,
          service_slug = 'diabetes-eye-screening';

      // work out a return URL
      query.booked_eye_test = 'UUID';
      var return_url = '/planner/main?' + querystring.stringify(query)
          + '#your-eye-test-appointment';

      // set the return URL in the session
      if (!req.session.service_booking_offramp) {
        req.session.service_booking_offramp = {};
      }
      req.session.service_booking_offramp[service_slug] = return_url;

      // redirect to the service booking journey, skipping log in
      res.redirect(
        '/book-an-appointment/' + service_slug + '/next-available-appointment'
      );
    });

    app.get('/planner/book-blood-test', function(req, res) {
      var query = req.query,
          service_slug = 'diabetes-blood-glucose-test';

      // work out a return URL
      query.booked_blood_test = 'UUID';
      var return_url = '/planner/main?' + querystring.stringify(query)
          + '#your-blood-test-appointment';

      // set the return URL in the session
      if (!req.session.service_booking_offramp) {
        req.session.service_booking_offramp = {};
      }
      req.session.service_booking_offramp[service_slug] = return_url;

      // redirect to the service booking journey, skipping log in
      res.redirect(
        '/book-an-appointment/' + service_slug + '/next-available-appointment'
      );
    });
  }
};

var filterByService = function(service_slug) {
  return function(appointment) {
    return appointment.service === service_slug;
  }
}

var filterFaceToFace = function(appointment) {
  return appointment.appointment_type == 'face to face';
};

var filterFemaleGP = function(appointment) {
  return appointment.practitioner.gender == 'female' && appointment.practitioner.role == 'GP';
};

var filterBefore10 = function(appointment) {
  var hour = parseInt(appointment.appointment_time.split(':')[0], 10);
  return hour < 10;
};

var filterByPractitionerUuid = function(uuid) {
  return function(appointment) {
    return appointment.practitioner_uuid === uuid;
  }
}

 
    
   
