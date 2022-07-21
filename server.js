const express = require('express')
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const app = express();
const axios = require('axios')




const schema = buildSchema(`
  type User{
    id:Int
    name:String
    age:Int
  }

  type Post{
    userId:Int,
    id:Int,
    title:String,
    body:String
  }

  type Query{
    hello:String
    welcomeMessage(name:String,dayOfWeek:String!):String
    getUser:User
    getUsers:[User]
    getUserByAge(age:Int):[User]
    getDataFromApi:[Post]
    getPostById(id:Int):Post
}



input UserData{
    id:Int!
    name:String!
    age:Int!
}

type Mutation{
    setUser(user:UserData):User
}
`)

// setUser(id:Int!,name:String!,age:Int!):User

const user =
{
    id: 1,
    name: 'Zeeshan Ali',
    age: 23,
}

const users = [
    {
        id: 1,
        name: 'Zeeshan Ali',
        age: 22,
    },
    {
        id: 2,
        name: 'Muhammad Usman',
        age: 20,
    },
]


const root = {
    hello: () => {
        return 'Hello world!';
    },
    welcomeMessage: args => {
        console.log(args);
        return `Hey ${args.name},how are you? ,today is ${args.dayOfWeek}`;
    },
    getUser: () => { return user },
    getUsers: () => { return users },
    getUserByAge: (args) => {
        // console.log(args)
        console.log(args.age)
        let user = users.filter((user) => {
            return user.age === args.age
        });

        return user
    },

    getDataFromApi: async () => {
        let posts = await axios.get('https://jsonplaceholder.typicode.com/posts')
        return posts.data
    },
    getPostById: async (args) => {
        console.log(args.id)
        let postSingle = await axios.get(`https://jsonplaceholder.typicode.com/posts/${args.id}`)
        return postSingle.data
    },

    setUser: (args) => {
        console.log(args)
        users.push(args.user)
        return args.user
    }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: root
}))


app.listen(2000, () => console.log('listening on port 2000'))



//  query{
//    getUsers{
//      name
//      age
//    }
//  }



// mutation{
//     setUser(user:
//       {
//         id:3,
//         name:"Waseem",
//         age:21
      
//       }){
//       id
//         name
//       age
//     }
//   }