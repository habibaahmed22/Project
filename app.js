/**
 * app.js
 * Smart Course Registration and Academic Advisor
 * CSCI 310 Principles of Programming Languages
 * Amity University Dubai
 *
 * CourseFP contains pure transcript, credit and curriculum rules.
 * SemesterPlan applies those rules to the current selections.
 * SmartApp persists the account, term records, semester plans and feedback.
 */

// The demo keeps a SHA-256 digest of each fictional AUD ID in the account registry.
function sha256(ascii) {
  ascii = encodeURIComponent(ascii).replace(/%([\dA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty]; ) {
    var w = words.slice(j, (j += 16));
    var oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ (~e & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// ============================================================================
// 2. Bachelor of Science in Computer Science curriculum (125 Credits Total)
// Core courses (110 cr), 2 concentrations (15 cr electives across Fall & Spring),
// separate internships (INTE 200, INTE 300), and optional MATH 125 prior credit.
// Numbered Semesters 1-8 maintain strict chronological integrity.
// ============================================================================

var SEMESTER_CONFIG = [
  { id: 1, label: 'Semester 1 — Year 1, Fall', year: 'Year 1', term: 'Fall', credits: 13 },
  { id: 2, label: 'Semester 2 — Year 1, Spring', year: 'Year 1', term: 'Spring', credits: 13 },
  { id: 3, label: 'Semester 3 — Year 2, Fall', year: 'Year 2', term: 'Fall', credits: 18 },
  { id: 4, label: 'Semester 4 — Year 2, Spring', year: 'Year 2', term: 'Spring', credits: 17 },
  { id: 5, label: 'Semester 5 — Year 3, Fall', year: 'Year 3', term: 'Fall', credits: 18 },
  { id: 6, label: 'Semester 6 — Year 3, Spring', year: 'Year 3', term: 'Spring', credits: 17 },
  { id: 7, label: 'Semester 7 — Year 4, Fall', year: 'Year 4', term: 'Fall', credits: 12 },
  { id: 8, label: 'Semester 8 — Year 4, Spring', year: 'Year 4', term: 'Spring', credits: 13 }
];

// The delivery table places Internship I after Semester 4 and Internship II after Semester 5.
var PROGRAM_TERMS = SEMESTER_CONFIG.flatMap(sem => {
  const terms = [{ ...sem, key: sem.year + '_' + sem.term, order: sem.id }];
  if (sem.id === 4 || sem.id === 5) {
    terms.push({ key: sem.year + '_Internship', year: sem.year, term: 'Internship',
      label: sem.year + ' — Internship ' + (sem.id === 4 ? 'I' : 'II'), order: sem.id + 0.5 });
  }
  return terms;
});
// Null points exclude a notation from both the CGPA numerator and denominator.
var GRADE_SCALE = {
  A:    { marks: '90–100', points: 4.0, earned: true, label: 'Distinction' },
  'A-': { marks: '87–89', points: 3.7, earned: true, label: 'Excellent' },
  'B+': { marks: '84–86', points: 3.3, earned: true, label: 'Very Good' },
  B:    { marks: '80–83', points: 3.0, earned: true, label: 'Good' },
  'B-': { marks: '77–79', points: 2.7, earned: true, label: 'Fair High' },
  'C+': { marks: '74–76', points: 2.3, earned: true, label: 'Fair' },
  C:    { marks: '70–73', points: 2.0, earned: true, label: 'Satisfactory High' },
  'C-': { marks: '67–69', points: 1.7, earned: true, label: 'Satisfactory' },
  'D+': { marks: '64–66', points: 1.3, earned: true, label: 'Weak' },
  D:    { marks: '60–63', points: 1.0, earned: true, label: 'Conditional Pass' },
  F:    { marks: 'Below 60', points: 0, earned: false, label: 'Fail' },
  P:    { points: null, earned: true, label: 'Pass' },
  W:    { points: null, earned: false, label: 'Withdrawal before the drop end period' },
  I:    { points: null, earned: false, label: 'Incomplete' },
  NC:   { points: null, earned: false, label: 'No credit toward graduation' },
  WF:   { points: null, earned: false, label: 'Administrative withdrawal' },
  CC:   { points: null, earned: false, label: 'Satisfactory progress in a continuing course' },
  TR:   { points: null, earned: true, label: 'Transfer or prior learning credit' },
  CX:   { points: null, earned: true, label: 'Pass by proficiency or challenge exam' },
  AUD:  { points: null, earned: false, label: 'Audit without assessment' }
};
var LETTER_GRADES = Object.keys(GRADE_SCALE);
var AGREEMENT_SCALE = ['1 · Strongly disagree', '2 · Disagree', '3 · Neither agree nor disagree', '4 · Agree', '5 · Strongly agree'];
var FEEDBACK_DIFFICULTIES = ['Understanding the material', 'Heavy workload', 'Prerequisite gaps', 'Balancing commitments',
  'Keeping up with the pace', 'Accessing course materials', 'Understanding assignment instructions', 'Preparing for exams',
  'Getting timely feedback', 'None'];
var FEEDBACK_QUESTIONS = [
  { key: 'ease', label: 'Was registration easy to use?', choices: ['Yes', 'Mostly', 'No'] },
  { key: 'clarity', label: 'Were the course requirements clear?', choices: ['Yes', 'Mostly', 'No'] },
  { key: 'support', label: 'What would you like more help with?', choices: ['Choosing courses', 'Understanding grades', 'Planning my workload', 'Nothing right now'] },
  { key: 'materials', group: 'content-ratings', label: 'The course materials (textbooks, readings, videos) effectively supported my learning.', choices: AGREEMENT_SCALE },
  { key: 'assessments', group: 'content-ratings', label: 'Assignments and exams accurately reflected the material covered in class.', choices: AGREEMENT_SCALE },
  { key: 'explanations', group: 'instructor-ratings', label: 'The instructor explained complex concepts clearly and effectively.', choices: AGREEMENT_SCALE },
  { key: 'assignmentFeedback', group: 'instructor-ratings', label: 'Feedback on assignments and exams was constructive and returned in a timely manner.', choices: AGREEMENT_SCALE }
];

var COURSE_CATALOGUE = [
  // --- YEAR 1 FALL / SEMESTER 1 (13 Credits) ---
  {
    code: 'ARAB 102',
    title: 'Arabic Language',
    credits: 3,
    year: 'Year 1',
    term: 'Fall',
    semester: 1,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'ENGL 102',
    title: 'English for Academic Writing',
    credits: 3,
    year: 'Year 1',
    term: 'Fall',
    semester: 1,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'GENE 120',
    title: 'Islamic Culture',
    credits: 3,
    year: 'Year 1',
    term: 'Fall',
    semester: 1,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'MATH 100',
    title: 'Mathematics I',
    credits: 4,
    year: 'Year 1',
    term: 'Fall',
    semester: 1,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },

  // --- YEAR 1 SPRING / SEMESTER 2 (13 Credits) ---
  {
    code: 'COMM 105',
    title: 'Public Speaking',
    credits: 3,
    year: 'Year 1',
    term: 'Spring',
    semester: 2,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'MATH 105',
    title: 'Mathematics II',
    credits: 3,
    year: 'Year 1',
    term: 'Spring',
    semester: 2,
    prerequisites: ['MATH 100'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'PHYS 100',
    title: 'Mechanics and Wave Optics',
    credits: 4,
    year: 'Year 1',
    term: 'Spring',
    semester: 2,
    prerequisites: ['MATH 100'],
    corequisites: ['MATH 105'],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 200',
    title: 'Introduction to Computers and Programming',
    credits: 3,
    year: 'Year 1',
    term: 'Spring',
    semester: 2,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },

  // --- YEAR 2 FALL / SEMESTER 3 (18 Credits) ---
  {
    code: 'GENE 210',
    title: 'UAE Studies',
    credits: 3,
    year: 'Year 2',
    term: 'Fall',
    semester: 3,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'PHYS 105',
    title: 'Electromagnetics and Modern Physics',
    credits: 3,
    year: 'Year 2',
    term: 'Fall',
    semester: 3,
    prerequisites: ['PHYS 100'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'EEEN 200',
    title: 'Basic Electrical and Electronics Engineering',
    credits: 4,
    year: 'Year 2',
    term: 'Fall',
    semester: 3,
    prerequisites: ['MATH 100'],
    altPrerequisites: ['MATH 125'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 205',
    title: 'Object-Oriented Programming using Java',
    credits: 4,
    year: 'Year 2',
    term: 'Fall',
    semester: 3,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 215',
    title: 'Data Structures and Algorithms',
    credits: 4,
    year: 'Year 2',
    term: 'Fall',
    semester: 3,
    prerequisites: ['CSCI 200'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },

  // --- YEAR 2 SPRING / SEMESTER 4 (17 Credits) ---
  {
    code: 'MATH 120',
    title: 'Probability and Statistics',
    credits: 3,
    year: 'Year 2',
    term: 'Spring',
    semester: 4,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'MATH 210',
    title: 'Numerical Methods & Optimization',
    credits: 3,
    year: 'Year 2',
    term: 'Spring',
    semester: 4,
    prerequisites: ['MATH 105'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'EEEN 215',
    title: 'Digital Design',
    credits: 4,
    year: 'Year 2',
    term: 'Spring',
    semester: 4,
    prerequisites: ['CSCI 200'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 210',
    title: 'Database Management Systems',
    credits: 4,
    year: 'Year 2',
    term: 'Spring',
    semester: 4,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 300',
    title: 'Operating Systems',
    credits: 3,
    year: 'Year 2',
    term: 'Spring',
    semester: 4,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },

  // --- SEPARATE INTERNSHIP REQUIREMENT I (2 Credits) ---
  {
    code: 'INTE 200',
    title: 'Internship I',
    credits: 2,
    year: 'Year 2',
    term: 'Internship',
    semester: null,
    isInternship: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 45,
    concentration: null,
  },

  // --- YEAR 3 FALL / SEMESTER 5 (18 Credits) ---
  {
    code: 'MATH 110',
    title: 'Mathematics for Technology',
    credits: 3,
    year: 'Year 3',
    term: 'Fall',
    semester: 5,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 305',
    title: 'Computer Architecture and Organization',
    credits: 4,
    year: 'Year 3',
    term: 'Fall',
    semester: 5,
    prerequisites: ['EEEN 215'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 310',
    title: 'Principles of Programming Languages',
    credits: 3,
    year: 'Year 3',
    term: 'Fall',
    semester: 5,
    prerequisites: ['CSCI 205'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 315',
    title: 'Theory of Computation',
    credits: 4,
    year: 'Year 3',
    term: 'Fall',
    semester: 5,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 330',
    title: 'Computer Networks',
    credits: 4,
    year: 'Year 3',
    term: 'Fall',
    semester: 5,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },

  // --- SEPARATE INTERNSHIP REQUIREMENT II (2 Credits) ---
  {
    code: 'INTE 300',
    title: 'Internship II',
    credits: 2,
    year: 'Year 3',
    term: 'Internship',
    semester: null,
    isInternship: true,
    prerequisites: ['INTE 200'],
    corequisites: [],
    minEarnedCredits: 80,
    concentration: null,
  },

  // --- YEAR 3 SPRING / SEMESTER 6 (17 Credits) ---
  {
    code: 'CSCI 320',
    title: 'Analysis and Design of Algorithms',
    credits: 4,
    year: 'Year 3',
    term: 'Spring',
    semester: 6,
    prerequisites: ['CSCI 215'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 335',
    title: 'Software Engineering',
    credits: 3,
    year: 'Year 3',
    term: 'Spring',
    semester: 6,
    prerequisites: ['CSCI 205'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 340',
    title: 'Computer Security and the Internet',
    credits: 3,
    year: 'Year 3',
    term: 'Spring',
    semester: 6,
    prerequisites: ['CSCI 330'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 400',
    title: 'Artificial Intelligence',
    credits: 4,
    year: 'Year 3',
    term: 'Spring',
    semester: 6,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'CSCI 405',
    title: 'Parallel and Distributed Computing',
    credits: 3,
    year: 'Year 3',
    term: 'Spring',
    semester: 6,
    prerequisites: ['CSCI 300'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },

  // --- YEAR 4 FALL / SEMESTER 7 (12 Credits: 1 Core + 3 Electives) ---
  {
    code: 'GENE 440',
    title: 'Ethics and Professional Responsibility',
    credits: 3,
    year: 'Year 4',
    term: 'Fall',
    semester: 7,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },

  // --- YEAR 4 SPRING / SEMESTER 8 (13 Credits: 2 Core + 2 Electives) ---
  {
    code: 'GENE 340',
    title: 'Innovation, Entrepreneurship and Sustainability',
    credits: 3,
    year: 'Year 4',
    term: 'Spring',
    semester: 8,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
  },
  {
    code: 'PROE 400',
    title: 'Senior Design Project',
    credits: 4,
    year: 'Year 4',
    term: 'Spring',
    semester: 8,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 90,
    concentration: null,
  },

  // ==========================================================================
  // CONCENTRATION ELECTIVES: ARTIFICIAL INTELLIGENCE (6 Options, 3 Credits Each)
  // Students choose 5 electives across Semester 7 Fall (3 slots) and Semester 8 Spring (2 slots) = 15 cr
  // ==========================================================================
  {
    code: 'CSCI 410',
    title: 'Digital Image Processing and Computer Vision',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Artificial Intelligence',
  },
  {
    code: 'CSCI 415',
    title: 'AI for Data Analytics',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Artificial Intelligence',
  },
  {
    code: 'CSCI 420',
    title: 'Natural Language Processing',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Artificial Intelligence',
  },
  {
    code: 'CSCI 425',
    title: 'Cognitive Robotics',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Artificial Intelligence',
  },
  {
    code: 'CSCI 430',
    title: 'Machine Learning',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: ['CSCI 215'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Artificial Intelligence',
  },
  {
    code: 'CSCI 435',
    title: 'Neural Networks',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: ['CSCI 215'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Artificial Intelligence',
  },

  // ==========================================================================
  // CONCENTRATION ELECTIVES: CYBERSECURITY (6 Options, 3 Credits Each)
  // Students choose 5 electives across Semester 7 Fall (3 slots) and Semester 8 Spring (2 slots) = 15 cr
  // ==========================================================================
  {
    code: 'CSCI 440',
    title: 'Advanced Networking and Cybersecurity',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: ['CSCI 330'],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Cybersecurity',
  },
  {
    code: 'CSCI 445',
    title: 'Applied Cryptography',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Cybersecurity',
  },
  {
    code: 'CSCI 450',
    title: 'Network Security',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Cybersecurity',
  },
  {
    code: 'CSCI 455',
    title: 'Digital Forensics',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Cybersecurity',
  },
  {
    code: 'CSCI 460',
    title: 'Security Policy, Laws and Governance',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Cybersecurity',
  },
  {
    code: 'CSCI 465',
    title: 'Information Security Management',
    credits: 3,
    year: 'Year 4',
    term: 'Elective',
    semester: null, // Both Year 4 terms share this pool.
    isElective: true,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: 'Cybersecurity',
  },

  // ==========================================================================
  // PRIOR CREDIT COURSES (Non-mandatory / Advanced Placement)
  // ==========================================================================
  {
    code: 'MATH 125',
    title: 'MATH 125 prior credit',
    credits: 0,
    year: 'Foundation',
    term: 'Prior Credit',
    semester: null,
    prerequisites: [],
    corequisites: [],
    minEarnedCredits: 0,
    concentration: null,
    isPriorCreditOnly: true,
  }
];

// ============================================================================
// 3. PARADIGM 1: FUNCTIONAL PROGRAMMING MODULE (CourseFP)
// Pure functions: Deterministic, immutable, zero side-effects.
// Handles credit arithmetic, prerequisite/corequisite validation,
// earned credit aggregation, chronological probation standing recalculation,
// course status classification, and curricular unlock ranking.
// ============================================================================

var CourseFP = (function () {
  'use strict';

  const normalizeCode = (code) => {
    if (!code || typeof code !== 'string') return '';
    return code.trim().toUpperCase().replace(/\s+/g, ' ');
  };

  const codesMatch = (codeA, codeB) => {
    if (!codeA || !codeB) return false;
    const cleanA = String(codeA).trim().toUpperCase().replace(/\s+/g, '');
    const cleanB = String(codeB).trim().toUpperCase().replace(/\s+/g, '');
    return cleanA === cleanB;
  };

  const calculateTotalCredits = (courses) => {
    if (!Array.isArray(courses) || courses.length === 0) return 0;
    return courses.reduce((sum, c) => sum + (c && typeof c.credits === 'number' ? c.credits : 0), 0);
  };

  const calculateRemainingCredits = (creditLimit, courses) => {
    const limit = typeof creditLimit === 'number' && creditLimit >= 0 ? creditLimit : 0;
    const total = calculateTotalCredits(courses);
    return Math.max(0, limit - total);
  };

  const findCourseByCode = (catalogue, code) => {
    if (!Array.isArray(catalogue) || !code) return null;
    return catalogue.find(c => codesMatch(c.code, code)) || null;
  };

  const calculateEarnedCredits = (academicRecords) => {
    if (!Array.isArray(academicRecords) || academicRecords.length === 0) return 0;
    const countedCodes = new Set();
    let totalCredits = 0;

    const finalised = academicRecords.filter(rec => rec && rec.isFinalised);
    for (const record of finalised) {
      if (Array.isArray(record.courses)) {
        for (const entry of record.courses) {
          if (entry && entry.earned === true && entry.code) {
            const clean = entry.code.trim().toUpperCase().replace(/\s+/g, '');
            if (!countedCodes.has(clean)) {
              countedCodes.add(clean);
              totalCredits += (typeof entry.credits === 'number' ? entry.credits : 0);
            }
          }
        }
      }
    }
    return totalCredits;
  };

  const getCompletedCourseCodes = (academicRecords) => {
    if (!Array.isArray(academicRecords)) return [];
    const completedSet = new Set();

    const finalised = academicRecords.filter(rec => rec && rec.isFinalised);
    for (const record of finalised) {
      if (Array.isArray(record.courses)) {
        for (const entry of record.courses) {
          if (entry && entry.earned === true && entry.code) {
            completedSet.add(normalizeCode(entry.code));
          }
        }
      }
    }
    return Array.from(completedSet);
  };

  const getTermOrderKey = (year, term) =>
    PROGRAM_TERMS.find(t => t.year === year && t.term === term)?.order ?? 0;

  const validCgpa = value => value !== null && value !== undefined && String(value).trim() !== '' &&
    Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 4;

  // Count each graded attempt, using the catalogue credits and a single rounding step.
  const calculateCgpa = (records, target, entries, firstGraded = false) => {
    const byTerm = new Map(records.filter(r => r.isFinalised).map(r => [r.year + '_' + r.term, r]));
    byTerm.set(target.key, { courses: entries, firstGraded });
    const terms = PROGRAM_TERMS.filter(t => t.order <= target.order);
    const first = terms.find(t => {
      const record = byTerm.get(t.key);
      return record && !record.ungraded && !record.awaitingResult;
    });
    const startOrder = first && byTerm.get(first.key).firstGraded ? first.order : 1;
    let weightedTenths = 0;
    let credits = 0;
    let note = '';
    let cgpa = null;
    for (const term of terms) {
      const record = byTerm.get(term.key);
      if (term.order < startOrder) continue;
      if (record?.ungraded || (!record && !term.id)) continue;
      if (!record || record.awaitingResult) {
        return { cgpa: null, missingKey: term.key, reason: 'Enter the grades for ' + term.label + ' or record that it was ungraded.' };
      }
      let termCredits = 0;
      for (const row of record.courses || []) {
        const course = findCourseByCode(COURSE_CATALOGUE, row.code);
        if (!course || !LETTER_GRADES.includes(row.grade))
          return { cgpa: null, missingKey: term.key, reason: 'Choose a grade for ' + row.code + ' in ' + term.label + '.' };
        const points = GRADE_SCALE[row.grade].points;
        if (points === null) continue;
        weightedTenths += Math.round(points * 10) * course.credits;
        termCredits += course.credits;
      }
      if (!termCredits) return { cgpa: null, missingKey: term.key, reason: 'Add the graded courses for ' + term.label + '. A calculated CGPA needs at least one A–F grade in a graded term.' };
      credits += termCredits;
      cgpa = Math.round(weightedTenths * 10 / credits) / 100;
      if (record.cgpaSource !== 'calculated' && validCgpa(record.cgpa) && cgpa !== Number(record.cgpa)) {
        note = 'Check your course history. For ' + term.label + ' the entered grades give ' +
          cgpa.toFixed(2) + ' and your saved official CGPA is ' + Number(record.cgpa).toFixed(2) + '.';
      }
    }
    return { cgpa, credits, note };
  };

  // A missing regular term breaks the known sequence. Internships count only when graded.
  // Each standing needs at most the immediately preceding graded result.
  const calculateStandingHistory = (records = [], regularLimit = 15) => {
    const byTerm = new Map(records.filter(r => r && r.isFinalised).map(r => [r.year + '_' + r.term, r]));
    const history = [];
    let previous = null;
    let missingTerm = null;
    for (const term of PROGRAM_TERMS) {
      const record = byTerm.get(term.key);
      if (!record || !validCgpa(record.cgpa)) {
        if (term.id && !record?.ungraded) missingTerm = term;
        continue;
      }
      const cgpa = Number(record.cgpa);
      let standing = 'Good Standing';
      let creditLimit = regularLimit;
      let unresolved = null;
      if (cgpa < 2) {
        if (missingTerm && !(record.firstGraded && !previous)) {
          standing = 'Standing pending';
          creditLimit = 0;
          unresolved = missingTerm;
        } else {
          const repeat = previous !== null && previous.cgpa < 2;
          standing = repeat ? 'Academic Probation 2' : 'Academic Probation 1';
          creditLimit = repeat ? 9 : 12;
        }
      }
      previous = { ...record, cgpa, standing, creditLimit, missingTerm: unresolved, isPending: !!unresolved };
      history.push(previous);
      missingTerm = null;
    }
    return history;
  };

  const getLatestStanding = (records = [], regularLimit = 15, currentSemester = 1) => {
    const latest = calculateStandingHistory(records, regularLimit).pop();
    // A completed student's most recent regular term can itself be missing.
    const latestOrder = latest ? getTermOrderKey(latest.year, latest.term) : 0;
    const incomplete = records.find(r => r.isFinalised && r.cgpaSource === 'calculated' && r.cgpa == null &&
      getTermOrderKey(r.year, r.term) > latestOrder);
    if (incomplete) return { standing: 'Standing pending', creditLimit: 0, cgpa: null, isPending: true,
      missingTerm: PROGRAM_TERMS.find(t => t.key === incomplete.missingGradeTerm) };
    const missing = SEMESTER_CONFIG.filter(term => term.id < currentSemester && term.id > latestOrder)
      .reverse().find(term => !records.some(r => r.year === term.year && r.term === term.term && r.isFinalised && r.ungraded));
    if (missing) return { standing: 'Standing pending', creditLimit: 0, cgpa: latest?.cgpa ?? null,
      isPending: true, missingTerm: PROGRAM_TERMS.find(t => t.id === missing.id) };
    return latest || { standing: 'No CGPA yet', creditLimit: regularLimit, cgpa: null, isPending: false };
  };

  const isCourseEligible = (...args) => getMissingRequirements(...args).length === 0;

  /**
   * Pure Function: Returns detailed human-readable explanation of missing requirements.
   */
  const getMissingRequirements = (course, completedCodes = [], plannedCodes = [], earnedCredits = 0, priorCredits = [], concentration = null) => {
    if (!course) return ['Invalid course reference'];
    const issues = [];
    const allSatisfied = new Set([...completedCodes, ...priorCredits].map(c => normalizeCode(c)));
    const plannedSet = new Set(plannedCodes.map(c => normalizeCode(c)));

    if (course.isPriorCreditOnly) issues.push('Record this prior credit in your profile.');
    if (course.concentration && !concentration) issues.push('Choose a Year 4 concentration in your profile.');
    if (course.concentration && concentration && course.concentration !== concentration) {
      issues.push(`Restricted to ${course.concentration} concentration (enrolled in ${concentration})`);
    }

    if (Array.isArray(course.prerequisites) && course.prerequisites.length > 0) {
      const unmet = course.prerequisites.filter(p => !allSatisfied.has(normalizeCode(p)));
      if (unmet.length > 0) {
        if (Array.isArray(course.altPrerequisites) && course.altPrerequisites.length > 0) {
          const altMet = course.altPrerequisites.some(alt => allSatisfied.has(normalizeCode(alt)));
          if (!altMet) {
            issues.push(`Requires prerequisite ${unmet.join(', ')} (or alternative ${course.altPrerequisites.join(', ')})`);
          }
        } else {
          issues.push(`Requires prerequisite(s): ${unmet.join(', ')}`);
        }
      }
    }

    if (Array.isArray(course.corequisites) && course.corequisites.length > 0) {
      for (const coreq of course.corequisites) {
        const clean = normalizeCode(coreq);
        if (!allSatisfied.has(clean) && !plannedSet.has(clean)) {
          issues.push(`Requires corequisite ${coreq} (must be in plan or completed)`);
        }
      }
    }

    if (typeof course.minEarnedCredits === 'number' && course.minEarnedCredits > 0) {
      if (earnedCredits < course.minEarnedCredits) {
        issues.push(`Requires at least ${course.minEarnedCredits} earned credits (currently: ${earnedCredits} earned)`);
      }
    }

    return issues;
  };

  const findUnlockedCourses = (courseCode, catalogue, completedCodes, concentration = null) => {
    if (!courseCode || !Array.isArray(catalogue)) return [];
    const completedSet = new Set(completedCodes.map(c => normalizeCode(c)));

    return catalogue.filter(c => {
      if (c.isPriorCreditOnly) return false;
      if (completedSet.has(normalizeCode(c.code))) return false;
      if (codesMatch(c.code, courseCode)) return false;
      if (c.concentration && concentration && c.concentration !== concentration) return false;

      return Array.isArray(c.prerequisites) && c.prerequisites.some(p => codesMatch(p, courseCode));
    });
  };

  const validatePlanIntegrity = (plannedCourses, completedCodes, creditLimit, earnedCredits = 0, priorCredits = [], concentration = null) => {
    if (!Array.isArray(plannedCourses)) return [];

    const completedSet = new Set(completedCodes.map(c => normalizeCode(c)));
    const plannedCodes = plannedCourses.map(c => normalizeCode(c.code));
    const issues = [];
    let cumulativeCredits = 0;

    for (const course of plannedCourses) {
      const codeClean = normalizeCode(course.code);

      if (completedSet.has(codeClean)) {
        issues.push({
          course: course,
          issueType: 'ALREADY_COMPLETED',
          reason: `Course ${course.code} is marked as completed in your academic record.`,
          resolution: `Remove ${course.code} from your plan.`
        });
      }

      const missing = getMissingRequirements(course, completedCodes, plannedCodes, earnedCredits, priorCredits, concentration);
      if (missing.length > 0) {
        issues.push({
          course: course,
          issueType: 'REQUIREMENTS_UNSATISFIED',
          reason: `Registration requirement not met for ${course.code}: ${missing.join('; ')}.`,
          resolution: `Complete requirements first or remove ${course.code} from your plan.`
        });
      }

      cumulativeCredits += course.credits;
    }

    if (cumulativeCredits > creditLimit) {
      const excess = cumulativeCredits - creditLimit;
      issues.push({
        course: null,
        issueType: 'CREDIT_LIMIT_EXCEEDED',
        excessCredits: excess,
        plannedCredits: cumulativeCredits,
        creditLimit: creditLimit,
        reason: `Total planned credits (${cumulativeCredits}) exceed your allowed limit (${creditLimit}) by ${excess} credit(s).`,
        resolution: `Remove ${excess} credit(s) from your plan before registration can be confirmed.`
      });
    }

    return issues;
  };

  return {
    normalizeCode: normalizeCode,
    codesMatch: codesMatch,
    calculateTotalCredits: calculateTotalCredits,
    calculateRemainingCredits: calculateRemainingCredits,
    findCourseByCode: findCourseByCode,
    calculateEarnedCredits: calculateEarnedCredits,
    getCompletedCourseCodes: getCompletedCourseCodes,
    getTermOrderKey: getTermOrderKey,
    calculateStandingHistory: calculateStandingHistory,
    calculateCgpa: calculateCgpa,
    getLatestStanding: getLatestStanding,
    isCourseEligible: isCourseEligible,
    getMissingRequirements: getMissingRequirements,
    findUnlockedCourses: findUnlockedCourses,
    validatePlanIntegrity: validatePlanIntegrity
  };
})();

// ============================================================================
// 4. PARADIGM 2: OBJECT-ORIENTED PROGRAMMING MODULE (SemesterPlan Class)
// Encapsulates semester plan state, enforces probation credit caps,
// validates corequisites, handles additions/removals, and serializes state.
// ============================================================================

var SemesterPlan = class SemesterPlan {
  constructor(creditLimit = 15, initialCourses = [], standing = 'Good Standing', semester = null) {
    this._creditLimit = typeof creditLimit === 'number' && creditLimit >= 0 ? creditLimit : 15;
    this._standing = standing;
    this.semester = semester;
    this._courses = Array.isArray(initialCourses) ? [...initialCourses] : [];
  }

  get creditLimit() {
    return this._creditLimit;
  }

  set creditLimit(newLimit) {
    if (typeof newLimit === 'number' && newLimit >= 0) {
      this._creditLimit = newLimit;
    }
  }

  setCreditLimit(newLimit) {
    this.creditLimit = newLimit;
  }

  get standing() {
    return this._standing;
  }

  set standing(val) {
    this._standing = val;
  }

  setStanding(val) {
    this._standing = val;
  }

  getPlannedCourses() {
    return [...this._courses];
  }

  getPlannedCodes() {
    return this._courses.map(c => c.code);
  }

  getTotalCredits() {
    return CourseFP.calculateTotalCredits(this._courses);
  }

  getRemainingCredits() {
    return CourseFP.calculateRemainingCredits(this._creditLimit, this._courses);
  }

  canAdd(course, completedCodes = [], earnedCredits = 0, priorCredits = [], concentration = null) {
    if (!course || typeof course.code !== 'string') {
      return { canAdd: false, reason: 'Invalid course reference.', details: {} };
    }

    const codeClean = CourseFP.normalizeCode(course.code);
    const completedSet = new Set(completedCodes.map(c => CourseFP.normalizeCode(c)));

    // Rule 1: Prevent duplicate completed courses
    if (completedSet.has(codeClean)) {
      return {
        canAdd: false,
        reason: `${course.code} is already completed with credit earned in your academic record. You cannot re-take a completed course.`,
        details: { code: 'ALREADY_COMPLETED' }
      };
    }

    // Rule 2: Prevent duplicate in current plan
    if (this._courses.some(c => CourseFP.codesMatch(c.code, course.code))) {
      return {
        canAdd: false,
        reason: `${course.code} is already in your current semester plan. Duplicate registration is prevented.`,
        details: { code: 'DUPLICATE' }
      };
    }

    if (this._standing === 'Standing pending') {
      return { canAdd: false, reason: 'Enter the missing term result in Academic Record to establish your credit limit.',
        details: { code: 'STANDING_PENDING' } };
    }
    // Rule 4: Academic eligibility
    const currentPlannedCodes = this.getPlannedCodes();
    const missing = CourseFP.getMissingRequirements(course, completedCodes, currentPlannedCodes, earnedCredits, priorCredits, concentration);
    if (missing.length > 0) {
      return {
        canAdd: false,
        reason: `${course.code} cannot be added: ${missing.join('; ')}.`,
        details: { code: 'MISSING_REQUIREMENTS', missing: missing }
      };
    }

    if (course.isElective && this.electiveQuotaReached(completedCodes, concentration)) {
      const slots = this.semester === 7 ? 3 : 2;
      return { canAdd: false, reason: 'The programme allows ' + slots + ' electives this semester and five in your concentration overall. All applicable slots are filled.',
        details: { code: 'ELECTIVE_LIMIT' } };
    }

    // Rule 5: Credit limit / Probation cap
    const remaining = this.getRemainingCredits();
    if (course.credits > remaining) {
      const current = this.getTotalCredits();
      const wouldBe = current + course.credits;
      return {
        canAdd: false,
        reason: `Adding ${course.code} (${course.credits} cr) would bring your plan to ${wouldBe} cr, above your ${this._standing} limit of ${this._creditLimit} cr.`,
        details: { code: 'EXCEEDS_CREDIT_LIMIT', needed: course.credits, current: current, wouldBe: wouldBe, limit: this._creditLimit, standing: this._standing }
      };
    }

    return {
      canAdd: true,
      reason: `${course.code} is eligible and fits within your ${this._standing} limit.`,
      details: { remainingAfter: remaining - course.credits }
    };
  }

  addCourse(course, completedCodes = [], earnedCredits = 0, priorCredits = [], concentration = null) {
    const check = this.canAdd(course, completedCodes, earnedCredits, priorCredits, concentration);
    if (!check.canAdd) {
      return { success: false, reason: check.reason };
    }

    this._courses.push(course);
    return {
      success: true,
      reason: `Successfully added ${course.code} (${course.title}) to your semester plan.`
    };
  }

  removeCourse(courseCode) {
    if (!courseCode) {
      return { success: false, reason: 'Course code required for removal.' };
    }

    const index = this._courses.findIndex(c => CourseFP.codesMatch(c.code, courseCode));
    if (index === -1) {
      return { success: false, reason: `Course ${courseCode} was not found in your semester plan.` };
    }

    const [removed] = this._courses.splice(index, 1);
    return {
      success: true,
      course: removed,
      reason: `Removed ${removed.code} (${removed.title}) from your semester plan.`
    };
  }

  validateIntegrity(completedCodes, earnedCredits = 0, priorCredits = [], concentration = null) {
    const issues = CourseFP.validatePlanIntegrity(this._courses, completedCodes, this._creditLimit, earnedCredits, priorCredits, concentration);
    if (this.electiveQuotaReached(completedCodes, concentration, true)) {
      issues.push({ reason: 'Remove a concentration elective to fit the Year 4 elective slots.' });
    }
    return issues;
  }

  electiveQuotaReached(completedCodes, concentration, excessOnly = false) {
    if (!this.semester) return false;
    const planned = this._courses.filter(c => c.isElective && c.concentration === concentration);
    if (excessOnly && !planned.length) return false;
    const inTrack = code => CourseFP.findCourseByCode(COURSE_CATALOGUE, code)?.concentration === concentration && !!concentration;
    const completed = completedCodes.filter(inTrack);
    const thisTerm = (this.completedThisTerm || []).filter(inTrack);
    const slots = this.semester === 7 ? 3 : this.semester === 8 ? 2 : 0;
    const buffer = excessOnly ? 1 : 0;
    const plannedCodes = planned.map(c => c.code);
    return new Set([...thisTerm, ...plannedCodes]).size >= slots + buffer ||
      new Set([...completed, ...plannedCodes]).size >= 5 + buffer;
  }

  clear() {
    this._courses = [];
  }

  serialize() {
    return this._courses.map(c => c.code);
  }

  static deserialize(codes, creditLimit, standing, catalogue, semester) {
    const plan = new SemesterPlan(creditLimit, [], standing, semester);
    if (Array.isArray(codes)) {
      for (const code of codes) {
        const course = CourseFP.findCourseByCode(catalogue, code);
        if (course && !plan._courses.includes(course)) {
          plan._courses.push(course);
        }
      }
    }
    return plan;
  }
};

// ============================================================================
// 5. STORAGE & APPLICATION STATE CONTROLLER (SmartApp)
// Manages authentication, multi-student partitions, drafts, academic records,
// planner synchronization, advising feedback, and DOM updates.
// ============================================================================

var STORAGE_KEYS = {
  REGISTRY: 'csci310_students_registry_v4',
  SESSION: 'csci310_current_session_v4',
  DATA_PREFIX: 'csci310_student_data_v4_'
};

var SmartApp = (function () {
  'use strict';

  let currentStudent = null;
  const emptyData = () => ({ academicRecords: [], drafts: {}, savedPlan: [], plans: {}, priorCredits: [], feedbackList: [] });
  let studentData = emptyData();
  let planInstance = new SemesterPlan();

  // Initial seed students for immediate presentation demonstration
  const DEFAULT_STUDENTS = [
    {
      internalId: 'stu_fatima_sem3_001',
      fullName: 'Fatima Al Blooshi',
      audId: 'AUD-2024-001',
      passwordHash: sha256('AUD-2024-001'),
      currentSemester: 3,
      concentration: null, // Semesters 1-6 have no concentration
      regularCreditLimit: 15,
      priorCredits: [],
      academicRecords: [
        {
          recordId: 'rec_fatima_sem1',
          year: 'Year 1',
          term: 'Fall',
          cgpa: 3.40,
          isFinalised: true,
          courses: [
            { code: 'ARAB 102', title: 'Arabic Language', credits: 3, grade: 'A', earned: true },
            { code: 'ENGL 102', title: 'English for Academic Writing', credits: 3, grade: 'A-', earned: true },
            { code: 'GENE 120', title: 'Islamic Culture', credits: 3, grade: 'B+', earned: true },
            { code: 'MATH 100', title: 'Mathematics I', credits: 4, grade: 'A', earned: true }
          ]
        },
        {
          recordId: 'rec_fatima_sem2',
          year: 'Year 1',
          term: 'Spring',
          cgpa: 3.52,
          isFinalised: true,
          courses: [
            { code: 'COMM 105', title: 'Public Speaking', credits: 3, grade: 'A', earned: true },
            { code: 'MATH 105', title: 'Mathematics II', credits: 3, grade: 'B+', earned: true },
            { code: 'PHYS 100', title: 'Mechanics and Wave Optics', credits: 4, grade: 'A', earned: true },
            { code: 'CSCI 200', title: 'Introduction to Computers and Programming', credits: 3, grade: 'A', earned: true }
          ]
        }
      ],
      drafts: {},
      savedPlan: ['CSCI 205', 'CSCI 215', 'EEEN 200'],
      feedbackList: []
    },
    {
      internalId: 'stu_fatima_cyber_002',
      fullName: 'Fatima Al Blooshi',
      audId: 'AUD-2024-002',
      passwordHash: sha256('AUD-2024-002'),
      currentSemester: 7,
      concentration: 'Cybersecurity', // Semesters 7-8 require concentration
      regularCreditLimit: 15,
      priorCredits: [],
      academicRecords: [],
      drafts: {},
      savedPlan: ['GENE 440', 'CSCI 440'],
      feedbackList: []
    },
    {
      internalId: 'stu_omar_probation_003',
      fullName: 'Omar Al Hashimi',
      audId: 'AUD-2024-003',
      passwordHash: sha256('AUD-2024-003'),
      currentSemester: 2,
      concentration: null,
      regularCreditLimit: 15,
      priorCredits: [],
      previousSemesterStatus: 'first_graded',
      academicRecords: [
        {
          recordId: 'rec_omar_sem1',
          year: 'Year 1',
          term: 'Fall',
          cgpa: 1.85,
          isFinalised: true,
          courses: [
            { code: 'ARAB 102', title: 'Arabic Language', credits: 3, grade: 'C', earned: true },
            { code: 'ENGL 102', title: 'English for Academic Writing', credits: 3, grade: 'C+', earned: true },
            { code: 'GENE 120', title: 'Islamic Culture', credits: 3, grade: 'B', earned: true },
            { code: 'MATH 100', title: 'Mathematics I', credits: 4, grade: 'F', earned: false }
          ]
        }
      ],
      drafts: {},
      savedPlan: ['COMM 105', 'CSCI 200', 'GENE 210'],
      feedbackList: []
    },
    {
      internalId: 'stu_layla_sem6_004',
      fullName: 'Layla Al Mansoori',
      audId: 'AUD-2024-004',
      passwordHash: sha256('AUD-2024-004'),
      currentSemester: 6,
      concentration: null, // Ready for testing Semester 6 -> 7 advancement
      regularCreditLimit: 15,
      priorCredits: [],
      academicRecords: [
        {
          recordId: 'rec_layla_sem1',
          year: 'Year 1',
          term: 'Fall',
          cgpa: 3.20,
          isFinalised: true,
          courses: [
            { code: 'ARAB 102', title: 'Arabic Language', credits: 3, grade: 'A', earned: true },
            { code: 'ENGL 102', title: 'English for Academic Writing', credits: 3, grade: 'B+', earned: true },
            { code: 'GENE 120', title: 'Islamic Culture', credits: 3, grade: 'A', earned: true },
            { code: 'MATH 100', title: 'Mathematics I', credits: 4, grade: 'B', earned: true }
          ]
        }
      ],
      drafts: {},
      savedPlan: ['CSCI 320', 'CSCI 335', 'CSCI 400'],
      feedbackList: []
    },
    {
      internalId: 'stu_khalid_new_sem1_005',
      fullName: 'Khalid Al Marzouqi',
      audId: 'AUD-2024-005',
      passwordHash: sha256('AUD-2024-005'),
      currentSemester: 1,
      concentration: null,
      regularCreditLimit: 15,
      priorCredits: [],
      academicRecords: [], // Semester 1 new student with "No CGPA yet"
      drafts: {},
      savedPlan: [],
      feedbackList: []
    }
  ];

  const registry = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRY) || '[]');
  const writeRegistry = entries => localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify(entries));
  const dataKey = id => STORAGE_KEYS.DATA_PREFIX + id;
  const readStudentData = id => JSON.parse(localStorage.getItem(dataKey(id)) || '{}');
  const newFeedbackId = () => globalThis.crypto?.randomUUID?.() ?? 'fb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
  const cleanName = value => value.trim().replace(/\s+/g, ' ').toLowerCase();
  const validTrack = value => ['Artificial Intelligence', 'Cybersecurity'].includes(value);

  function seed(entries, demo) {
    const { internalId, fullName, passwordHash, currentSemester, concentration, regularCreditLimit } = demo;
    entries.push({ internalId, fullName, passwordHash, currentSemester, concentration, regularCreditLimit });
    const { academicRecords, savedPlan, feedbackList } = demo;
    localStorage.setItem(dataKey(internalId), JSON.stringify({ ...emptyData(), academicRecords, savedPlan, feedbackList }));
  }

  function initStorage() {
    const stored = localStorage.getItem(STORAGE_KEYS.REGISTRY);
    const entries = registry();
    if (!stored) {
      DEFAULT_STUDENTS.forEach(demo => seed(entries, demo));
      writeRegistry(entries);
    } else if (entries.some(s => 'audId' in s)) {
      writeRegistry(entries.map(({ audId, ...student }) => ({
        ...student, passwordHash: audId ? sha256(audId) : student.passwordHash,
        concentration: student.currentSemester < 7 ? null : student.concentration
      })));
    }
  }

  function getContext() {
    const records = studentData.academicRecords.filter(record =>
      CourseFP.getTermOrderKey(record.year, record.term) <= currentStudent.currentSemester);
    return {
      standing: CourseFP.getLatestStanding(records, currentStudent.regularCreditLimit, currentStudent.currentSemester),
      completed: CourseFP.getCompletedCourseCodes(records),
      earned: CourseFP.calculateEarnedCredits(records),
      prior: studentData.priorCredits,
      track: currentStudent.concentration
    };
  }

  function synchronizePlanWithStanding() {
    const { standing } = getContext();
    planInstance = SemesterPlan.deserialize(studentData.savedPlan, standing.creditLimit, standing.standing,
      COURSE_CATALOGUE, currentStudent.currentSemester);
    planInstance.completedThisTerm = CourseFP.getCompletedCourseCodes(studentData.academicRecords.filter(record =>
      CourseFP.getTermOrderKey(record.year, record.term) === currentStudent.currentSemester));
  }

  function saveStudentData() {
    // Keep feedback edits and deletions from other tabs when saving a plan or record.
    const stored = readStudentData(currentStudent.internalId);
    studentData.feedbackList = stored.feedbackList || [];
    studentData.closedFeedbackCourses = stored.closedFeedbackCourses || [];
    for (const entry of studentData.feedbackList) {
      if (!entry.id) entry.id = newFeedbackId();
    }
    studentData.plans[currentStudent.currentSemester] = studentData.savedPlan;
    localStorage.setItem(dataKey(currentStudent.internalId), JSON.stringify(studentData));
  }

  function openAccount(student) {
    const data = { ...emptyData(), ...readStudentData(student.internalId) };
    // Move records from the previous quick-setup screen back into the editable term draft.
    for (const record of data.academicRecords.filter(r => !r.isFinalised)) {
      const key = record.year + '_' + record.term;
      if (!data.drafts[key]) data.drafts[key] = record;
    }
    data.academicRecords = data.academicRecords.filter(r => r.isFinalised);
    // Bind a legacy preceding-result answer to the term it described.
    if (data.previousSemesterStatus && data.academicRecords.length === 1) {
      const record = data.academicRecords[0];
      const prior = data.previousSemesterStatus;
      const preceding = PROGRAM_TERMS.filter(t => t.id && t.order < CourseFP.getTermOrderKey(record.year, record.term)).pop();
      if (prior === 'first_graded' || prior.type === 'first_graded') record.firstGraded = true;
      if (preceding && prior.type === 'cgpa' && Number.isFinite(prior.value) && prior.value >= 0 && prior.value <= 4) {
        data.academicRecords.push({ year: preceding.year, term: preceding.term, cgpa: prior.value, courses: [], isFinalised: true });
      }
    }
    delete data.previousSemesterStatus;
    currentStudent = student;
    studentData = data;
    synchronizePlanWithStanding();
    saveStudentData();
    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ internalId: student.internalId }));
    return { success: true, student };
  }

  function restoreSession() {
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION) || localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    const student = session && registry().find(s => s.internalId === session.internalId);
    if (student) openAccount(student);
    return !!student;
  }

  function login(fullName, audId) {
    initStorage();
    const hash = sha256(audId.trim());
    const match = registry().find(s => cleanName(s.fullName) === cleanName(fullName) && s.passwordHash === hash);
    return match ? openAccount(match) : { success: false, reason: 'Check your full name and AUD ID.' };
  }

  function register(fullName, audId, semester, concentration = null) {
    initStorage();
    const full = fullName.trim().replace(/\s+/g, ' ');
    const id = audId.trim();
    const currentSemester = Number(semester);
    if (!full || !id) return { success: false, reason: 'Enter a full name and AUD ID.' };
    if (!Number.isInteger(currentSemester) || currentSemester < 1 || currentSemester > 8)
      return { success: false, reason: 'Choose a semester from 1 to 8.' };
    if (currentSemester >= 7 && !validTrack(concentration))
      return { success: false, reason: 'Choose your Year 4 concentration.' };
    const entries = registry();
    const passwordHash = sha256(id);
    if (entries.some(s => cleanName(s.fullName) === cleanName(full) && s.passwordHash === passwordHash))
      return { success: false, reason: 'This account already exists. Use Returning student to sign in.' };
    const student = {
      internalId: 'stu_' + sha256(JSON.stringify([cleanName(full), id])),
      fullName: full, passwordHash, currentSemester, regularCreditLimit: 15,
      concentration: currentSemester >= 7 ? concentration : null
    };
    writeRegistry([...entries, student]);
    return openAccount(student);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    currentStudent = null;
    studentData = emptyData();
    planInstance = new SemesterPlan();
  }

  function updateProfileSettings(concentration, regularCreditLimit, priorCredits, semester) {
    if (!currentStudent || !Number.isInteger(semester) || semester < 1 || semester > 8 ||
        !Number.isInteger(regularCreditLimit) || regularCreditLimit < 1 || regularCreditLimit > 30)
      return { success: false, reason: 'Choose a valid semester and regular credit limit (1–30).' };
    if (semester >= 7 && !validTrack(concentration))
      return { success: false, reason: 'Choose your concentration before entering Year 4.' };
    if (semester !== currentStudent.currentSemester) {
      studentData.plans[currentStudent.currentSemester] = studentData.savedPlan;
      studentData.savedPlan = studentData.plans[semester] || [];
    }
    currentStudent = { ...currentStudent, currentSemester: semester, regularCreditLimit,
      concentration: semester >= 7 ? concentration : null };
    studentData.priorCredits = priorCredits.includes('MATH 125') ? ['MATH 125'] : [];
    writeRegistry(registry().map(s => s.internalId === currentStudent.internalId ? currentStudent : s));
    saveStudentData();
    synchronizePlanWithStanding();
    return { success: true };
  }

  function saveTermRecord(year, term, cgpa, courses, isFinalised = false, options = {}) {
    const termInfo = PROGRAM_TERMS.find(t => t.year === year && t.term === term);
    if (!currentStudent || !termInfo || termInfo.order > currentStudent.currentSemester)
      return { success: false, reason: 'Select a term up to your current semester.' };
    const ungraded = !!options.ungraded;
    const calculated = options.cgpaSource === 'calculated' && !ungraded;
    let numeric = calculated || ungraded || cgpa == null || String(cgpa).trim() === '' ? null : Number(cgpa);
    if (numeric !== null && (!Number.isFinite(numeric) || numeric < 0 || numeric > 4))
      return { success: false, reason: 'Enter an official cumulative GPA between 0.00 and 4.00.' };
    if (isFinalised && numeric === null && !ungraded && !calculated)
      return { success: false, reason: 'Enter the official cumulative GPA for this graded term.' };
    const seen = new Set();
    const entries = [];
    for (const row of courses) {
      const course = CourseFP.findCourseByCode(COURSE_CATALOGUE, row.code);
      if (!course || course.isPriorCreditOnly || seen.has(course.code) ||
          (!LETTER_GRADES.includes(row.grade) && (isFinalised || row.grade !== '')))
        return { success: false, reason: 'Select each course once and choose its grade.' };
      if (ungraded && row.grade && GRADE_SCALE[row.grade].points !== null)
        return { success: false, reason: 'Enter a CGPA or calculate it from the grades for this term.' };
      seen.add(course.code);
      entries.push({ code: course.code, title: course.title, credits: course.credits,
        grade: row.grade, earned: GRADE_SCALE[row.grade]?.earned === true });
    }
    if (calculated) {
      const result = CourseFP.calculateCgpa(studentData.academicRecords, termInfo, entries, options.firstGraded);
      if (isFinalised && result.cgpa === null) return { success: false, reason: result.reason };
      numeric = result.cgpa;
    }
    const awaitingResult = ungraded && termInfo.id === 1 && currentStudent.currentSemester === 1;
    const record = { year, term, cgpa: ungraded ? null : numeric, courses: entries, ungraded: ungraded && !awaitingResult, awaitingResult,
      firstGraded: !!options.firstGraded, cgpaSource: calculated ? 'calculated' : 'manual', isFinalised, recordId: termInfo.key };
    if (isFinalised) {
      studentData.academicRecords = studentData.academicRecords.filter(r => r.year !== year || r.term !== term).concat(record);
      // An earlier grade edit affects subsequent calculated results, including their standing.
      for (const later of studentData.academicRecords) {
        if (later.cgpaSource !== 'calculated' || CourseFP.getTermOrderKey(later.year, later.term) <= termInfo.order) continue;
        const target = PROGRAM_TERMS.find(t => t.year === later.year && t.term === later.term);
        const result = CourseFP.calculateCgpa(studentData.academicRecords, target, later.courses, later.firstGraded);
        later.cgpa = result.cgpa;
        later.missingGradeTerm = result.missingKey;
      }
      delete studentData.drafts[termInfo.key];
    } else {
      studentData.drafts[termInfo.key] = record;
    }
    saveStudentData();
    synchronizePlanWithStanding();
    return { success: true };
  }

  function evaluateCourseEligibility(code, context = getContext()) {
    const course = CourseFP.findCourseByCode(COURSE_CATALOGUE, code);
    const { completed, earned, prior, track, standing } = context;
    const decision = planInstance.canAdd(course, completed, earned, prior, track);
    if (decision.details.code === 'STANDING_PENDING') {
      decision.reason = 'Enter the ' + standing.missingTerm.label + ' result in Academic Record to calculate your limit.';
      const missing = CourseFP.getMissingRequirements(course, completed, planInstance.getPlannedCodes(), earned, prior, track);
      if (missing.length) decision.reason += ' ' + missing.join('. ') + '.';
    }
    return decision;
  }

  function changePlan(code, remove = false) {
    const { completed, earned, prior, track } = getContext();
    const course = CourseFP.findCourseByCode(COURSE_CATALOGUE, code);
    const decision = remove ? planInstance.removeCourse(code) : planInstance.addCourse(course, completed, earned, prior, track);
    if (decision.success) {
      studentData.savedPlan = planInstance.serialize();
      saveStudentData();
    }
    return decision;
  }

  function savePlan() {
    const { completed, earned, prior, track, standing } = getContext();
    const issues = planInstance.validateIntegrity(completed, earned, prior, track);
    if (standing.isPending || issues.length || !planInstance.getPlannedCodes().length)
      return { success: false, reason: issues[0]?.reason || 'Resolve the missing result and select a course before saving.' };
    saveStudentData();
    return { success: true, reason: 'Plan saved for Semester ' + currentStudent.currentSemester + '.' };
  }

  function saveFeedbackList(stored, list) {
    localStorage.setItem(dataKey(currentStudent.internalId), JSON.stringify({ ...stored, feedbackList: list }));
    studentData.feedbackList = list;
    studentData.closedFeedbackCourses = stored.closedFeedbackCourses || [];
  }

  function getFeedbackCourses(stored = studentData) {
    if (!currentStudent) return [];
    const taken = new Set();
    for (const record of stored.academicRecords || []) {
      if (!record.isFinalised || CourseFP.getTermOrderKey(record.year, record.term) > currentStudent.currentSemester) continue;
      for (const attempt of record.courses || []) {
        if (!LETTER_GRADES.includes(attempt.grade) || ['W', 'WF', 'TR', 'CX'].includes(attempt.grade)) continue;
        const course = CourseFP.findCourseByCode(COURSE_CATALOGUE, attempt.code);
        if (course && !course.isPriorCreditOnly) taken.add(course);
      }
    }
    const used = [...(stored.closedFeedbackCourses || []), ...(stored.feedbackList || []).map(f => f.termCourse)];
    return Array.from(taken, course => ({ code: course.code, title: course.title,
      reviewed: used.some(code => CourseFP.codesMatch(code, course.code)) }));
  }

  function submitFeedback(termCourse, workloadRating, difficulties, usefulAnswer, feedbackText, answers = {}, editId = null) {
    const workload = Number(workloadRating);
    if (!currentStudent || typeof termCourse !== 'string' || !termCourse.trim() || !Number.isInteger(workload) || workload < 1 || workload > 5 ||
        !['Yes', 'Partly', 'No'].includes(usefulAnswer))
      return { success: false, reason: 'Choose a course, a workload rating and an advice rating.' };
    if (!Array.isArray(difficulties) || !difficulties.length || difficulties.some(d => !FEEDBACK_DIFFICULTIES.includes(d)))
      return { success: false, reason: 'Select at least one difficulty or choose None.' };
    if (difficulties.includes('None') && difficulties.length > 1)
      return { success: false, reason: 'Choose either None or the difficulties you experienced.' };
    const responses = {};
    for (const question of FEEDBACK_QUESTIONS) {
      const answer = answers?.[question.key];
      if (!question.choices.includes(answer))
        return { success: false, reason: 'Choose an answer for “' + question.label + '”' };
      responses[question.key] = answer;
    }
    if (typeof feedbackText !== 'string' || !feedbackText.trim())
      return { success: false, reason: 'Write a response to the improvement question.' };
    const stored = readStudentData(currentStudent.internalId);
    const list = stored.feedbackList || [];
    const course = getFeedbackCourses(stored).find(c => CourseFP.codesMatch(c.code, termCourse));
    if (!course) return { success: false, reason: 'You can review only a course you took in your saved academic record.' };
    const fields = { responses, termCourse: course.code, workloadRating: workload, difficulties, advisingUseful: usefulAnswer, feedbackText: feedbackText.trim() };
    let feedback;
    if (editId === null) {
      if (course.reviewed) return { success: false, reason: 'You have already submitted feedback for ' + course.code + '. Each course can be reviewed once.' };
      feedback = { ...fields, id: newFeedbackId(), studentId: currentStudent.internalId,
        semesterNumber: currentStudent.currentSemester, submittedAt: new Date().toISOString() };
      list.unshift(feedback);
    } else {
      const index = list.findIndex(entry => entry.id === editId);
      if (index < 0) return { success: false, reason: 'This feedback is no longer available to edit.' };
      if (!CourseFP.codesMatch(list[index].termCourse, course.code))
        return { success: false, reason: 'An existing review must stay with its original course.' };
      feedback = { ...list[index], ...fields };
      list[index] = feedback;
    }
    saveFeedbackList(stored, list);
    return { success: true, feedback };
  }

  function deleteFeedback(id) {
    if (!currentStudent || !id) return { success: false, reason: 'Select feedback from your account.' };
    const stored = readStudentData(currentStudent.internalId);
    const list = stored.feedbackList || [];
    const index = list.findIndex(entry => entry.id === id);
    if (index < 0) return { success: false, reason: 'This feedback is no longer available to delete.' };
    const [removed] = list.splice(index, 1);
    const course = CourseFP.findCourseByCode(COURSE_CATALOGUE, removed.termCourse);
    if (course) stored.closedFeedbackCourses = [...new Set([...(stored.closedFeedbackCourses || []), course.code])];
    saveFeedbackList(stored, list);
    return { success: true };
  }

  function resetDemoData() {
    logout();
    const entries = registry().filter(s => !DEFAULT_STUDENTS.some(d => d.internalId === s.internalId));
    DEFAULT_STUDENTS.forEach(d => seed(entries, d));
    writeRegistry(entries);
  }

  return { initStorage, register, login, logout, restoreSession, updateProfileSettings, saveTermRecord,
    changePlan, savePlan, evaluateCourseEligibility, getFeedbackCourses, submitFeedback, deleteFeedback, resetDemoData, getContext, DEFAULT_STUDENTS,
    getCurrentStudent: () => currentStudent, getStudentData: () => studentData, getPlanInstance: () => planInstance };
})();

// 7. EXPORT INTERFACES (For JSC, Node.js, and Browser)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COURSE_CATALOGUE: COURSE_CATALOGUE,
    SEMESTER_CONFIG: SEMESTER_CONFIG,
    PROGRAM_TERMS: PROGRAM_TERMS,
    CourseFP: CourseFP,
    SemesterPlan: SemesterPlan,
    SmartApp: SmartApp,
    sha256: sha256
  };
} else {
  globalThis.COURSE_CATALOGUE = COURSE_CATALOGUE;
  globalThis.SEMESTER_CONFIG = SEMESTER_CONFIG;
  globalThis.CourseFP = CourseFP;
  globalThis.SemesterPlan = SemesterPlan;
  globalThis.SmartApp = SmartApp;
  globalThis.sha256 = sha256;
}
