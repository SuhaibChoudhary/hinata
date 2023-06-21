const { connect } = require('mongoose');
const uri = "mongodb+srv://zhampy:suhaib786@cluster0.ngqceoa.mongodb.net/noisy";

try {
  connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB");
      // Start your application logic here
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}
