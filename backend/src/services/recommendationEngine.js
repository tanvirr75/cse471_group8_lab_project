// Feature 11: Smart Job Recommendation System
//
// Pure scoring engine: takes a student's UserProfile and a Job and returns a
// 0-100 match percentage plus the evidence behind it (matched/missing skills
// and human-readable reasons). No database access here, so it is trivial to
// unit test and reuse.
//
// Score layout (100 points total) - extends the on-the-fly model used by
// jobController.getMatches with the extra Feature-11 inputs (GitHub projects,
// AI career analysis and academic qualifications):
//   Skills overlap ............ 45
//   Career interests .......... 20
//   AI career analysis ........ 10
//   Academic qualifications ... 15
//   GitHub activity ........... 10

const normalize = (str) => (str || "").toLowerCase().trim();

const toSkillSet = (arr) =>
  [...new Set((arr || []).map(normalize).filter(Boolean))];

// "B.Sc in Computer Science" -> ["b.sc", "computer", "science"]
const keywords = (text) =>
  (normalize(text).match(/[a-z][a-z.+#]{2,}/g) || []).filter(
    (w) => w.replace(/\./g, "").length > 3
  );

// --- 1. Skills overlap (up to 45 points) -------------------------------------
// The student's skill pool is the union of their declared skills plus what we
// can infer from Feature 1 (GitHub top languages) and Feature 9 (project tech
// stacks), so GitHub projects count towards matching without any manual entry.
function scoreSkills(profile, job) {
  const declared = profile.skills || [];
  const githubLangs = profile.githubData?.topLanguages || [];
  const projectTech = (profile.projects || []).flatMap((p) => p.techStack || []);

  const userSkills = toSkillSet([...declared, ...githubLangs, ...projectTech]);
  const jobSkills = toSkillSet(job.skills);

  const matchedSkills = jobSkills.filter((s) => userSkills.includes(s));
  const missingSkills = jobSkills.filter((s) => !userSkills.includes(s));

  let points;
  if (jobSkills.length === 0) {
    points = 22; // neutral base when the job lists no requirements
  } else if (userSkills.length === 0) {
    points = 0;
  } else {
    points = (matchedSkills.length / jobSkills.length) * 45;
  }

  const reasons = [];
  if (matchedSkills.length > 0) {
    reasons.push(
      `Matches ${matchedSkills.length} of your skills: ${matchedSkills.join(", ")}`
    );
  }
  if (missingSkills.length > 0 && matchedSkills.length === 0 && jobSkills.length > 0) {
    reasons.push(`No skill overlap yet - requires ${jobSkills.join(", ")}`);
  }

  return { points, matchedSkills, missingSkills, reasons };
}

// --- 2. Career interests (up to 20 points) ------------------------------------
// A title hit is worth more than a description-only hit because the student
// explicitly told us which roles they are aiming for.
function scoreInterests(profile, job) {
  const interests = toSkillSet(profile.careerInterests);
  if (interests.length === 0) return { points: 10, reason: null }; // neutral

  const title = normalize(job.title);
  const description = normalize(job.description);

  const titleHit = interests.find(
    (i) => title.includes(i) || i.includes(title)
  );
  if (titleHit) {
    return { points: 20, reason: `Title matches your interest in "${titleHit}"` };
  }

  const descHit = interests.find((i) => description.includes(i));
  if (descHit) {
    return { points: 12, reason: `Description mentions your interest in "${descHit}"` };
  }

  return { points: 0, reason: null };
}

// --- 3. AI career analysis (up to 10 points) ----------------------------------
// Feature 4 stores per-role readiness scores from the AI analysis. If one of
// those target roles lines up with this job's title, reward the student for
// how ready the AI thinks they are.
function scoreCareerReadiness(profile, job) {
  const readiness = profile.careerReadiness || [];
  if (readiness.length === 0) return { points: 5, reason: null }; // neutral

  const title = normalize(job.title);

  let best = null;
  for (const entry of readiness) {
    const roleWords = keywords(entry.role);
    const overlapsRole =
      roleWords.some((w) => title.includes(w)) ||
      roleWords.some((w) => w.includes(title) && title.length > 3);
    if (!overlapsRole) continue;

    const score = Math.min(entry.score ?? 0, 100);
    if (!best || score > best.score) best = { score, role: entry.role };
  }

  if (!best) return { points: 0, reason: null };

  return {
    points: (best.score / 100) * 10,
    reason: `Your AI career analysis rates you ${Math.round(best.score)}% ready for ${best.role} roles`,
  };
}

// --- 4. Academic qualifications (up to 15 points) ------------------------------
// Department vs the job's education requirement (keyword overlap, e.g.
// "Computer Science" vs "B.Sc in Computer Science") plus a small recency
// signal from graduation year.
function scoreAcademic(profile, job) {
  // Department vs educationRequirement (10)
  let deptPoints;
  let deptReason = null;
  const reqWords = keywords(job.educationRequirement);
  const deptWords = keywords(profile.department);

  if (reqWords.length === 0) {
    deptPoints = 6; // no stated requirement -> neutral
  } else {
    const overlap = reqWords.filter((w) => deptWords.some((d) => w.includes(d) || d.includes(w)));
    if (overlap.length > 0) {
      deptPoints = 10;
      deptReason = `Fits your ${profile.department} background`;
    } else {
      deptPoints = 3;
    }
  }

  // Graduation recency (5)
  let gradPoints = 3; // unknown graduation year -> neutral
  if (profile.graduationYear) {
    const yearsFromNow = profile.graduationYear - new Date().getFullYear();
    if (yearsFromNow >= 0) gradPoints = 5; // current student / graduating soon
    else if (yearsFromNow >= -3) gradPoints = 4; // recent graduate
    else gradPoints = 2;
  }

  return { points: deptPoints + gradPoints, reason: deptReason };
}

// --- 5. GitHub activity (up to 10 points) --------------------------------------
// A light "this person ships code" signal from Feature 1 data. Language
// overlap is already rewarded in scoreSkills via topLanguages.
function scoreGithubActivity(profile) {
  const repos = profile.githubData?.repos || 0;

  let points;
  let reason = null;
  if (repos >= 10) {
    points = 10;
    reason = `Very active GitHub profile (${repos} public repos)`;
  } else if (repos >= 5) {
    points = 8;
    reason = `Active GitHub profile (${repos} public repos)`;
  } else if (repos >= 2) {
    points = 6;
    reason = `GitHub portfolio with ${repos} repos`;
  } else if (repos >= 1) {
    points = 4;
  } else {
    points = 2; // no GitHub data at all -> low neutral
  }

  return { points, reason };
}

/**
 * Score one job against one student profile.
 * @returns {{matchPercent: number, matchedSkills: string[], missingSkills: string[], reasons: string[]}}
 */
function scoreJob(profile, job) {
  const skills = scoreSkills(profile, job);
  const interests = scoreInterests(profile, job);
  const readiness = scoreCareerReadiness(profile, job);
  const academic = scoreAcademic(profile, job);
  const github = scoreGithubActivity(profile);

  const raw =
    skills.points +
    interests.points +
    readiness.points +
    academic.points +
    github.points;

  const reasons = [
    ...skills.reasons,
    interests.reason,
    readiness.reason,
    academic.reason,
    github.reason,
  ].filter(Boolean);

  return {
    matchPercent: Math.min(Math.round(raw), 100),
    matchedSkills: skills.matchedSkills,
    missingSkills: skills.missingSkills,
    reasons,
  };
}

module.exports = { scoreJob };
