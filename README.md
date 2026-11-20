# Smart Course Registration and Academic Advisor

A local registration demo for the Bachelor of Science in Computer Science programme at Amity University Dubai, built for CSCI 310 Principles of Programming Languages. Students choose their semester, courses and grades. The app checks registration requirements against their transcript, concentration, plan and credit limit.

## Run on this Mac

Paste this command into Terminal. Keep that Terminal window open while using the site.

```sh
cd "/Users/habibaahmed/Desktop/ppl project" && python3 -m http.server 8000 --bind 127.0.0.1
```

Open **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)** in Safari. Press Control-C in Terminal to stop the server. The site uses local HTML, CSS, JavaScript and the programme PDF. Python 3 serves the files directly.

## Student workflow

| Screen | What to do |
|---|---|
| Student profile | Create an account with a full name, a masked AUD ID and Semester 1–8. Semesters 7 and 8 require an Artificial Intelligence or Cybersecurity concentration. **Advance semester** asks for the track when entering Semester 7 and carries it forward to Semester 8. Set the regular limit or record MATH 125 prior credit here. |
| Academic record | Pick a term up to the current semester. The editor opens on a missing result or the most recent earlier regular term. Tick individual courses or use **Select all in this term**. Choose electives individually. Use **Other coursework** for a course taken outside its suggested term. Select grades and choose **Enter my official CGPA** or **Calculate from my grades**. The calculated value updates as you select courses and grades. **Save draft** keeps work in progress. **Save term result** updates the transcript and recalculates standing. |
| Course catalogue | Start in the student’s semester or choose **All semesters**, internships or concentration electives. Search by title or code, including codes without spaces. Each course shows its credits, requirements, status and reason for a block. |
| Registration planner | Select a course to inspect the registration decision. Add or remove courses to update totals immediately. Selections are kept as a working plan for that account and semester. **Save plan** validates the complete selection. If a record changes or a corequisite is removed, existing selections stay visible with the issue to resolve. |
| Academic advising | Inspect eligible recommendations, see which later prerequisites they fulfil, and add a course to the plan. The course checker uses the same decision as the planner. Every feedback question requires an answer. Choose a course from your finalised academic record, rate workload and usefulness, and answer the questions on registration, clarity and support. Rate the four course and instructor statements on the 1–5 agreement scale. Select at least one difficulty or **None**, and write a response to the improvement question. In **My feedback**, choose **Edit** to reopen your answers and **Save changes** to update that submission. Choose **Delete** and confirm to remove it. Each student can submit once per course, including retakes. Deleting the answers keeps the course closed to new submissions. Failed attempts qualify. Drafts, plan selections, withdrawals, transfer credit and challenge-exam credit do not establish course attendance. |

### Standing and limits

| Transcript evidence | Result | Maximum credits |
|---|---|---|
| Entering Semester 1 with **No CGPA yet** | No CGPA yet | Regular limit |
| First graded term below 2.00, or first low result after good standing | Academic Probation 1 | 12 |
| Two or more consecutive graded terms below 2.00 | Academic Probation 2 | 9 |
| Latest cumulative GPA of 2.00 or higher | Good Standing | Regular limit |
| Missing result that could change the current standing | Standing pending, with a link to the specific term | New additions pause until resolved |

The regular limit starts at **15** and is configurable from **1 to 30**. The app stores one finalised result per year and term. Correcting a CGPA recalculates later standings. An explicitly ungraded term can be skipped in the graded sequence. A graded internship participates in PDF delivery order. **No CGPA yet** in Semester 1 leaves the first result outstanding when the student advances.

### Calculating a CGPA from grades

Choose **Calculate from my grades** to see a live result and its graded-credit total. The calculator multiplies each grade’s points by the course credits, sums those products across graded terms through the selected term, and divides by the total graded credits. It rounds the final CGPA to two decimal places for display and standing. For example, a 3-credit B+ and a 4-credit D contribute 13.90 points across 7 credits, giving **1.99**. The grade scale in Academic record shows every notation from the supplied table.

The calculator treats F as 0.00 and includes its attempted credits. P, W, I, NC, WF, CC, TR, CX and AUD are excluded from GPA credits. P, TR and CX can earn graduation credit. Every graded attempt counts in the estimate, and a completed course earns degree credit once.

Enter the grades for all graded courses through the selected term. The app identifies a missing earlier term or an earlier CGPA without course grades. If the grades entered disagree with an earlier official CGPA, the preview flags the difference. Saving a correction updates later calculated CGPAs and standings. Official values change only when edited directly. Drafts have no effect on standing.

## Programme catalogue

