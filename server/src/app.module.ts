import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ApiModule } from './api/api.module'
import { AuthModule } from './auth/auth.module'
import { DbModule } from './db/db.module'
import { IsUnique } from './entities/shared/validators/is-unique.validator'

@Module({
  imports: [
    // Database connection setup (postgres and redis)
    DbModule,
    // Graphql API (/api)
    ApiModule,
    // Authentication service and API (/auth)
    AuthModule,
    // Serve static files (/static)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client/build'),
      renderPath: '/static'
    })
  ],
  providers: [IsUnique]
})
export class AppModule {}
