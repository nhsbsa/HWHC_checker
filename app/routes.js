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
    
    
    //treatment type router
    app.get(/treatment-handler/, function (req, res) {
      applicant.need = req.query.condition;
      if (applicant.need === 'prescription') {
        res.redirect('../country_v2');
      } else {
        res.redirect('../passported-benefits');
      }
    });
    
    // eu handler
      app.get(/uk-handler/, function (req, res) {
      var sprint = req.url.charAt(9);
      if (req.query.nationality === 'uk') {
        res.render('sprints/'+ sprint +'/country_v2');
      } else {
        res.render('sprints/'+ sprint +'/country-info');
      }
    });
      
    // country router
      app.get(/country-handler/, function (req, res) {
      applicant.country = req.query.country;
      if (applicant.country === 'england') {
        res.redirect('../border-gp');
      } else if (applicant.country === 'northernIreland') {
        res.redirect('../ni-kickout');
      } else if (applicant.country === 'scotland') {
        res.redirect('../entitlements/prescription-scot');
      } else {
        res.redirect('../entitlements/prescription-wales');
      }
    });

    // gp router
      app.get(/gp-handler/, function (req, res) {
      if (req.query.gp === 'yes') {
        res.redirect('../entitlements/prescription-eng');
      } else {
        res.redirect('../date-of-birth');
      }
    });
    
    // dob-handler
    app.get(/dob-handler/, function (req, res) { 
      applicant.age = (thisYear - req.query.dobyear);
      console.log(applicant.age);
      if (applicant.age >= 60) {
        res.redirect('../entitlements/prescription-over60');
      } else if (applicant.age >= 19) { 
        res.redirect('../tax-credits-19yo');
      } else if (applicant.age  > 15) {
        res.redirect('../full-time-education');
      } else {
        res.redirect('../full-exemption-under-16');
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

    // tax credits claim yes or no
      app.get(/taxcredits-handler/, function (req, res) {
      applicant.namedOnTaxCredits = req.query.taxcredits;
      if (applicant.namedOnTaxCredits === 'yes' || applicant.namedOnTaxCredits === 'nk' ) {
        res.redirect('../tax-credits-income');
      } else {
        res.redirect('../passported-benefits');
      }
    });


    // tax credits income handler
      app.get(/taxcredit-income-handler/, function (req, res) {
      if (req.query.taxcreditsIncome === 'yes') {
        res.redirect('../tax-credits-claim-type');
      } else {
        res.redirect('../passported-benefits');
      }
    });


    // tax credits type handler
      app.get(/taxcredit-type-handler/, function (req, res) {
        if (req.query.taxcreditsType ==="wtcctc") {
          var tcType = 'Working Tax Credit and Child Tax Credit together, or is named on the claim,';
          res.render('sprints/8/taxcredit-info', {
            'tctype' : tcType
          });
        } else if (req.query.taxcreditsType ==="ctcdis") {
          var tcType = 'Working Tax Credit including a disability element, or is named on the claim,';
          res.render('sprints/8/taxcredit-info', {
            'tctype' : tcType
          });
        } else if (req.query.taxcreditsType ==="ctc") {
          var tcType = 'Child Tax Credit or is named on the claim,';
          res.render('sprints/8/taxcredit-info', {
            'tctype' : tcType
          });
        } else if (req.query.taxcreditsType === 'wtc') {
        res.redirect('../passported-benefits');
        } else {
      }
    });


    // passported benefits handler
      app.get(/passportedBen-handler/, function (req, res) {
        if (req.query.benefits ==="incomeSupport") {
          var benType = 'Income Support';
          res.render('sprints/8/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="uniCredit") {
          var benType = 'Universal Credit';
          res.render('sprints/8/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="jsa") {
          var benType = 'Income based Job Seekers Allowance';
          res.render('sprints/8/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits ==="esa") {
          var benType = 'Income related Employment and Support Allowance';
          res.render('sprints/8/full-exemption-benefits', {
            'bentype' : benType
          });
        } else if (req.query.benefits === 'continue') {
            if (applicant.age > 60) {
                res.redirect('../guarantee-credit');
            } else {
                res.redirect('../pregnancy');
            }
      }
    });

    // pension guarantee-credit-handler
      app.get(/guarantee-credit-handler/, function (req, res) {
      if (req.query.gcredit === 'yes') {
        res.redirect('../ppc');
      } else {
        res.redirect('../lis');
      }
    });
      
    // pregnancy router
      app.get(/preg-handler/, function (req, res) {
      if (req.query.pregnancy === 'yes') {
      applicant.isPregnant = true;
      res.redirect('../entitlements/prescription-preg');
      } else {
        res.redirect('../war-pension');
      }
    });

    // war pensioner handler
      app.get(/war-pension-handler/, function (req, res) {
      if (req.query.warPension === 'yes') {
        res.redirect('../entitlements/prescription-war-pension');
      } else {
        res.redirect('../do-you-have-a-medical-exemption');
      }
    });

    // medex card yes or no router
      app.get(/medex-handler/, function (req, res) {
      if (req.query.medex === 'yes') {
      applicant.hasMedexCard = true;
      res.redirect('../entitlements/prescription-medex');
      } else {
        res.redirect('../medical-exemption-list');
      }
    });

    // long term condition
      app.get(/longterm-illness-handler/, function (req, res) {
      if (req.query.longtermIllness === 'yes') {
      res.redirect('../entitlements/prescription-medex');
      } else {
        res.redirect('../care-home');
      }
    });

    // carehome router
      app.get(/care-home-handler/, function (req, res) {
      if (req.query.carehome === 'yes') {
      res.redirect('../sc/authority-assessed');
      } else {
        res.redirect('../savings1');
      }
    });
        
      // saving-handler
      app.get(/saving-handler/, function (req, res) {
      if (req.query.savings === 'yes') {
        res.redirect('../ppc');
      } else {
        res.redirect('../lis');
      }
    });

    // authority assessment handler
    app.get(/authority-assessed-handler/, function (req, res) {
      if (req.query.authority === 'yes') {
        res.redirect('../lis-application');
      } else {
        res.redirect('../savings');
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
      if (req.query.savings === 'yes') {
        res.redirect('../../lis');
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

 
    
   