The catalogue follows the supplied **Programme Structure** and **Proposed Schedule of Delivery** tables. General education, basic science and math, and the major core total 110 credits, including both internships. Five 3-credit electives bring the degree to **125 credits**. The demo uses the two named concentrations requested for Year 4. [Bachelor of Science in Computer Science programme PDF](Bachelor%20of%20Science%20in%20Computer%20Science%20-%20%20Program%20Structure%20and%20Program%20Delivery.pdf)

### Delivery Schedule by Year and Term

| Year &amp; Term | Course Code | Course Title | Credits | Requirements / Prerequisites |
|---|---|---|:---:|---|
| **Year 1 Fall** (13 cr) | `ARAB 102` | Arabic Language | 3 | None |
| | `ENGL 102` | English for Academic Writing | 3 | None |
| | `GENE 120` | Islamic Culture | 3 | None |
| | `MATH 100` | Mathematics I | 4 | None |
| **Year 1 Spring** (13 cr) | `COMM 105` | Public Speaking | 3 | None |
| | `MATH 105` | Mathematics II | 3 | `MATH 100` |
| | `PHYS 100` | Mechanics and Wave Optics | 4 | `MATH 100` (prerequisite) &amp; `MATH 105` (corequisite) |
| | `CSCI 200` | Introduction to Computers and Programming | 3 | None |
| **Year 2 Fall** (18 cr) | `GENE 210` | UAE Studies | 3 | None |
| | `PHYS 105` | Electromagnetics and Modern Physics | 3 | `PHYS 100` |
| | `EEEN 200` | Basic Electrical and Electronics Engineering | 4 | `MATH 100` (or prior credit in `MATH 125`) |
| | `CSCI 205` | Object-Oriented Programming using Java | 4 | None |
| | `CSCI 215` | Data Structures and Algorithms | 4 | `CSCI 200` |
| **Year 2 Spring** (17 cr) | `MATH 120` | Probability and Statistics | 3 | None |
| | `MATH 210` | Numerical Methods &amp; Optimization | 3 | `MATH 105` |
| | `EEEN 215` | Digital Design | 4 | `CSCI 200` |
| | `CSCI 210` | Database Management Systems | 4 | None |
| | `CSCI 300` | Operating Systems | 3 | None |
| **Year 2 Internship** (2 cr) | `INTE 200` | Internship I | 2 | At least **45 earned credits** |
| **Year 3 Fall** (18 cr) | `MATH 110` | Mathematics for Technology | 3 | None |
| | `CSCI 305` | Computer Architecture and Organization | 4 | `EEEN 215` |
| | `CSCI 310` | Principles of Programming Languages | 3 | `CSCI 205` |
| | `CSCI 315` | Theory of Computation | 4 | None |
| | `CSCI 330` | Computer Networks | 4 | None |
| **Year 3 Internship** (2 cr) | `INTE 300` | Internship II | 2 | At least **80 earned credits** AND completion of `INTE 200` |
| **Year 3 Spring** (17 cr) | `CSCI 320` | Analysis and Design of Algorithms | 4 | `CSCI 215` |
| | `CSCI 335` | Software Engineering | 3 | `CSCI 205` |
| | `CSCI 340` | Computer Security and the Internet | 3 | `CSCI 330` |
| | `CSCI 400` | Artificial Intelligence | 4 | None |
| | `CSCI 405` | Parallel and Distributed Computing | 3 | `CSCI 300` |
| **Year 4 Fall** (12 cr) | `GENE 440` | Ethics and Professional Responsibility | 3 | None |
| | *Elective 1* | Concentration Elective I | 3 | Selected from chosen concentration pool |
| | *Elective 2* | Concentration Elective II | 3 | Selected from chosen concentration pool |
| | *Elective 3* | Concentration Elective III | 3 | Selected from chosen concentration pool |
| **Year 4 Spring** (13 cr) | `GENE 340` | Innovation, Entrepreneurship and Sustainability | 3 | None |
| | *Elective 4* | Concentration Elective IV | 3 | Selected from chosen concentration pool |
| | *Elective 5* | Concentration Elective V | 3 | Selected from chosen concentration pool |
| | `PROE 400` | Senior Design Project | 4 | At least **90 earned credits** |

### Concentration Elective Pools (15 Credits Total)

Students pursue either **Artificial Intelligence** or **Cybersecurity**, selecting 5 distinct courses (3 credits each):

| Concentration | Elective Course Options (3 Credits Each) |
|---|---|
| **Artificial Intelligence** | `CSCI 410` Digital Image Processing and Computer Vision<br>`CSCI 415` AI for Data Analytics<br>`CSCI 420` Natural Language Processing<br>`CSCI 425` Cognitive Robotics<br>`CSCI 430` Machine Learning *(Prereq: CSCI 215)*<br>`CSCI 435` Neural Networks *(Prereq: CSCI 215)* |
| **Cybersecurity** | `CSCI 440` Advanced Networking and Cybersecurity *(Prereq: CSCI 330)*<br>`CSCI 445` Applied Cryptography<br>`CSCI 450` Network Security<br>`CSCI 455` Digital Forensics<br>`CSCI 460` Security Policy, Laws and Governance<br>`CSCI 465` Information Security Management |

