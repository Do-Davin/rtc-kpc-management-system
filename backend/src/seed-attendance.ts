// /**
//  * Standalone script to seed attendance data for testing student dashboard
//  * Run: npx ts-node src/seed-attendance.ts
//  */
// import { DataSource } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import * as bcrypt from 'bcrypt';

// // Create a minimal data source for seeding
// // Connect via Docker exposed port 5434 -> 5432
// const dataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5434, // Docker exposed port
//   username: 'rtc_user',
//   password: 'rtc_pass',
//   database: 'rtc_db',
//   synchronize: false,
//   logging: false,
// });

// async function seedAttendanceData() {
//   try {
//     await dataSource.initialize();
//     console.log('Database connected!');

//     // Check if student user exists, if not, show error
//     let studentUser = await dataSource.query(
//       `SELECT id FROM users WHERE email = 'student@rtc.com' LIMIT 1`
//     );

//     if (!studentUser || studentUser.length === 0) {
//       console.log('Student user not found. Creating test users first...\n');
      
//       // Create department if not exists
//       const existingDept = await dataSource.query(
//         `SELECT id, name FROM departments WHERE code = 'IT' LIMIT 1`
//       );
      
//       let deptId: string;
//       let deptName: string;
      
//       if (!existingDept || existingDept.length === 0) {
//         deptId = uuidv4();
//         deptName = 'Information Technology';
//         await dataSource.query(
//           `INSERT INTO departments (id, name, code, description) VALUES ($1, $2, $3, $4)`,
//           [deptId, deptName, 'IT', 'IT Department']
//         );
//         console.log('Created IT Department');
//       } else {
//         deptId = existingDept[0].id;
//         deptName = existingDept[0].name;
//         console.log('IT Department already exists');
//       }

//       // Create teacher user
//       const existingTeacher = await dataSource.query(
//         `SELECT id FROM users WHERE email = 'teacher@rtc.com' LIMIT 1`
//       );
      
//       let teacherUserId: string;
//       if (!existingTeacher || existingTeacher.length === 0) {
//         teacherUserId = uuidv4();
//         const hashedPassword = await bcrypt.hash('Teacher@123', 10);
//         await dataSource.query(
//           `INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)`,
//           [teacherUserId, 'teacher@rtc.com', hashedPassword, 'TEACHER']
//         );
        
//         // Create teacher profile
//         const teacherProfileId = uuidv4();
//         await dataSource.query(
//           `INSERT INTO teachers (id, "fullName", "employeeId", "phoneNumber", specialization, status, "userId", "departmentId")
//            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
//           [teacherProfileId, 'Test Teacher', 'EMP001', '012345678', 'Computer Science', 'ACTIVE', teacherUserId, deptId]
//         );
//         console.log('Created Teacher user (teacher@rtc.com / Teacher@123)');
//       } else {
//         teacherUserId = existingTeacher[0].id;
//         console.log('Teacher user already exists');
//       }

//       // Create student user
//       const studentUserId = uuidv4();
//       const hashedStudentPassword = await bcrypt.hash('Student@123', 10);
//       await dataSource.query(
//         `INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)`,
//         [studentUserId, 'student@rtc.com', hashedStudentPassword, 'STUDENT']
//       );
      
//       // Create student profile
//       const studentProfileId = uuidv4();
//       await dataSource.query(
//         `INSERT INTO students (id, "fullName", "studentIdCard", year, "enrollmentYear", "phoneNumber", status, "userId", "departmentId")
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
//         [studentProfileId, 'Test Student', 'rtc001', 1, 2026, '098765432', 'ACTIVE', studentUserId, deptId]
//       );
//       console.log('Created Student user (student@rtc.com / Student@123)\n');

//       // Update studentUser for the rest of the script
//       studentUser = [{ id: studentUserId }];
//     }

//     const studentUserId = studentUser[0].id;
//     console.log(`Found student user: ${studentUserId}`);

//     // Get the teacher user
//     const teacherUser = await dataSource.query(
//       `SELECT id FROM users WHERE email = 'teacher@rtc.com' LIMIT 1`
//     );

//     if (!teacherUser || teacherUser.length === 0) {
//       console.error('Teacher user not found! Please run the main seed first.');
//       return;
//     }

//     const teacherUserId = teacherUser[0].id;
//     console.log(`Found teacher user: ${teacherUserId}`);

//     // Get department
//     const dept = await dataSource.query(
//       `SELECT name FROM departments WHERE code = 'IT' LIMIT 1`
//     );
//     const deptName = dept?.[0]?.name || 'Information Technology';

