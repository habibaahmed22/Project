# AI Prompt Engineering Log & Evolution
**Course:** CSCI 310 Principles of Programming Languages  
**Assessment:** Group Project – Build and Publish a Website or Mobile Application Using AI  
**Academic Term:** Fall 2026  
**Instructor:** Dr. Maher Alrahhal  
**AI Assistant Used for earlier entries:** Google Antigravity / Gemini 3.8 Flash (High)  
**Team Members:** Habiba, Sahithi, Jaabir  

---

## Grading scale and student feedback revision — 20 November 2026

> i'd like you to add more basic feedback questions, for the student name remove the word fictional and remove the word demo from the AUD ID, also i'd like you to allow the cgpa to be calculated if the student knows their grades but doesnt remeber the cgpa exactly , but keep bpth options if they remever it they enter and if not you calcyalte it, use the grading system i provided. also keep the colours green, yellow, white and green for ticks only

The accompanying image supplied the undergraduate grade scale, mark ranges and transcript notations used in Academic record.

## Selection-based registration revision — 20 November 2026

Recorded by Codex. The earlier entries below document earlier versions of the class project. Test results for this revision are in the README.

#### User prompt

Build and test my **Smart Course Registration and Academic Advisor** in this open project folder. Inspect the existing website first, reuse its working features, and make the changes directly in the files. Use the BSc Computer Science programme PDF for the course catalogue, credits, semester sequence, prerequisites, corequisites, internships, and electives.

**Make the website selection-based.** Students should select their semester, courses, and grades. The app should fill in course details, check eligibility, calculate credit totals, and explain registration decisions automatically.

| Feature                         | What to implement                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **New student and login**       | For this local class demo, use a fictional student’s full name as the username and their AUD ID as the masked password. On signup, ask for their current semester from 1 to 8. Only students in Semesters 7 and 8 should see the AI or Cybersecurity concentration choice. When a returning student advances from Semester 6 to 7, ask once and save the answer. Keep each student’s records linked to their own account.                            |
| **Academic record**             | Suggest courses from earlier semesters and let students select completed courses individually or use “Select all in this term.” Offer grade dropdowns and enter the official cumulative GPA once per graded term. Allow first-semester students to select “No CGPA yet.”                                                                                                                                                                             |
| **Probation and credit limits** | A first graded term below 2.00 gives **Probation 1, maximum 12 credits**. A second consecutive graded term below 2.00 gives **Probation 2, maximum 9 credits**. A CGPA of exactly 2.00 or higher restores Good Standing. Maintain one record per term. Editing the same term twice must never advance probation. If earlier results are missing and the status is uncertain, ask for the missing result. Keep the regular credit limit configurable. |
| **Course Catalogue**            | Let students search by course code or title. Show credits, prerequisites, eligibility, and any missing requirement. Default to the student’s semester and include an “All semesters” filter.                                                                                                                                                                                                                                                         |
| **Registration Planner**        | Provide Add and Remove buttons, update remaining credits immediately, and save the plan. Check duplicates, completed courses, prerequisites, corequisites, and the student’s credit cap. Show a specific reason when a course is blocked.                                                                                                                                                                                                            |
| **Academic Advising**           | Recommend courses the student can add, explain each recommendation, and provide an “Add to plan” button. Include a short feedback form covering course workload, difficulties, usefulness of advice, and optional suggestions. Save feedback under the logged-in student.                                                                                                                                                                            |

Remove the mini-interpreter and command console from this version. Put the eligibility checks directly in the catalogue, planner, and advising screens. Keep two programming paradigms visible in the code: a `SemesterPlan` class for managing selections and pure functions for prerequisites, credit totals, and academic standing.

Run the app and test the main workflow. In particular, verify that Semester 6 hides the concentration choice, Semester 7 shows it, two distinct low-CGPA terms trigger the 9-credit cap, and two students with the same name and different demo AUD IDs retrieve their own records. Record only tests actually run as passed.

When finished, update the README, record this prompt in `prompts.md`, and give me the **exact command to run on my Mac and the local address to open in Safari**.


## 1. Important Development Prompts (Task 3a)

