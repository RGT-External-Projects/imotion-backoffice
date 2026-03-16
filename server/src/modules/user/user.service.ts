import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InviteUserDto } from './dto/invite-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException(`User with email ${createUserDto.email} already exists`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = new User();
    user.email = createUserDto.email;
    user.passwordHash = passwordHash;
    user.fullName = createUserDto.fullName;
    if (createUserDto.roleId) {
      user.roleId = createUserDto.roleId;
    }
    user.isActive = true;

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role'],
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'fullName', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
      select: ['id', 'email', 'fullName', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.fullName) {
      user.fullName = updateUserDto.fullName;
    }

    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }

    return this.userRepository.save(user);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // If changing password, verify current password
    if (updateProfileDto.newPassword) {
      if (!updateProfileDto.currentPassword) {
        throw new UnauthorizedException('Current password is required to change password');
      }

      const isPasswordValid = await bcrypt.compare(
        updateProfileDto.currentPassword,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      user.passwordHash = await bcrypt.hash(updateProfileDto.newPassword, 10);
    }

    if (updateProfileDto.fullName) {
      user.fullName = updateProfileDto.fullName;
    }

    return this.userRepository.save(user);
  }

  async inviteUser(inviteUserDto: InviteUserDto): Promise<{ message: string; email: string }> {
    // Check if email already exists
    const existing = await this.userRepository.findOne({
      where: { email: inviteUserDto.email },
    });

    if (existing) {
      throw new ConflictException(`User with email ${inviteUserDto.email} already exists`);
    }

    // TODO: Implement actual email sending logic
    // For now, just return success message
    return {
      message: 'Invitation sent successfully',
      email: inviteUserDto.email,
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async deactivate(id: string): Promise<User> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<User> {
    return this.update(id, { isActive: true });
  }
}
