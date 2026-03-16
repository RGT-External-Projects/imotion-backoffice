import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RoleModule } from '../modules/role/role.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [RoleModule, UserModule],
  providers: [SeedService],
})
export class SeedModule {}