### Prompt 1: Initial Architecture & Full Specification (Foundation)
* **Date / Phase:** Inception & Architectural Setup
* **Context:** Initial generation of the student management application structure.
* **Exact Prompt Text:**
```text
Build a working Student Performance Analyzer website for my CSCI 310 Principles of Programming Languages group project. Work inside my currently open VS Code folder. Inspect the existing files first, preserve any work I’ve already done, and create the source files directly in the folder. Give me a short implementation plan, then build and test it.

Project goal
Help lecturers record student marks, find student records, and identify who may need academic support. Use HTML, CSS, and JavaScript with browser localStorage so records persist after a refresh. Use fictional demo data. The app should run locally and be compatible with GitHub Pages.

Build four functional screens
1. Dashboard — Show total students, class average, pass rate, and the number of students below the passing mark. Recalculate the figures from saved records.
2. Student Records — Let users add, view, edit, and delete records. Each record should include a unique student ID, name, and three assessment marks. Validate required fields, duplicate IDs, and numeric marks from 0 to 100. Allow a mark of zero.
3. Performance Reports — Calculate each student’s average and pass or fail status. Use 50 as the demo passing mark. Allow users to search by name or ID and filter by status. Show a clear message when no records match.
4. Mini-Interpreter — Give users a text box where they can type an expression, click Evaluate, and see the result or a specific error message.

Add clear navigation between the screens and make the interface readable on desktop and mobile.

Implement the mini-language
- AVERAGE(80,70,90) returns 80. Accept one or more valid marks.
- PASS(65) returns TRUE. Accept exactly one valid mark and apply the same passing threshold used in Reports.
- ELIGIBLE(45,TRUE) returns TRUE. Define this demo rule as a mark of at least 45 plus a TRUE attendance flag. Accept exactly one mark and one TRUE or FALSE flag.

Write a parser that reads the command, splits and validates its arguments, and evaluates the result. Handle whitespace, unknown commands, missing parentheses, empty arguments, invalid numbers, out-of-range marks, and invalid Boolean values. Use explicit parsing and avoid eval(). Put the interpreter in a separate JavaScript file and explain its input → parse → validate → evaluate flow in the README.

Demonstrate two programming paradigms in the actual app
Use imperative programming for the record-saving workflow and functional programming for averages, pass status, and report filtering. Use pure functions for the functional examples. In the README, identify the exact files and functions, show a short code example of each paradigm, and explain why it fits that part of the app.

Test and document the project
- Test adding, editing, deleting, and reloading records, duplicate IDs, a mark of zero, search and filters, dashboard calculations, and both valid and invalid interpreter inputs. Record expected results and actual results for the checks you run. Mark any manual checks still pending.
- Create a README.md with the problem statement, target users, at least five functional requirements, the four screens, storage behavior, and exact steps to run the site locally on macOS and publish it through GitHub Pages.
- Create a prompts.md and record this prompt as the first entry. Add space for four more prompts, one before-and-after prompt revision, and one real AI-generated issue with its correction and retest. Record only evidence from work actually performed.
- List the screenshots my group should capture for the five-page report and give us a short running order for the 10–12 minute live demo. Leave GitHub publication for us to complete after reviewing the project.

When finished, tell me which files you created, which tests passed, and the exact command I should run to open the app locally.
```
* **Output & Outcome:** Established initial application scaffolding, HTML5 shell, and basic modular separation.

---

### Prompt 2: Functional Programming Paradigm Refactoring
* **Date / Phase:** Paradigm Implementation & Refinement
* **Context:** Separating functional calculations into pure functions without side effects.
* **Prompt Text:**
```text
Refactor all mathematical and analytical calculations into a dedicated, self-contained functional namespace (`PerformanceFP`).
Ensure all functions are strictly pure:
1. `calculateAverage(marks)` must accept an array of numbers and compute the average using `.reduce()`. It must not mutate the input array.
2. `calculateClassAverage(records)` must flatten all assessment marks using `.flatMap()` and `.reduce()`.
3. `calculatePassRate(records)` and `countStudentsBelowPassing(records)` must use higher-order `.filter()`.
4. `filterAndSearchReports(records, searchQuery, statusFilter)` must compose declarative filtering without mutating state.
Verify that input objects remain immutable.
```
* **Output & Outcome:** Implemented pure functional paradigm with higher-order functions (`map`, `filter`, `reduce`).

---

