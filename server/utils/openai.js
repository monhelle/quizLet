// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// const generateQuiz = async (lessonContent, questionCount, quizTypes) => {
//   try {
//     const prompt = `
//       Create a quiz based on the following lesson content:
//       "${lessonContent}"
      
//       Generate ${questionCount} questions using the following types: ${quizTypes.join(', ')}
      
//       Format the response as a JSON array with the following structure for each question:
//       {
//         "type": "question type",
//         "question": "the question",
//         "options": ["array of options for multiple choice/true-false"],
//         "correctAnswer": "the correct answer",
//         "explanation": "explanation of the answer"
//       }
//     `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful teaching assistant that creates quizzes based on lesson content."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 2000
//     });
//     console.log(response.choices[0].message.content);
//     const quizData = JSON.parse(response.choices[0].message.content);
//     return quizData;
//   } catch (error) {
//     console.error('OpenAI Error:', error);
//     throw new Error('Failed to generate quiz');
//   }
// };

// module.exports = { generateQuiz }; 


const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateQuiz = async (lessonContent, questionCount, quizTypes) => {
  try {
    const prompt = `
      Based on this lesson content: "${lessonContent}"
      
      Create a quiz with exactly ${questionCount} questions using these types: ${quizTypes.join(', ')}
      
      Respond with ONLY a JSON array of questions. Do not include any markdown formatting or json tags.
      Each question should follow this structure:
      {
        "type": "question type",
        "question": "the question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "the correct option",
        "explanation": "explanation of the answer"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a quiz generator that responds with clean JSON arrays only. No markdown formatting or additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Clean the response content
    let content = response.choices[0].message.content.trim();
    
    // Remove any markdown formatting if present
    if (content.startsWith('```')) {
      content = content.replace(/```json\n?|```\n?/g, '');
    }

    // Parse the cleaned JSON
    try {
      const quizData = JSON.parse(content);
      return quizData;
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      console.error('Content to parse:', content);
      throw new Error('Failed to parse quiz data');
    }
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('Failed to generate quiz');
  }
};

module.exports = { generateQuiz };