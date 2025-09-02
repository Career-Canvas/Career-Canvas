import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Route to fetch a balanced set of personality questions
// GET /api/personality/questions
router.get('/questions', async (req, res) => {
  try {
    // Fetch the full 120 questions from the external API
    const response = await fetch('https://raw.githubusercontent.com/NeuroQuestAi/five-factor-e/main/data/IPIP-NEO/120/questions.json');

    if (!response.ok) {
      console.error(`External API error: Status ${response.status} - ${response.statusText}`);
      throw new Error(`External API responded with status ${response.status}`);
    }

    const data = await response.json();
    const questions = data.questions;

    if (Array.isArray(questions)) {
      // Mapping of keyed and domain for each question ID (1 to 120)
      // This is a comprehensive mapping for the full 120 questions
      const mapping = [
        null, // Index 0 not used
        { keyed: 'plus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'plus', domain: 'O' }, { keyed: 'plus', domain: 'A' },
        { keyed: 'plus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'plus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'plus', domain: 'C' },
        { keyed: 'plus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'plus', domain: 'O' }, { keyed: 'plus', domain: 'A' },
        { keyed: 'plus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'plus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'plus', domain: 'C' },
        { keyed: 'plus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'plus', domain: 'O' }, { keyed: 'minus', domain: 'A' },
        { keyed: 'plus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'plus', domain: 'O' },
        { keyed: 'plus', domain: 'A' }, { keyed: 'minus', domain: 'C' },
        { keyed: 'plus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'plus', domain: 'O' }, { keyed: 'plus', domain: 'A' },
        { keyed: 'plus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'plus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'minus', domain: 'C' },
        { keyed: 'plus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'plus', domain: 'O' }, { keyed: 'plus', domain: 'A' },
        { keyed: 'plus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'minus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'plus', domain: 'C' },
        { keyed: 'minus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'minus', domain: 'O' }, { keyed: 'minus', domain: 'A' },
        { keyed: 'plus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'plus', domain: 'O' },
        { keyed: 'plus', domain: 'A' }, { keyed: 'minus', domain: 'C' },
        { keyed: 'plus', domain: 'N' }, { keyed: 'minus', domain: 'E' },
        { keyed: 'plus', domain: 'O' }, { keyed: 'plus', domain: 'A' },
        { keyed: 'plus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'minus', domain: 'E' }, { keyed: 'minus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'minus', domain: 'C' },
        { keyed: 'plus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'minus', domain: 'O' }, { keyed: 'plus', domain: 'A' },
        { keyed: 'minus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'minus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'minus', domain: 'C' },
        { keyed: 'plus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'plus', domain: 'O' }, { keyed: 'minus', domain: 'A' },
        { keyed: 'minus', domain: 'C' }, { keyed: 'plus', domain: 'N' },
        { keyed: 'minus', domain: 'E' }, { keyed: 'minus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'plus', domain: 'C' },
        { keyed: 'minus', domain: 'N' }, { keyed: 'minus', domain: 'E' },
        { keyed: 'minus', domain: 'O' }, { keyed: 'minus', domain: 'A' },
        { keyed: 'minus', domain: 'C' }, { keyed: 'minus', domain: 'N' },
        { keyed: 'minus', domain: 'E' }, { keyed: 'minus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'minus', domain: 'C' },
        { keyed: 'minus', domain: 'N' }, { keyed: 'plus', domain: 'E' },
        { keyed: 'minus', domain: 'O' }, { keyed: 'minus', domain: 'A' },
        { keyed: 'minus', domain: 'C' }, { keyed: 'minus', domain: 'N' },
        { keyed: 'plus', domain: 'E' }, { keyed: 'minus', domain: 'O' },
        { keyed: 'minus', domain: 'A' }, { keyed: 'minus', domain: 'C' },
        { keyed: 'minus', domain: 'N' }, { keyed: 'plus', domain: 'E' }
      ];

      // Attach the domain and keyed properties to each question object
      questions.forEach(q => {
        const m = mapping[q.id];
        if (m) {
          q.keyed = m.keyed;
          q.domain = m.domain;
        } else {
          console.error(`No mapping for question ID ${q.id}`);
        }
      });

      // Filter to get exactly 9 questions for each domain for a balanced test
      const finalQuestions = { O: [], C: [], E: [], A: [], N: [] };
      const questionsPerDomain = 9;

      questions.forEach(q => {
        if (finalQuestions[q.domain] && finalQuestions[q.domain].length < questionsPerDomain) {
          finalQuestions[q.domain].push(q);
        }
      });
      
      // Combine all selected questions into a single array
      const reducedQuestions = Object.values(finalQuestions).flat();
      res.status(200).json(reducedQuestions);
    } else {
      console.error('External API returned invalid data format:', data);
      throw new Error('Invalid data format from external API. Expected an object with "questions" array.');
    }
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).json({ error: 'Failed to fetch questions from the external API.' });
  }
});

// Route to calculate personality scores
// POST /api/personality/score
router.post('/score', (req, res) => {
  const { answers, questions } = req.body;

  if (!answers || !questions || !Array.isArray(questions) || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Invalid input. "answers" and "questions" are required.' });
  }

  try {
    const rawScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    const percentages = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    const questionsPerDomain = 9;
    const minScore = 1 * questionsPerDomain;
    const maxScore = 5 * questionsPerDomain;
    const range = maxScore - minScore;

    questions.forEach(q => {
      if (!q.id || !q.keyed || !q.domain) return;
      
      const answer = answers[q.id];

      if (answer && typeof answer === 'number' && answer >= 1 && answer <= 5) {
        // Calculate score based on keyed value
        const score = q.keyed === 'plus' ? answer : 6 - answer;
        
        if (rawScores[q.domain] !== undefined) {
          rawScores[q.domain] += score;
        }
      }
    });

    // Calculate final percentage for each domain
    for (const domain in rawScores) {
      const rawScore = rawScores[domain];
      const normalizedScore = rawScore - minScore;
      percentages[domain] = ((normalizedScore / range) * 100);
    }

    res.status(200).json({ success: true, scores: percentages });

  } catch (err) {
    console.error('Error calculating scores:', err);
    res.status(500).json({ error: 'An error occurred while calculating scores.' });
  }
});

export const personalityRoutes = router;