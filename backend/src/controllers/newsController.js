const axios = require('axios');

const getTechNews = async (req, res, next) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'API key is missing in server configuration.' });
    }

    // 1. Fetch Real Bangladesh Software Jobs (Remotive API)
    // This API provides real, daily updated remote software engineering jobs available to candidates in Bangladesh.
    const jobsResponse = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&search=bangladesh');
    
    const formattedJobs = (jobsResponse.data.jobs || []).slice(0, 10).map(job => ({
      title: job.title,
      description: `Hiring at ${job.company_name}. Required skills: ${job.category}.`,
      url: job.url,
      imageUrl: job.company_logo || null,
      source: job.company_name,
      publishedAt: job.publication_date
    }));

    // 2. Fetch Industry Trends (NewsAPI)
    // This fetches the latest news articles about the software industry.
    const trendsQuery = '"software engineering" OR "tech industry"';
    const trendsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(trendsQuery)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
    
    const trendsResponse = await axios.get(trendsUrl);
    
    const formattedTrends = (trendsResponse.data.articles || []).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));

    // Return both arrays so the frontend can display them in two tabs
    res.json({ 
      jobs: formattedJobs,
      trends: formattedTrends
    });

  } catch (error) {
    console.error('Error fetching career data:', error.message);
    res.status(500).json({ message: 'Error fetching latest career data. Please try again later.' });
  }
};

module.exports = { getTechNews };
