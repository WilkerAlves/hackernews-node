const {GraphQLServer} = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

//O objeto resolvers é a implementação real do esquema GraphQL.
//Observe como sua estrutura é idêntica à estrutura da definição de tipo dentro de typeDefs: Query.info.
const resolvers = {
    Query: {
        info: () => `This is the API of Hackernews  Clone`,
        //Você está adicionando um novo resolvedor para o campo raiz do feed.
        // Observe que um resolvedor sempre deve ser nomeado após o campo correspondente da definição do esquema.
        feed: (root,args,context,info) => {
            return context.db.query.links({}, info)
        },
    },

    Mutation:{
        //A implementação do pós-resolvedor primeiro cria um novo objeto de link, adiciona-o à lista de links existente e, finalmente, retorna o novo link.
        post:(root, args,context,info) =>{
            return context.db.mutation.createLink({
                data: {
                    url: args.url,
                    description: args.description
                },
            }, info)
        }
    },

    Link: {
        id: (root) => root.id,
        description: (root) => root.description,
        url: (root) => root.url,
      }
}

//Finalmente, o esquema e os resolvers são empacotados e passados para o GraphQLServer que é importado do graphql-yoga.
//Isso informa ao servidor quais operações de API são aceitas e como elas devem ser resolvidas.
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
      ...req,
      db: new Prisma({
        typeDefs: 'src/generated/prisma.graphql',
        endpoint: 'https://eu1.prisma.sh/wilker-alves-nogueira-4073df/graphqldb/dev',
        secret: 'mysecret123',
        debug: true,
      }),
    }),
  })

server.start(() => console.log(`Server is runnig on http://localhost:4000`))