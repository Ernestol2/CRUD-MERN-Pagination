const app = require('./app')
const port = process.env.PORT || 3001

require('dotenv').config()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})