### Prompt 3: Mini-Language Parser Robustness & Error Diagnostics
* **Date / Phase:** DSL Interpreter Engineering
* **Context:** Enforcing strict AST parsing without using `eval()`.
* **Prompt Text:**
```text
Build `interpreter.js` as an explicit lexical and syntactic parser for the domain-specific commands:
1. Lexing/Tokenizing: Strip extraneous whitespace, extract outer command name, and safely slice outer matching parentheses.
2. Parsing: Split arguments by comma while strictly forbidding empty tokens.
3. Semantic Validation: Validate types, bounds, and argument counts.
4. Evaluation: Return structured object `{ success: boolean, result?: any, error?: string, details: Object }`.
Never invoke `eval()` or `Function()`.
```
* **Output & Outcome:** Modular AST parser with explicit lexical analysis, semantic validation, and comprehensive error categorization.

---

### Prompt 4: Responsive UI, Accessibility & Modal Interactions
* **Date / Phase:** UI/UX & Styling
* **Context:** Polishing user interface across desktop, tablet, and mobile devices.
* **Prompt Text:**
```text
Design a responsive CSS layout (`styles.css`) and semantic HTML5 shell (`index.html`) for the screens:
1. Academic palette: Slate/navy header, clean white cards, subtle borders, high contrast.
2. Modern KPI cards for Dashboard, with alert banners for warnings.
3. Accessible controls with immediate field error highlights.
4. Live search input and filter buttons.
5. Interactive REPL console for Mini-Interpreter with pre-set quick example buttons for one-click demo testing.
6. Responsive design for mobile screens under 768px with a hamburger navigation menu.
```
* **Output & Outcome:** Full responsive stylesheet with CSS Grid, Flexbox, accessible dialogs, and mobile menu toggles.

---

### Prompt 5: Automated Verification Suite for JSC & Browser
* **Date / Phase:** Quality Assurance & Testing
* **Context:** Creating an automated CLI test harness compatible with macOS JavaScriptCore (`jsc`).
* **Prompt Text:**
```text
Create an automated test runner (`tests/test-runner.js`) that runs under macOS native JavaScript engine (`jsc`) and Node.js:
1. Cover all pure functional operations in dedicated FP module.
2. Cover OOP CRUD operations and invariant enforcement.
3. Cover mini-interpreter valid expressions and all error conditions (unknown commands, missing parens, empty arguments).
Print a clean pass/fail report with exact counters.
```
* **Output & Outcome:** Automated test suite executing under macOS `jsc` and Node.js.

---

