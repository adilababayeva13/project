const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()
var cors = require('cors')
const path = require('path')

// AdminBro
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

// import routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const jobTypeRoute = require('./routes/jobsTypeRoutes')
const jobRoute = require('./routes/jobsRoutes')

// Models
const jobModel = require('./models/jobModel')
const jobTypeModel = require('./models/jobTypeModel')
const userModel = require('./models/userModel')

const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')

// Database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err))

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(bodyParser.json({ limit: '5mb' }))
// app.use(
//   bodyParser.urlencoded({
//     limit: '5mb',
//     extended: true,
//   }),
// )
app.use(cookieParser())
app.use(cors())

// Routes middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', jobTypeRoute)
app.use('/api', jobRoute)

// AdminBro Setup
AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  branding: {
    companyName: 'Your Company',
  },
  resources: [
    {
      resource: jobModel,
      options: {
        properties: {
          description: { type: 'richtext' },
        },
      },
    },
    {
      resource: jobTypeModel,
      options: {
        properties: {
          description: { type: 'richtext' },
        },
      },
    },
    {
      resource: userModel,
      options: {
        properties: {
          description: { type: 'richtext' },
        },
      },
    },
  ],
  // other options
})

const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    // Implement your user authentication logic here
    return { email, password }
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})

app.use(adminBro.options.rootPath, adminRouter)

// Handling static files for production
__dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')),
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// Error middleware
app.use(errorHandler)

// Start server
const port = process.env.PORT || 9000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
