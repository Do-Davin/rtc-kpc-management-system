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
import { AttendanceSession } from './modules/attendance/entities/attendance-session.entity';
import { AttendanceRecord } from './modules/attendance/entities/attendance-record.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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

    // ========== Create Dummy Attendance Data for Last 3 Days ==========
    console.log('\nCreating dummy attendance data for last 3 days...');

    const sessionRepo = dataSource.getRepository(AttendanceSession);
    const recordRepo = dataSource.getRepository(AttendanceRecord);

    // Get student and teacher users
    const student = await studentRepo.findOne({
      where: { user: { id: studentUser.id } },
    });
    const teacher = await teacherRepo.findOne({
      where: { user: { id: teacherUser.id } },
    });

    if (student && teacher) {
      // Course schedule: 7:00-17:00, each course 2 hours = 5 courses per day
      const courseSlots = [
        { name: 'Programming', start: '07:00', end: '09:00' },
        { name: 'Database', start: '09:00', end: '11:00' },
        { name: 'Networking', start: '11:00', end: '13:00' },
        { name: 'Web Development', start: '14:00', end: '16:00' },
        { name: 'Software Engineering', start: '16:00', end: '18:00' },
      ];

      // Attendance statuses for variety
      const attendancePatterns = [
        // Day 1 (3 days ago): 4 present, 1 late
        ['PRESENT', 'PRESENT', 'LATE', 'PRESENT', 'PRESENT'],
        // Day 2 (2 days ago): 3 present, 1 late, 1 absent
        ['PRESENT', 'ABSENT', 'PRESENT', 'LATE', 'PRESENT'],
        // Day 3 (yesterday): 5 present
        ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT'],
      ];

      for (let dayOffset = 2; dayOffset >= 0; dayOffset--) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() - dayOffset);
        sessionDate.setHours(8, 0, 0, 0);

        const patternIndex = 2 - dayOffset; // 0, 1, 2
        const pattern = attendancePatterns[patternIndex];

        for (let i = 0; i < courseSlots.length; i++) {
          const course = courseSlots[i];
          const status = pattern[i] as 'PRESENT' | 'ABSENT' | 'LATE';

          // Check if session already exists for this course/date
          const existingSession = await sessionRepo.findOne({
            where: {
              teacherId: teacherUser.id,
              courseName: course.name,
              sessionDate: sessionDate,
            },
          });

          if (!existingSession) {
            // Create attendance session
            const session = sessionRepo.create({
              teacherId: teacherUser.id,
              courseId: uuidv4(),
              courseName: course.name,
              department: department.name,
              year: '1',
              sessionName: `${course.name} - ${sessionDate.toDateString()}`,
              sessionPassword: await bcrypt.hash('test123', 10),
              qrToken: uuidv4(),
              sessionDate: sessionDate,
              expiryTime: new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
              status: 'STOPPED',
            });
            const savedSession = await sessionRepo.save(session);

            // Create attendance record for the student
            await recordRepo.insert({
              sessionId: savedSession.id,
              studentId: studentUser.id,
              status: status,
              markedAt: new Date(sessionDate.getTime() + (status === 'LATE' ? 20 * 60 * 1000 : 5 * 60 * 1000)),
              markedBy: status === 'ABSENT' ? undefined : teacherUser.id,
              remarks: status === 'LATE' ? 'Arrived 20 minutes late' : undefined,
            });

            console.log(`  Created: ${course.name} on ${sessionDate.toDateString()} - ${status}`);
          }
        }
      }

      console.log('\nDummy attendance data created!');
      console.log('Summary for student@rtc.com (last 3 days):');
      console.log('  Day 1: 4 Present, 1 Late');
      console.log('  Day 2: 3 Present, 1 Late, 1 Absent');
      console.log('  Day 3: 5 Present');
      console.log('  Total: 12 Present, 2 Late, 1 Absent (15 courses)');
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