### Prompt 6: Smart Course Registration and Academic Advisor Full Specification (Core Project)
* **Date / Phase:** Domain Shift & Complete System Build
* **Context:** Transforming the application into **Smart Course Registration and Academic Advisor** for CSCI 310 Principles of Programming Languages group project.
* **Exact Prompt Text:**
```text
Build a working website called Smart Course Registration and Academic Advisor for our CSCI310 Principles of Programming Languages group project. Students should be able to answer three questions: “Which courses can I take?”, “Why am I eligible or ineligible?”, and “Which combination fits my semester credit limit?”

Start by inspecting the existing project files, including index.html, styles.css, app.js, interpreter.js, README.md, and prompts.md wherever present. Run the current project, reuse working features, and implement the changes directly in the workspace. Use HTML, CSS, and JavaScript. Make the site suitable for GitHub Pages and store the student profile and semester plan in localStorage.

1. Build four connected screens
- Student Profile: Let the student select completed courses, enter a semester credit limit, and save changes. Restore the saved profile after refresh.
- Course Catalogue: Display each course’s code, title, credits, and prerequisites. Support search by code or title and filtering by eligibility. For a blocked course, name the missing prerequisites.
- Registration Planner: Let the student add and remove courses. Show planned credits and remaining credits immediately. Prevent duplicate courses, completed courses, unmet prerequisites, and additions that exceed the credit limit. Display the specific reason beside the attempted action.
- Academic Advisor: Recommend courses the student can add to the current plan. Explain each recommendation using the student’s completed courses and remaining credits. Include a working mini-interpreter where the student can type commands about the same profile, catalogue, and plan.

2. Define clear registration and advising rules
Use a small fictional computer science catalogue of about ten courses. Label it as demonstration data. Include courses with no prerequisites, one prerequisite, and two prerequisites. Include this exact example so we can reproduce it during the presentation: CS101 is Introduction to Programming, and CS201 is Data Structures, worth 3 credits, with CS101 as its prerequisite.

Treat a prerequisite as satisfied only when the course appears in the student’s completed list. Adding it to the current semester plan must not unlock the next course. Keep prerequisite eligibility and available credit space separate. For example, a student who completed CS101 can be academically eligible for CS201 even if only two credits remain and registration must be blocked.

Make the advisor useful. Among courses that fit the current plan, recommend first the ones that serve as prerequisites for the greatest number of other unfinished courses. Break ties by course code. Explain the ranking in plain English and show which later courses list a recommendation as a prerequisite. Use the same rules for the planner, advisor, and interpreter so their answers agree.

3. Implement a real mini-interpreter in interpreter.js
Define a small language with the commands:
- PREREQS("CS201"): List the prerequisites for Data Structures.
- ELIGIBLE("CS201"): Check whether the student meets the prerequisites. If any are missing, name them.
- CAN_ADD("CS201"): Check every registration rule against the current plan and explain the result.
- CREDITS(): Return the total credits in the saved semester plan.
- RECOMMEND(): Return ranked recommendations with reasons, using the same logic as the Academic Advisor screen.

Handle empty input, unknown commands, missing parentheses, wrong argument counts, and unknown course codes with specific messages. Include clickable example commands and let students edit and run their own expressions.

4. Make two programming paradigms visible in the actual code
Use object-oriented programming for a SemesterPlan class that manages additions and removals and enforces registration rules. Use functional programming for operations such as calculating total credits, finding missing prerequisites, and ranking eligible courses. Keep those functions pure so the same inputs produce the same outputs without modifying the original records. In the README, point to one actual code example for each paradigm and explain why that approach suits its job.

5. Design the interface for a live university demonstration
Use a clean, responsive academic dashboard with consistent navigation, labelled forms, readable tables or cards, keyboard-accessible controls, and clear empty states. Use specific feedback such as “CS201 requires CS101” or “CS201 needs 3 credits and you have 2 remaining.” Keep the student’s next action obvious on every screen.

6. Test the project and prepare submission evidence
Run the available tests and verify the main workflow through the website. Include these cases: an eligible course, a missing prerequisite, one missing prerequisite out of two, a duplicate selection, an already completed course, a course that fits the credit limit exactly, a course that exceeds it, removal from the plan, saved data after refresh, updated recommendations, and valid and invalid interpreter commands. Check that changing the profile flags any existing plan entries that have become invalid and explains how to resolve them.
```
* **Output & Outcome:** Re-architected application to **Smart Course Registration and Academic Advisor**. Built `CourseFP` (pure functional module), `SemesterPlan` (OOP class), `CourseInterpreter` (DSL parser for academic queries), responsive UI, and 42 automated tests with 100% pass rate.

---

