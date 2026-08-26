const axios = require('axios');
const cheerio = require('cheerio');

async function testBikroy() {
  try {
    const res = await axios.get('https://bikroy.com/en/ads/bangladesh/it-telecoms-jobs', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    
    // Check if there is preloaded state
    const matches = res.data.match(/window\.__INITIAL_STATE__\s*=\s*(.*?);/);
    if (matches && matches[1]) {
      const state = JSON.parse(matches[1]);
      console.log("Found Initial State in Bikroy!");
      // state.adList.ads is usually where they are
    } else {
      console.log("No initial state found.");
    }
    
    const $ = cheerio.load(res.data);
    const jobs = [];
    $('.list--3NxGO a').each((i, el) => {
      jobs.push($(el).attr('href'));
    });
    console.log("Found links:", jobs.length);
    
    // Print all text in h2
    $('h2').each((i, el) => console.log("H2:", $(el).text()));
  } catch (e) {
    console.log("BIKROY FAILED:", e.message);
  }
}

testBikroy();
