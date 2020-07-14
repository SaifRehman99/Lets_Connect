// Just Like express-graphql
// It uses express behind the scene
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

const { MONGOURI } = require('./config');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection successful');
  } catch (err) {
    console.log('Error connecting to MongoDB');
  }
};
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // for the header for auth middleware
  // access the req body in the context
  context: ({ req }) => ({ req }),
});

server.listen({ port: 5000 }).then((res) => console.log(`Server running at PORT: ${res.url}`));