### Prompt 7: BSc Computer Science Delivery Curriculum, Multi-Student Records, Academic Probation & Advising Feedback
* **Date / Phase:** November 2026 / Major Architectural Upgrade & Curriculum Integration
* **Team Members:** Habiba (Interpreter, Rules, Paradigms & Demo), Sahithi (Screens, Forms & UI), Jaabir (Integration Tests, AI Evidence & Report)
* **Context:** Replacing fictional course catalogue with actual 125-credit BSc Computer Science delivery schedule from Amity University Dubai (AUD), implementing student authentication with multi-user browser isolation, distinct-term chronological CGPA probation history with 12/9 credit caps, PHYS 100 corequisite validation, internship/capstone earned-credit boundaries, concentration electives (AI vs Cybersecurity), advising feedback forms, and extending mini-interpreter commands.
* **Exact Prompt Text:**
```text
Paste this into **Google Antigravity** with your existing project folder open. I checked the programme PDF and included the missing **4 credits for EEEN 200**, the actual AI and Cybersecurity electives, and the internship requirements. The probation thresholds below are the rules you supplied for this project. Bachelor of Science in Computer Science -  Program Structure and Program Delivery.pdf

Update our existing **Smart Course Registration and Academic Advisor** website for the CSCI310 Principles of Programming Languages group project. Inspect the current files, reuse working features, implement the changes in the open project folder, and run the application. Replace the fictional course catalogue and `CS101` examples with the BSc Computer Science curriculum below.

**1. Student login and individual records**

On first use, let the student create a profile with their **full name**, **AUD student ID**, and **concentration**. Ask “Which concentration are you pursuing?” with two choices: **Artificial Intelligence** and **Cybersecurity**.

For returning students, use their **full name as the username** and their **AUD student ID as the password**, as requested for this class project. Mask the password field and provide a logout button. Support students who share a name and have different AUD IDs. Use a stable internal student ID to link each student’s concentration, grades, CGPA history, probation history, saved plans, and advising feedback. After logout, clear the previous student’s information from the screen.

For a static GitHub Pages demonstration, use **fictional student names and AUD IDs**, label the login as a local demo, and explain that records persist in the same browser. Keep raw passwords out of browser storage, logs, screenshots, and the repository. If the existing project already has a backend, use server-side authentication and enforce account ownership when reading or writing student records.

**2. Grades, CGPA history, and probation**

Add an **Academic Record** screen. Let the student select an academic year and term, enter each course grade as shown on their transcript, indicate whether credit was earned, and enter the **official cumulative GPA (CGPA)** for that term. Save drafts separately from finalised term records. A student must be able to view and correct a previous term. Use the entered CGPA for probation decisions. Do not invent grade conversions or calculate CGPA by averaging semester GPAs.

Apply these project rules in chronological order:

| Finalised academic record | Standing | Maximum planned credits |
|---|---|---|
| No finalised CGPA yet | Awaiting CGPA | Show that standing is pending |
| CGPA **2.00 or above** | Good Standing | Use the configured regular limit |
| First finalised term below **2.00**, including the first low term after recovery | Academic Probation 1 | **12 credits** |
| Second consecutive finalised term below **2.00**, and each consecutive low term after that | Academic Probation 2 | **9 credits** |

The regular credit limit was not supplied. Keep it configurable and label any demo value as a project setting. Make the effective probation cap read-only for the student.

**Count distinct terms, not saves or logins.** Saving or editing Fall twice must never advance a student to Probation 2. A CGPA of exactly `2.00` restores Good Standing. If a previous CGPA changes, recalculate that term and all later standings in academic order. Display a history table with **academic year, term, CGPA, standing, and credit limit**. Apply the latest finalised standing to the upcoming registration plan. If a new cap makes an existing plan too large, keep the courses visible, show how many credits must be removed, and block confirmation until the plan fits.

**3. Use this curriculum once, organised by year and term**

The number in parentheses is the course credit value. Store each course once and reuse its catalogue record across the planner, transcript, advisor, and interpreter.

| Year and term | Courses |
|---|---|
| **Year 1 Fall** | ARAB 102 Arabic Language (3), ENGL 102 English for Academic Writing (3), GENE 120 Islamic Culture (3), MATH 100 Mathematics I (4) |
| **Year 1 Spring** | COMM 105 Public Speaking (3), MATH 105 Mathematics II (3), PHYS 100 Mechanics and Wave Optics (4), CSCI 200 Introduction to Computers and Programming (3) |
| **Year 2 Fall** | GENE 210 UAE Studies (3), PHYS 105 Electromagnetics and Modern Physics (3), EEEN 200 Basic Electrical and Electronics Engineering (4), CSCI 205 Object-Oriented Programming using Java (4), CSCI 215 Data Structures and Algorithms (4) |
| **Year 2 Spring** | MATH 120 Probability and Statistics (3), MATH 210 Numerical Methods and Optimization (3), EEEN 215 Digital Design (4), CSCI 210 Database Management Systems (4), CSCI 300 Operating Systems (3) |
| **Year 2 Internship** | INTE 200 Internship I (2) |
| **Year 3 Fall** | MATH 110 Mathematics for Technology (3), CSCI 305 Computer Architecture and Organization (4), CSCI 310 Principles of Programming Languages (3), CSCI 315 Theory of Computation (4), CSCI 330 Computer Networks (4) |
| **Year 3 Spring** | CSCI 320 Analysis and Design of Algorithms (4), CSCI 335 Software Engineering (3), CSCI 340 Computer Security and the Internet (3), CSCI 400 Artificial Intelligence (4), CSCI 405 Parallel and Distributed Computing (3) |
| **Year 3 Internship** | INTE 300 Internship II (2) |
| **Year 4 Fall** | GENE 440 Ethics and Professional Responsibility (3), three distinct concentration electives (3 credits each) |
| **Year 4 Spring** | GENE 340 Innovation, Entrepreneurship and Sustainability (3), two further distinct concentration electives (3 credits each), PROE 400 Senior Design Project (4) |

Use the selected concentration to fill the **five elective slots worth 15 credits**. Each pool contains six options. Show actual course codes and names when a student chooses an elective. Count each selected course once. The complete delivery plan totals **125 credits**.

| Concentration | Elective options, 3 credits each |
|---|---|
| **Artificial Intelligence** | CSCI 410 Digital Image Processing and Computer Vision, CSCI 415 AI for Data Analytics, CSCI 420 Natural Language Processing, CSCI 425 Cognitive Robotics, CSCI 430 Machine Learning, CSCI 435 Neural Networks |
| **Cybersecurity** | CSCI 440 Advanced Networking and Cybersecurity, CSCI 445 Applied Cryptography, CSCI 450 Network Security, CSCI 455 Digital Forensics, CSCI 460 Security Policy, Laws and Governance, CSCI 465 Information Security Management |

**4. Implement the prerequisite checker and registration planner**

Use these documented rules. A prerequisite must already be completed with credit earned. A corequisite can be completed previously or taken in the same semester. Use **earned credits** for internship and project thresholds. Exclude planned credits and count a repeated course only once toward earned credits.

| Course | Requirement |
|---|---|
| MATH 105 | MATH 100 |
| PHYS 100 | MATH 100 prerequisite and MATH 105 corequisite |
| PHYS 105 | PHYS 100 |
| EEEN 200 | MATH 100 or a recorded completion of MATH 125. The programme structure lists both alternatives, and the delivery schedule shows MATH 100. Allow MATH 125 as prior credit without adding it as a required course. |
| MATH 210 | MATH 105 |
| EEEN 215 and CSCI 215 | CSCI 200 |
| CSCI 305 | EEEN 215 |
| CSCI 310 and CSCI 335 | CSCI 205 |
| CSCI 320, CSCI 430, and CSCI 435 | CSCI 215 |
| CSCI 340 and CSCI 440 | CSCI 330 |
| CSCI 405 | CSCI 300 |
| INTE 200 | At least 45 earned credits |
| INTE 300 | At least 80 earned credits **and** completion of INTE 200 |
| PROE 400 | At least 90 earned credits |

Keep the catalogue searchable by code and title, with filters for year, term, concentration, and eligibility. Let students add and remove courses, save their plan, and see used and remaining credits. Explain the exact reason a course is blocked. For example, “You meet the prerequisite for CSCI 310. Adding its 3 credits would bring your plan to 10, above your Probation 2 limit of 9.” Recheck the whole plan after removing a corequisite or changing an academic record.

**5. Add recommendations and a feedback form under Academic Advising**

Recommend courses using the logged-in student’s completed courses, concentration, prerequisites, remaining credits, and target semester. Give a short reason for each recommendation. Reuse the planner’s eligibility functions so the advisor and planner agree.

On the same **Academic Advising** screen, add a clearly labelled **Advising Feedback** form:

| Field | Question |
|---|---|
| Term and course | Which semester and course is this feedback about? Include a “General advising” option. |
| Course experience | How manageable was the course workload? Offer a 1–5 scale with labelled endpoints. |
| Difficulties | What difficulties did you face? Allow choices such as understanding the material, workload, prerequisites, or registration, plus “Other” and an optional explanation. |
| Advising usefulness | Did the advice help you choose your courses? Offer Yes, Partly, and No. |
| Recommendations | What changes would you recommend for this course or the advising process? |
| Additional feedback | Is there anything else you would like to share? Make this optional. |

Save each submission with the student’s internal ID, selected term, and submission date. Show a confirmation and a **My Previous Feedback** section. Reloading the page must not submit the form twice. In a local demo, tell the student the feedback is saved in this browser so they know where it went.

**6. Keep the CSCI310 mini-interpreter and programming paradigms visible**

Under Academic Advising, provide a command console that parses typed expressions, checks arguments, and evaluates them against the signed-in student’s actual record. Implement `PREREQS("CSCI 310")`, `ELIGIBLE("CSCI 310")`, `CAN_ADD("CSCI 310")`, `CREDITS()`, `RECOMMEND()`, `CGPA()`, `STANDING()`, and `CREDIT_LIMIT()`. Define `CREDITS()` as the current plan total. Give clear errors for malformed syntax, unknown commands, and unknown course codes. Use an explicit parser without JavaScript `eval()`.

Demonstrate **object-oriented programming** through the `SemesterPlan` class and **functional programming** through pure functions for standing history, earned-credit totals, prerequisites, and recommendations. Use the same functions in the console and the interface.

**7. Test and document the result**

Run these acceptance tests and record the expected and actual outcomes:

- Enter Fall CGPA `1.85`, then edit the same Fall record to `1.90`. Both saves must show **Probation 1, 12 credits**. Add Spring CGPA `1.95`. It must show **Probation 2, 9 credits**.
- Add a later term at `2.00`. It must show **Good Standing**. A subsequent term at `1.99` starts **Probation 1** again. Correct an older term and verify that later history updates.
- With **Probation 2**, verify that a 9-credit plan is accepted and a 10-credit plan is blocked. Confirm that changing the profile cannot override the cap.
- Verify a missing prerequisite, the PHYS 100 corequisite, the 45-credit internship boundary, concentration-specific electives, duplicate prevention, and valid and invalid interpreter commands.
- Create two fictional students with the same name and different AUD IDs. Give them different grades, concentrations, plans, and feedback. Log out, log back in, and verify that each sees only their own records through the application.
- Test feedback submission, refresh, history, and required-field validation. Mark a check **Pass** only after running it.

Update the README with Mac setup instructions, the data model, probation rules, interpreter commands, actual test results, and a short demo walkthrough. Record this prompt in the existing prompt log. Keep our planned responsibilities: **Habiba** leads the mini-interpreter, academic rules, paradigms, and technical demo. **Sahithi** leads the screens, forms, and interface integration. **Jaabir** leads integration testing, AI evidence, GitHub, publication, and report compilation.

When finished, tell me how to run the updated app, which files changed, and which tests passed or remain pending. Give Habiba a reproducible live demo that follows one student from **CGPA entry → probation history → credit limit → registration decision → interpreter explanation**.
```
* **Output & Outcome:** Successfully executed complete system upgrade:
  1. Updated `app.js` with all 125 credits of the BSc Computer Science curriculum from AUD, pure functional standing recalculator (`CourseFP.calculateStandingHistory`), SHA-256 client-side credential hashing, and multi-student partition storage.
  2. Implemented `SemesterPlan` OOP class enforcing read-only probation credit caps (12 cr for Probation 1, 9 cr for Probation 2) and corequisite validation.
  3. Added `Academic Record` screen in `index.html` with transcript grade builder, draft vs finalised separation, and chronological standing history.
  4. Built `Advising Feedback` form with 1–5 workload scale, multi-choice difficulties, usefulness ratings, recommendations, and local persistence.
  5. Expanded `interpreter.js` with `CGPA()`, `STANDING()`, `CREDIT_LIMIT()`, `PREREQS("CSCI 310")`, `ELIGIBLE("CSCI 310")`, `CAN_ADD("CSCI 310")`, `CREDITS()`, `RECOMMEND()`.
  6. Expanded `tests/test-runner.js` to 66 automated acceptance tests executed under native macOS `jsc` with a 100% pass rate.
