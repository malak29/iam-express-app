import app from './app'
import { PORT } from './config/env'

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📋 Health check: http://localhost:${PORT}/health`)
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`)
    console.log(`👥 User endpoints: http://localhost:${PORT}/api/users`)
})
