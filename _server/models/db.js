const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
}, (err) => {
  console.log(!err ? 'MongoDB connection succeeded.' : 'Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2));
});

require('./user.model');
require('./master/work.category.model');