MATH 125 is a prior-credit alternative for EEEN 200. Its role in the demo is to satisfy that prerequisite. The catalogue counts MATH 125 as zero additional credits toward the 125-credit delivery schedule.

## Accounts and programming paradigms

The name and AUD ID together identify the account. The browser stores a digest of the demo ID, an internal account ID, and a separate data record for each student. That record holds official terms, drafts, prior credit, plans by semester and feedback. The active account is scoped to the browser tab and survives a reload. Use the same browser profile and local address to retrieve saved work. Clearing website data removes local records.

Existing v4 student records are read on login. The app keeps the original account ID, adopts the previous saved plan for the student’s active semester, and recovers unfinished term entries as drafts. **Reset demo profiles** restores the five supplied sample accounts. Separately registered accounts retain their records.

- **Object-oriented programming** uses `SemesterPlan` to own selected courses, add and remove them, enforce credit and elective limits, check plan integrity, and serialize selections. [app.js](app.js)
- **Functional programming** uses `CourseFP.getMissingRequirements`, `calculateTotalCredits`, `calculateEarnedCredits` and `calculateStandingHistory` to derive decisions without mutating their inputs. The interface calls the same eligibility decision from all three registration screens. [app.js](app.js) · [ui.js](ui.js)

## Demo walkthrough

1. On **Returning student**, sign in as **Omar Al Hashimi** with fictional ID **AUD-2024-003**. His Semester 1 CGPA of 1.85 gives him a 12-credit cap.
2. In **Academic record**, edit Year 1 Fall to 1.90 and save. The history still has one graded term. Select Year 1 Spring, enter 1.95, and save. The cap becomes 9.
3. Open **Registration planner**. Omar’s initial three 3-credit selections already use all 9 credits. Select **CSCI 205** to see the 13-credit projected total and the 9-credit limit. Remove a course to see the remaining credits update.
4. For concentration progression, use **Layla Al Mansoori**, **AUD-2024-004**, in Semester 6. Advance, choose a track and save. Sign out and sign in again to see the saved choice.
5. For account isolation, the two **Fatima Al Blooshi** sample logins use **AUD-2024-001** and **AUD-2024-002**. Their semesters, transcripts and plans are separate. The Semester 7 sample starts with missing history and prompts for the preceding result.

## Tests run on 20 November 2026

| Executed suite | Result | Examples checked |
|---|---:|---|
| JavaScriptCore rule and storage tests | **134 passed, 0 failed** | Eight delivery terms, 125-credit total, alternative prerequisite, corequisite, internship and project thresholds, elective slots, missing terms, repeated saves, recovery at 2.00, account isolation, v4 data migration, all grade notations, cumulative weighting and corrections to earlier terms |
| Native macOS WebKit workflow tests against the running HTTP site | **85 passed, 0 failed** | Signup, login and advancement, Semester 6 hidden and Semester 7 visible, two low terms and a 9-credit plan, missing-result navigation, catalogue search, add/remove/save, advising, feedback isolation, transcript-based eligibility, one submission per course, editing and deletion after sign-in, reload, planner width at 390 px, full-name and AUD ID labels, blue header and ticks, yellow primary buttons, white panels, required feedback answers, saved agreement ratings, exclusive None difficulty selection, additional feedback answers, live CGPA previews and official overrides |

Run the rule tests from the project folder.

```sh
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js
```

With the local server running, open a second Terminal window and run the browser workflow. The harness uses Swift, AppKit, and WebKit on macOS with an ephemeral browser data store.

```sh
cd "/Users/habibaahmed/Desktop/ppl project" && swift tests/browser.swift
```

The browser harness drives the served site’s forms and buttons, signs in with distinct credentials, reloads the page, and reports each assertion it executes. It exits with an error on a failed check. [Browser harness](tests/browser.swift) · [Workflow assertions](tests/browser-workflow.js) · [Rule tests](tests/test-runner.js)

## Class project

Fall 2026 · School of Engineering, Architecture and Interior Design · Dr. Maher Alrahhal

| Team member | Planned responsibility |
|---|---|
| Habiba | Academic rules, programming paradigms and technical walkthrough |
| Sahithi | Screens, forms, navigation and interface integration |
| Jaabir | Integration testing, prompt evidence, publication and report compilation |

The development log includes the prompt for the selection-based edition. [prompts.md](prompts.md)
