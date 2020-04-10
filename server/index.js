const app = require('./config/express');
const config= require('./config/config');
//initialize mongoDB
require('./config/mongoose');

app.listen(config.port,()=>{
    console.log(`server listening on ${config.port} (${config.env})`);
}); 