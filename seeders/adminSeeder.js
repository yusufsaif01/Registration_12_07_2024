const db           = require('../db');
const bcrypt       = require('bcrypt');
const prompts      = require('prompts');
const config       = require('../config');

const UserRegistrationService =  require('../services/UserRegistrationService');

const onCancel     = prompt => {
    console.log('Closing app without creating the admin.');
    process.exit();
}

var adminSeeder     = () =>{

    const questions = [
      // {
      //   type:'text',
      //    name : 'user_id',
      //    message : 'What is your USER_ID?'
      // },
      {
        type:'text',
         name : 'name',
         message : 'What is your NAME?'
      
      },
      {
        type:'text',
         name : 'warehouse',
         message : 'What is your WAREHOUSE?'
      
      },
      {
        type:'text',
         name : 'location',
         message : 'What is your LOCATION?'
      
      },
      // {
      //   type:'date',
      //    name : 'dob',
      //    message : 'What is your DOB?',
      //    initial: new Date(1997, 09, 12),
      
      // },
      // {
      //   type:'date',
      //    name : 'doj',
      //    message : 'What is your DOJ?',
      //    initial: new Date(1997, 09, 12),
      // },
      {
        type: 'select',
          name: 'role',
          message: 'Pick a role',
          choices: [
            { title: 'super-admin', description: 'This is super admin', value: 'super-admin'},
            // { title: 'admin' ,description: 'This is warehouse admin', value: 'admin' },
            // { title: 'manager' , value: 'manager' ,disabled: true  },
            // { title: 'employee' , value: 'employee', disabled: true  }
          ],
          initial: 0
      
      },
      {
        type:'text',
         name : 'email',
         message : 'What is your EMAIL?'
      },
      {
        type:'password',
         name : 'password',
         message : 'What is your PASSWORD?'
      
      },
      {
        type:'text',
         name : 'vendor_id',
         message : 'What is your VENDOR_ID?'
      
      },
      {
        type:'text',
         name : 'avatar_url',
         message : 'What is your AVATAR_URL?'
      
      },
      {
        type:'text',
         name : 'state',
         message : 'What is your STATE?'
      
      },
      {
        type:'text',
         name : 'country',
         message : 'What is your COUNTRY?'
      
      },
      {
        type:'text',
         name : 'phone',
         message : 'What is your PHONE?'
      
      }
    ];

    (async () => {
        try{    
              await db.connectDB();
              const response    = await prompts(questions,{ onCancel });
              // const hash        = await bcrypt.hash(response.password, saltRounds);
              
              const registrationInst = new UserRegistrationService();
              await registrationInst.adminRegistration(response)

              process.exit();
        }catch(err){
          process.exit(err);
        }
    })();
}

adminSeeder();