//     // Course schedule: 7:00-17:00, each course 2 hours = 5 courses per day
//     const courseSlots = [
//       { name: 'Programming', start: '07:00', end: '09:00' },
//       { name: 'Database', start: '09:00', end: '11:00' },
//       { name: 'Networking', start: '11:00', end: '13:00' },
//       { name: 'Web Development', start: '14:00', end: '16:00' },
//       { name: 'Software Engineering', start: '16:00', end: '18:00' },
//     ];

//     // Attendance statuses for variety (last 3 days)
//     const attendancePatterns = [
//       // Day 1 (3 days ago): 4 present, 1 late
//       ['PRESENT', 'PRESENT', 'LATE', 'PRESENT', 'PRESENT'],
//       // Day 2 (2 days ago): 3 present, 1 late, 1 absent
//       ['PRESENT', 'ABSENT', 'PRESENT', 'LATE', 'PRESENT'],
//       // Day 3 (yesterday): 5 present
//       ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT'],
//     ];

//     console.log('\nCreating attendance data for last 3 days...\n');

//     for (let dayOffset = 2; dayOffset >= 0; dayOffset--) {
//       const sessionDate = new Date();
//       sessionDate.setDate(sessionDate.getDate() - dayOffset);
//       sessionDate.setHours(8, 0, 0, 0);

//       const patternIndex = 2 - dayOffset;
//       const pattern = attendancePatterns[patternIndex];

//       console.log(`Day ${3 - dayOffset} (${sessionDate.toDateString()}):`);

//       for (let i = 0; i < courseSlots.length; i++) {
//         const course = courseSlots[i];
//         const status = pattern[i];

//         // Check if session already exists
//         const existingSession = await dataSource.query(
//           `SELECT id FROM attendance_sessions 
//            WHERE "teacherId" = $1 AND "courseName" = $2 
//            AND DATE("sessionDate") = DATE($3) LIMIT 1`,
//           [teacherUserId, course.name, sessionDate]
//         );

//         if (existingSession && existingSession.length > 0) {
//           console.log(`  Skipping: ${course.name} - already exists`);
//           continue;
//         }

//         // Create session
//         const sessionId = uuidv4();
//         const qrToken = uuidv4();
//         const courseId = uuidv4();
//         const hashedPassword = await bcrypt.hash('test123', 10);
//         const expiryTime = new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000);

//         await dataSource.query(
//           `INSERT INTO attendance_sessions 
//            (id, "teacherId", "courseId", "courseName", department, year, "sessionName", 
//             "sessionPassword", "qrToken", "sessionDate", "expiryTime", status)
//            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
//           [
//             sessionId,
//             teacherUserId,
//             courseId,
//             course.name,
//             deptName,
//             '1',
//             `${course.name} - ${sessionDate.toDateString()}`,
//             hashedPassword,
//             qrToken,
//             sessionDate,
//             expiryTime,
//             'STOPPED',
//           ]
//         );

//         // Create attendance record
//         const recordId = uuidv4();
//         const markedAt = new Date(
//           sessionDate.getTime() + (status === 'LATE' ? 20 * 60 * 1000 : 5 * 60 * 1000)
//         );
//         const markedBy = status === 'ABSENT' ? null : teacherUserId;
//         const remarks = status === 'LATE' ? 'Arrived 20 minutes late' : null;

//         await dataSource.query(
//           `INSERT INTO attendance_records 
//            (id, "sessionId", "studentId", status, "markedAt", "markedBy", remarks)
//            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//           [recordId, sessionId, studentUserId, status, markedAt, markedBy, remarks]
//         );

//         console.log(`  Created: ${course.name} - ${status}`);
//       }
//     }

//     console.log('\n✅ Dummy attendance data created successfully!');
//     console.log('\nSummary for student@rtc.com (last 3 days):');
//     console.log('  Day 1 (3 days ago): 4 Present, 1 Late');
//     console.log('  Day 2 (2 days ago): 3 Present, 1 Late, 1 Absent');
//     console.log('  Day 3 (yesterday):  5 Present');
//     console.log('  ─────────────────────────────────────────');
//     console.log('  Total: 12 Present, 2 Late, 1 Absent (15 courses)');
//     console.log('\nExpected stats on student dashboard:');
//     console.log('  Present Courses: 12');
//     console.log('  Late Courses: 2');
//     console.log('  Absent Courses: 1');
//     console.log('  Attendance Rate: 93% ((12+2)/15 * 100)');
//   } catch (error) {
//     console.error('Seed failed:', error);
//   } finally {
//     await dataSource.destroy();
//   }
// }

// seedAttendanceData();
