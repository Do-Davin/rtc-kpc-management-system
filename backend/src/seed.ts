import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';
import { Department } from './modules/departments/entities/department.entity';
import {
  Teacher,
  TeacherStatus,
} from './modules/teachers/entities/teacher.entity';
import {
  Student,
  StudentStatus,
} from './modules/students/entities/student.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Starting database seed...');

  try {
    // Create a department if none exists
    const deptRepo = dataSource.getRepository(Department);
    let department = await deptRepo.findOne({ where: { code: 'IT' } });

    if (!department) {
      department = deptRepo.create({
        name: 'Information Technology',
        code: 'IT',
        description: 'IT Department',
      });
      department = await deptRepo.save(department);
      console.log('Created IT Department');
    } else {
      console.log('IT Department already exists');
    }

    // Create admin user if not exists
    const userRepo = dataSource.getRepository(User);
    let adminUser = await userRepo.findOne({
      where: { email: 'admin@rtc.com' },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      adminUser = userRepo.create({
        email: 'admin@rtc.com',
        password: hashedPassword,
        role: 'ADMIN',
      });
      adminUser = await userRepo.save(adminUser);
      console.log('Created Admin user (admin@rtc.com / Admin@123)');
    } else {
      console.log('Admin user already exists');
    }

    // Create teacher user and profile
    let teacherUser = await userRepo.findOne({
      where: { email: 'teacher@rtc.com' },
    });
    const teacherRepo = dataSource.getRepository(Teacher);

    if (!teacherUser) {
      const hashedPassword = await bcrypt.hash('Teacher@123', 10);
      teacherUser = userRepo.create({
        email: 'teacher@rtc.com',
        password: hashedPassword,
        role: 'TEACHER',
      });
      teacherUser = await userRepo.save(teacherUser);
      console.log('Created Teacher user (teacher@rtc.com / Teacher@123)');
    } else {
      console.log('Teacher user already exists');
    }

    // Create teacher profile if not exists
    let teacherProfile = await teacherRepo.findOne({
      where: { user: { id: teacherUser.id } },
    });

    if (!teacherProfile) {
      teacherProfile = teacherRepo.create({
        fullName: 'Test Teacher',
        employeeId: 'EMP001',
        phoneNumber: '012345678',
        specialization: 'Computer Science',
        status: TeacherStatus.ACTIVE,
        user: teacherUser,
        department: department,
      });
      await teacherRepo.save(teacherProfile);
      console.log('Created Teacher profile for teacher@rtc.com');
    } else {
      console.log('Teacher profile already exists');
    }

    // Create student user and profile
    let studentUser = await userRepo.findOne({
      where: { email: 'student@rtc.com' },
    });
    const studentRepo = dataSource.getRepository(Student);

    if (!studentUser) {
      const hashedPassword = await bcrypt.hash('Student@123', 10);
      studentUser = userRepo.create({
        email: 'student@rtc.com',
        password: hashedPassword,
        role: 'STUDENT',
      });
      studentUser = await userRepo.save(studentUser);
      console.log('Created Student user (student@rtc.com / Student@123)');
    } else {
      console.log('Student user already exists');
    }

    // Create student profile if not exists
    let studentProfile = await studentRepo.findOne({
      where: { user: { id: studentUser.id } },
    });

    if (!studentProfile) {
      studentProfile = studentRepo.create({
        fullName: 'Test Student',
        studentIdCard: 'temp', // Will be updated after save
        year: 1,
        enrollmentYear: 2026,
        phoneNumber: '098765432',
        status: StudentStatus.ACTIVE,
        user: studentUser,
        department: department,
      });
      const savedStudent = await studentRepo.save(studentProfile);

      // Update studentIdCard with auto-generated format: rtc[studentNumber]
      savedStudent.studentIdCard = `rtc${savedStudent.studentNumber}`;
      await studentRepo.save(savedStudent);

      console.log(
        `Created Student profile (${savedStudent.studentIdCard}) for student@rtc.com`,
      );
    } else {
      console.log('Student profile already exists');
    }

    console.log('\nSeed completed successfully!');
    console.log('\nTest Accounts:');
    console.log('   Admin:   admin@rtc.com / Admin@123');
    console.log('   Teacher: teacher@rtc.com / Teacher@123');
    console.log('   Student: student@rtc.com / Student@123');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

seed();
