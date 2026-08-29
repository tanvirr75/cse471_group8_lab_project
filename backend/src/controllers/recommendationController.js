// Feature 11: Smart Job Recommendation System
//
// GET /api/recommendations (students only)
//
// "Continuous comparison" semantics: the engine only re-scores a job when the
// cached Recommendation is missing or stale - i.e. the job was posted/edited
// after the score was computed, or the student's profile changed since then.
// Everything else is served from the Recommendation collection, so a student
// polling this endpoint every minute costs almost nothing.
const Job = require("../models/Job");
const UserProfile = require("../models/UserProfile");
const Recommendation = require("../models/Recommendation");
<<<<<<< HEAD
const Notification = require("../models/Notification");
const { scoreJob } = require("../services/recommendationEngine");

// Feature 12: threshold above which a new job match triggers an in-app
// notification. Kept as a simple constant (default 80) per requirement.
const MATCH_NOTIFY_THRESHOLD = 80;

=======
const { scoreJob } = require("../services/recommendationEngine");

>>>>>>> origin/main
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    // ?refresh=true re-scores every open job even if the cache looks fresh.
    const forceRefresh = req.query.refresh === "true";

    const [profile, jobs] = await Promise.all([
      UserProfile.findOne({ userId }),
      Job.find({ status: "open" }).sort({ createdAt: -1 }),
    ]);

    if (!profile) {
      // Same graceful fallback idea as jobController.getMatches: no profile
      // yet simply means nothing can be scored.
      return res.json([]);
    }

    const cached = await Recommendation.find({ userId });
    const byJobId = new Map(cached.map((r) => [String(r.jobId), r]));

    const isStale = (job, rec) =>
      !rec ||
      forceRefresh ||
      job.updatedAt > rec.computedAt ||
      profile.updatedAt > rec.computedAt;

    const staleJobs = jobs.filter((job) => isStale(job, byJobId.get(String(job._id))));

    await Promise.all(
      staleJobs.map(async (job) => {
        const result = scoreJob(profile, job);
        await Recommendation.findOneAndUpdate(
          { userId, jobId: job._id },
          {
            $set: {
              matchPercent: result.matchPercent,
              matchedSkills: result.matchedSkills,
              missingSkills: result.missingSkills,
              reasons: result.reasons,
              computedAt: new Date(),
            },
          },
          { upsert: true }
        );
<<<<<<< HEAD

        // Feature 12: fire an in-app job-match notification when a newly scored
        // job clears the threshold, so students are alerted promptly. Dedupe so
        // polling/refresh doesn't spam the user with the same match.
        if (result.matchPercent >= MATCH_NOTIFY_THRESHOLD) {
          const alreadyNotified = await Notification.exists({
            userId,
            type: "job_match",
            title: `Job match: ${job.title} at ${job.company}`,
          });
          if (!alreadyNotified) {
            const deadline = job.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "Not specified";
            await Notification.create({
              userId,
              type: "job_match",
              title: `Job match: ${job.title} at ${job.company}`,
              body: `${result.matchPercent}% match. Apply before ${deadline}.`,
              link: `/jobs/${job._id}?match=${result.matchPercent}`,
            });
          }
        }
=======
>>>>>>> origin/main
      })
    );

    // Serve everything from cache (fresh + just-updated), joined with the job,
    // keeping only jobs that are still open. Flattened to {...job, matchPercent}
    // so the response shape matches /api/jobs/matches and the UI cards stay
    // near-identical.
    const openIds = new Set(jobs.map((j) => String(j._id)));
    const all = await Recommendation.find({ userId })
      .populate("jobId")
      .sort({ matchPercent: -1 })
      .lean();

    const recommendations = all
      .filter((r) => r.jobId && openIds.has(String(r.jobId._id)))
      .map(({ jobId, _id, ...rest }) => ({
        ...jobId,
        recommendationId: _id,
        ...rest,
      }));

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
