// English translations for Student Module
export default {
  // Sidebar Navigation
  sidebar: {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    schedule: 'Schedule',
    courses: 'Courses',
    library: 'Library',
    student: 'Student',
    logout: 'Logout'
  },

  // Dashboard Page
  dashboard: {
    title: 'Dashboard Overview',
    welcome: 'Hello, Welcome to your dashboard 🙏'
  },

  // Stats Cards
  stats: {
    myPresence: 'Present Courses',
    lateDays: 'Late Courses',
    absentDays: 'Absent Courses',
    myAttendanceRate: 'My Attendance Rate',
    days: 'courses'
  },

  // Attendance Chart
  chart: {
    title: 'My Attendance History',
    last7Days: 'Last 7 days',
    thisMonth: 'This month',
    last3Months: 'Last 3 months',
    errorMessage: 'Unable to fetch data.',
    people: 'people',
    total: 'Total',
    attendanceRate: 'Attendance Rate',
    courseCompleted: 'Course Completed',
    loadingTitle: 'Loading data...',
    loadingMessage: 'Please wait a moment',
    errorTitle: 'Error loading data',
    retry: 'Try again',
    emptyTitle: 'No data available',
    emptyMessage: 'Please select a different time period or wait for new data'
  },

  // Today's Classes
  classes: {
    title: "Today's Classes",
    viewSchedule: 'View Schedule',
    noClasses: 'No classes for today',
    teacher: 'Teacher',
    room: 'Room',
    ongoing: 'Ongoing',
    upcoming: 'Upcoming',
    completed: 'Completed'
  },

  // Quick Actions
  quickActions: {
    title: 'Quick Actions',
    viewAttendance: 'View Attendance',
    schedule: 'Schedule',
    courses: 'Courses',
    library: 'Library'
  },

  // Attendance Page
  attendancePage: {
    title: 'Attendance Record',
    subtitle: 'Upload QR code to record your attendance',
    uploadQR: 'Upload QR',
    enterPassword: 'Enter Password',
    complete: 'Complete',
    uploadQRCode: 'Upload QR Code',
    dragOrClick: 'Drag & drop or click to select',
    qrReady: 'QR Code Ready',
    changeImage: 'Change Image',
    validating: 'Validating...',
    validateQR: 'Validate QR Code',
    sessionPassword: 'Session Password',
    enterSessionPassword: 'Enter session password',
    submit: 'Submit',
    submitting: 'Submitting...',
    back: 'Back',
    success: 'Success!',
    attendanceRecorded: 'Your attendance has been recorded successfully.',
    recordAnother: 'Record Another',
    myHistory: 'My Attendance History',
    date: 'Date',
    course: 'Course',
    time: 'Time',
    status: 'Status',
    present: 'Present',
    late: 'Late',
    absent: 'Absent',
    noHistory: 'No attendance history',
    passwordHint: 'Ask your teacher for the session password',
    submissionFailed: 'Submission Failed',
    minutesRemaining: 'minutes remaining',
    loadMore: 'Load More',
    loading: 'Loading...',
    manualPresent: 'Marked Present',
    alreadySubmitted: 'You have already submitted attendance for this session',
    invalidQRCode: 'Invalid QR code',
    sessionExpired: 'Session has expired. Please get a new QR code from your teacher.',
  },

  // Schedule/Timetable Page
  schedulePage: {
    title: 'Class Schedule',
    subtitle: 'View your class timetable',
    department: 'Department',
    academicYear: 'Academic Year',
    group: 'Group',
    subjects: 'Subjects',
    timeDay: 'Time / Day',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    noClass: 'Free',
    todayClasses: "Today's Classes",
    noTodayClasses: 'No classes today'
  },

  // Courses Page
  coursesPage: {
    title: 'Courses',
    subtitle: 'Welcome! Join your learning journey.',
    searchPlaceholder: 'Search books...',
    level: 'Level',
    status: 'Status',
    all: 'All',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    active: 'Active',
    inactive: 'Inactive',
    viewCourse: 'View Course',
    students: 'Students',
    hours: 'Hours',
    completed: 'Completed',
    noCourses: 'No Courses Found',
    noCoursesMatch: 'No courses match your search criteria'
  },

  // Course Detail Modal
  courseModal: {
    title: 'Course Information',
    courseCode: 'Course Code',
    academicYear: 'Academic Year',
    year: 'Year',
    professor: 'Professor',
    department: 'Department',
    status: 'Status',
    createdAt: 'Created At'
  },

  // Library Page
  libraryPage: {
    title: 'E-Library',
    subtitle: 'Browse our collection of educational resources',
    searchPlaceholder: 'Search books by title or author...',
    all: 'All',
    mathematics: 'Mathematics',
    physics: 'Physics',
    computerScience: 'Computer Science',
    informationTechnology: 'Information Technology',
    noBooksFound: 'No Books Found',
    readBook: 'Read Book',
    pages: 'Pages',
    year: 'Year',
    author: 'Author',
    fetchError: 'Failed to load books. Please try again.',
    totalBooks: 'TOTAL BOOKS',
    categories: 'CATEGORIES',
    categoriesLabel: 'Categories',
    showing: 'Showing',
    of: 'of',
    books: 'books',
    viewDetails: 'View Details',
    view: 'View',
    by: 'By',
    tryAdjusting: 'Try adjusting your search or filter to find what you\'re looking for',
    clearFilters: 'Clear Filters',
    errorTitle: 'Oops! Something went wrong',
    aboutThisBook: 'About this book',
    noDescription: 'No description available for this book.',
    openBookLink: 'Open Book Link',
    noLinkAvailable: 'No Link Available',
    isbn: 'ISBN'
  },

  // Profile
  profile: {
    title: 'Profile',
    student: 'Student',
    editProfile: 'Edit Profile',
    save: 'Save',
    cancel: 'Cancel',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    class: 'Class',
    department: 'Department',
    attendanceRate: 'Attendance Rate',
    enrolledCourses: 'Enrolled Courses',
    joinDate: 'Join Date',
    // Additional profile related strings
    personalInfoTitle: 'Personal Information',
    personalInfoSubtitle: 'Manage your personal information',
    academicInfoTitle: 'Academic Information',
    academicInfoSubtitle: 'Information managed by administrators',
    readOnly: 'Read only',
    uploadImage: 'Choose Image',
    enterFullName: 'Enter full name',
    studentId: 'Student ID',
    statusActive: 'Active',
    statusCompleted: 'Completed',
    discardConfirm: 'Are you sure you want to discard changes?',
    saveSuccess: 'Profile saved successfully!',
    removeImage: 'Remove image'
    ,
    noPhone: 'No phone number',
    imageTooLarge: 'Image is too large. Please choose an image smaller than 5MB.'
    ,
    invalidImageType: 'Please select an image file only.'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    search: 'Search',
    filter: 'Filter',
    viewAll: 'View All',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No'
  },

  // Months
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December'
  }
}