* **Follow-up / Verification:**
  Executed `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js`. Result: 66/66 tests passed (100%).

---

## 2. Format Template for Recording Remaining Genuine Prompts

To record additional prompts used during subsequent refinements, follow this standardized team template:

```markdown
### Prompt [N]: [Short Descriptive Title]
* **Date / Phase:** [e.g. November 2026 / Feature Refinement / Bug Fix]
* **Team Member:** [Habiba / Sahithi / Jaabir]
* **Context:** [Why this prompt was needed and what problem it addressed]
* **Exact Prompt Text:**
```text
[Paste exact prompt text verbatim here]
```
* **Output & Outcome:** [What the AI produced and how it was verified]
* **Follow-up / Verification:** [Terminal commands, manual testing, or git diff results]
```

---

## 3. Before-and-After Prompt Improvement (Task 3b)

### Initial Prompt (Before Improvement)
> *"Write an academic advisor function in JavaScript that recommends courses to add to the student plan and sorts them."*

### Why the Initial Prompt Was Ineffective:
1. **Ambiguous Eligibility Criteria:** Did not specify whether prerequisites could be satisfied by currently planned courses or only by completed courses in the academic profile.
2. **Missing Constraint Separation:** Conflated academic eligibility with credit capacity, risking confusing logic where a course was marked ineligible simply because the credit limit was full.
3. **No Explicit Ranking Objective:** Stating "sorts them" gave the AI freedom to sort arbitrarily (by credits, alphabetically, or course number) rather than prioritizing curricular unlock impact (how many future unfinished courses the course unlocks).
4. **Missing Tie-Breaking & Explanations:** Failed to specify tie-breaking rules and required explanations, leading to nondeterministic ordering and opaque recommendations.

