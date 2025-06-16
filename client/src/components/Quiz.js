import React, { useState } from "react";
import axios from "axios";
import "./Quiz.css";

const Quiz = () => {
  const [cleanliness, setCleanliness] = useState(1);
  const [socialActivities, setSocialActivities] = useState(1);
  const [workHabits, setWorkHabits] = useState(1);
  const [sleepSchedule, setSleepSchedule] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [average, setAverage] = useState(null);
  const [category, setCategory] = useState("");

  const getCategory = (avg) => {
    if (avg <= 1.75) return "Introverted & Structured";
    if (avg <= 2.5) return "Balanced";
    if (avg <= 3.25) return "Flexible";
    return "Extroverted & Chill";
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:5000/api/quiz/submit",
        {
          cleanliness,
          social_activities: socialActivities,
          work_habits: workHabits,
          sleep_schedule: sleepSchedule,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const total = cleanliness + socialActivities + workHabits + sleepSchedule;
      const avg = total / 4;
      const cat = getCategory(avg);

      setAverage(avg.toFixed(2));
      setCategory(cat);
      setSubmitted(true);
    } catch (err) {
      console.error("Quiz submission failed:", err);
    }
  };

  if (submitted) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">
          <h3>Thank you for taking the quiz!</h3>
          <p>
            <strong>Your average score:</strong> {average}
          </p>
          <p>
            <strong>Compatibility category:</strong> {category}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <h2>Take the Roommate Compatibility Quiz</h2>
        <form onSubmit={handleQuizSubmit}>
          <div>
            <label>How tidy are you?</label>
            <small>1 = Very tidy, 4 = Very messy</small>
            <select
              value={cleanliness}
              onChange={(e) => setCleanliness(Number(e.target.value))}
            >
              <option value="1">Very tidy</option>
              <option value="2">Tidy</option>
              <option value="3">Somewhat messy</option>
              <option value="4">Very messy</option>
            </select>
          </div>

          <div>
            <label>How social are you?</label>
            <small>1 = Prefer solitude, 4 = Party animal</small>
            <select
              value={socialActivities}
              onChange={(e) => setSocialActivities(Number(e.target.value))}
            >
              <option value="1">Prefer solitude</option>
              <option value="2">Occasional hangouts</option>
              <option value="3">Very social</option>
              <option value="4">Party animal</option>
            </select>
          </div>

          <div>
            <label>What are your work habits?</label>
            <small>1 = Always home, 4 = Work late hours</small>
            <select
              value={workHabits}
              onChange={(e) => setWorkHabits(Number(e.target.value))}
            >
              <option value="1">Always home</option>
              <option value="2">9 to 5 schedule</option>
              <option value="3">Balanced</option>
              <option value="4">Work late hours</option>
            </select>
          </div>

          <div>
            <label>What is your typical sleep schedule?</label>
            <small>1 = Very early sleeper, 4 = Very late sleeper</small>
            <select
              value={sleepSchedule}
              onChange={(e) => setSleepSchedule(Number(e.target.value))}
            >
              <option value="1">Go to bed before 10 PM</option>
              <option value="2">Go to bed between 10 PM – 12 AM</option>
              <option value="3">Go to bed between 12 AM – 2 AM</option>
              <option value="4">Go to bed after 2 AM</option>
            </select>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Quiz;