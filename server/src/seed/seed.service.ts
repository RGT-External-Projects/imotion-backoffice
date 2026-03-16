import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RoleService } from '../modules/role/role.service';
import { UserService } from '../modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('tarting database seeding...');
    await this.seedRoles();
    await this.seedAdminUser();
    this.logger.log('Database seeding completed!');
  }

  private async seedRoles() {
    const defaultRoles = [
      {
        name: 'admin',
        description: 'Administrator with full system access',
        permissions: ['*'], 
      },
      {
        name: 'therapist',
        description: 'Therapist who can manage sessions and patients',
        permissions: [
          'sessions:read',
          'sessions:create',
          'sessions:update',
          'patients:read',
          'patients:create',
          'patients:update',
          'devices:read',
        ],
      },
      {
        name: 'viewer',
        description: 'Read-only access to view data',
        permissions: [
          'sessions:read',
          'patients:read',
          'devices:read',
        ],
      },
    ];

    for (const roleData of defaultRoles) {
      const existing = await this.roleService.findByName(roleData.name);
      
      if (!existing) {
        await this.roleService.create(
          roleData.name,
          roleData.description,
          roleData.permissions,
        );
        this.logger.log(`Created role: ${roleData.name}`);
      } else {
        this.logger.log(`Role already exists: ${roleData.name}`);
      }
    }
  }

  private async seedAdminUser() {
    // Get admin role
    const adminRole = await this.roleService.findByName('admin');
    
    if (!adminRole) {
      this.logger.error('Admin role not found! Cannot create admin user.');
      return;
    }

    // Check if admin user exists (by email)
    const adminEmail = this.configService.get('ADMIN_EMAIL', 'admin@imotion.com');
    
    try {
      // Try to find user by email using the findAll method and filter
      const users = await this.userService.findAll();
      const existingAdmin = users.find(u => u.email === adminEmail);

      if (!existingAdmin) {
        // Create admin user
        const adminPassword = this.configService.get('ADMIN_PASSWORD', 'iMotion@Admin2024!');
        
        await this.userService.create({
          email: adminEmail,
          password: adminPassword,
          fullName: 'System Administrator',
          roleId: adminRole.id,
        });

        this.logger.log(`Created admin user: ${adminEmail}`);
        this.logger.warn(`Default admin password: ${adminPassword}`);
        this.logger.warn(`PLEASE CHANGE THE DEFAULT PASSWORD IMMEDIATELY!`);
      } else {
        this.logger.log(`Admin user already exists: ${adminEmail}`);
      }
    } catch (error) {
      this.logger.error(`Error checking/creating admin user: ${error.message}`);
    }
  }
}
