const db           = require('../index');
var config         = require('../../config/config.js');
const url          = `${config.db.host}${config.db.name}`

const bcrypt     = require('bcrypt');
const prompts    = require('prompts');
const UserModel  = require('../models/UserModel');
const saltRounds = 10;

const onCancel = prompt => {
    console.log('Closing app without creating the admin.');
    process.exit();
}

var companySeeder  = () =>{

    const questions = [
      {
        type    : 'text',
        name    : 'f_name',
        message : 'What is your first name?'
      },
      {
        type    : 'text',
        name    : 'l_name',
        message : 'What is your last name?'
      },
      {
        type    : 'text',
        name    : 'email',
        message : 'What is your email?'
      },
      {
        type    : 'text',
        name    : 'password',
        message : 'Create a password.'
      },
      {
        type    : 'text',
        name    : 'mobile_no',
        message : 'What is your contact no.?'
      },{
        type    : 'text',
        name    : 'gender',
        message : 'What is your gender?',
      },
      {
        type    : 'text',
        name    : 'status',
        message : 'status either pending / active / disabled / blocked',
       
      },
      {
        type    : 'text',
        name    : 'role',
        message : 'what is your role ? admin / customer / company',
      },
    ];
     
    (async () => {
      try{
            await db.connectDB(url);
            const response    = await prompts(questions,{ onCancel });
            const hash        = await bcrypt.hash(response.password, saltRounds);
            const user        =  new UserModel({ ...response , password : hash});
            await user.save();
            process.exit();
      }catch(err){
        console.log(err);
        process.exit(err);
      }
    })();
}

companySeeder();
