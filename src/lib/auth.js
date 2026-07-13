import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('daanbaksho');

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    modelName: 'users',
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'supporter',
        input: true,
      },
      credits: {
        type: 'number',
        required: false,
        defaultValue: 0,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async user => {
          const startingCredits = user.role === 'creator' ? 20 : 50;
          await db
            .collection('users')
            .updateOne(
              { _id: new ObjectId(user.id) },
              { $set: { credits: startingCredits } },
            );
        },
      },
    },
  },
});