### Improved Prompt (After Improvement)
> *"Implement a strictly pure function `rankRecommendedCourses(catalogue, completedCourseCodes, plannedCourses, creditLimit)` in `app.js` using functional programming principles:
> 1. Filter candidates to courses that: (a) are NOT in `completedCourseCodes`, (b) are NOT in `plannedCourses`, (c) have all prerequisites present in `completedCourseCodes` via pure `isCourseEligible`, and (d) have `credits <= remainingCredits` (calculated via `creditLimit - totalPlannedCredits`).
> 2. For each candidate, compute `unlockCount`: the number of unfinished courses in `catalogue` (not in completed or planned) that list this course in their `prerequisites` array.
> 3. Sort candidates deterministically: highest `unlockCount` first; for ties, sort alphabetically by course code (`a.code.localeCompare(b.code)`).
> 4. Return an immutable array of objects `{ course, unlockCount, unlockedCourses }` with plain English explanations of why each course is recommended and which later courses it unlocks. Do not mutate any inputs."*

### Impact of Improvement:
- Enforced mathematical purity with zero mutations.
- Clarified the separation between academic prerequisite eligibility and credit limit capacity.
- Generated deterministic ranking with transparent curricular unlock explanations.

---

## 4. Observed AI-Generated Issue, Correction & Retest (Task 3c)

