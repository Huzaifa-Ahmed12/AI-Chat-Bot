import express from 'express';
import axios from 'axios';
import {User} from '../models/User.js';
import {Conversation} from '../models/Conversation.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

// Create or update conversation
router.post('/prompt', verifyJWT, async (req, res) => {
  const { prompt, conversationId } = req.body;
  const userId = req.user.id;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // const user = await User.findById(userId);
    // const fullPrompt = `User's Interests: ${user.interests.join(", ")}\nUser's Prompt: ${prompt}\nGive an example or explanation based on their interests.`;

const user = await User.findById(userId);

const interests = Array.isArray(user?.interests) ? user.interests.join(", ") : "None";

const fullPrompt = `Answer this question clearly and briefly. Provide a proper explanation first. Only if the question relates to the user's interests (${interests}), add relevant examples at the end: ${prompt}`;
   
const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: fullPrompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    let conversation;

    if (conversationId) {
      // Append to existing conversation
      conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $push: {
            messages: [
              { role: 'user', content: prompt },
              { role: 'ai', content: aiMessage }
            ]
          }
        },
        { new: true }
      );
    } else {
      // Create new conversation
      
const titlePrompt = `Give a concise 4-word title for this prompt:\n"${prompt}"`;

const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'openai/gpt-3.5-turbo',
    messages: [{ role: 'user', content: titlePrompt }],
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
);

// Get clean title string (trim quotes or extra lines if any)
const title = response.data.choices[0].message.content.trim().replace(/^"|"$/g, '');

// console.log('Generated Title:', title);

      conversation = new Conversation({
        userId,
        title,
        messages: [
          { role: 'user', content: prompt },
          { role: 'ai', content: aiMessage }
        ]
      });

      await conversation.save();
    }

    res.status(200).json({ message: aiMessage, conversationId: conversation._id });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'AI response failed' });
  }
});

// Get all conversations for user
router.get('/history', verifyJWT, async (req, res) => {
  try {
    const history = await Conversation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ history });
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
