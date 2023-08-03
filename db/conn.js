const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://eventmgmt:eventmgmt@eventmanagementcluster.b1x94pb.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log("Connection is successful");
}).catch((e) => {
    console.log("No Connection");
})