### A. The Real Issue Encountered
During execution of the automated test suite on macOS using Apple's native JavaScriptCore CLI runtime (`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js`), the execution crashed with a fatal syntax exception:
```text
Exception: SyntaxError: Can't create duplicate variable that shadows a global property: 'COURSE_CATALOGUE'
at tests/test-runner.js:34
load@[native code]
global code@tests/test-runner.js:34:7
```
After resolving the variable shadowing, a secondary runtime exception occurred:
```text
Exception: TypeError: integrityPlan.setCreditLimit is not a function. (In 'integrityPlan.setCreditLimit(2)', 'integrityPlan.setCreditLimit' is undefined)
global code@tests/test-runner.js:251:29
```

### B. Root Cause Analysis
1. **JSC Lexical Declaration Conflict:** In Apple's JavaScriptCore runtime, scripts loaded into an existing execution context via `load('app.js')` cannot declare top-level block-scoped `const` or `let` variables with identifiers that already exist on the global object (which was populated by the module export bridge `globalThis.COURSE_CATALOGUE = COURSE_CATALOGUE`). Unlike browser V8/Blink environments which may tolerate this during separate script tag evaluations, JSC enforces strict lexical shadowing rules that throw a fatal `SyntaxError`.
2. **Missing Setter Method in Class API:** The AI initially designed `SemesterPlan` with an ES6 getter/setter (`set creditLimit(newLimit)`), but omitted an explicit method interface `setCreditLimit(newLimit)`. When client code or tests called `integrityPlan.setCreditLimit(2)`, a `TypeError` was raised.

### C. The Correction Applied
1. In `app.js`, replaced top-level `const` declarations with `var` for the global structures (`COURSE_CATALOGUE`, `CourseFP`, `SemesterPlan`, `SmartApp`), preventing the lexical shadowing conflict in JSC:
```javascript
// Before: const COURSE_CATALOGUE = [ ... ];
// After:
var COURSE_CATALOGUE = [ ... ];
var CourseFP = (function () { ... })();
var SemesterPlan = class SemesterPlan { ... };
```
2. In `app.js` within the `SemesterPlan` class definition, added the explicit `setCreditLimit(newLimit)` method alongside the property setter:
```javascript
set creditLimit(newLimit) {
  if (typeof newLimit === 'number' && newLimit >= 0) {
    this._creditLimit = newLimit;
  }
}

setCreditLimit(newLimit) {
  this.creditLimit = newLimit;
}
```

### D. Retest Evidence
The test script was re-executed under macOS `jsc`:
```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js
```
**Outcome:** Both exceptions were completely resolved. All 42 automated tests executed cleanly and passed with 100%:
```text
======================================================
  TEST SUITE EXECUTION SUMMARY
======================================================
Total Tests Executed: 42
Tests Passed:         42 (100%)
Tests Failed:         0

>>> ALL 42 AUTOMATED TESTS PASSED SUCCESSFULLY! <<<
```
