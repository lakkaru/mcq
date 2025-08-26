import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  FormControlLabel,
  Box,
  Alert,
  Grid,
} from "@mui/material";
import Editor from "../../components/Editor";

export default function CreateQuestionLayout() {
  // Load last exam_info_id and question_number from localStorage if available
  const lastExamInfoId = localStorage.getItem('lastExamInfoId') || "";
  const lastQuestionNumber = localStorage.getItem('lastQuestionNumber') || "";
  const [questionData, setQuestionData] = useState({
    question_number: lastQuestionNumber,
    exam_info_id: lastExamInfoId,
    topic_id: "",
    question_text: "",
    question_type: "MCQ",
    defaultmark: 1,
    generalfeedback: "",
  });
  const [answers, setAnswers] = useState([
    { answer_text: "", fraction: 0.0, feedback: "" },
    { answer_text: "", fraction: 0.0, feedback: "" },
    { answer_text: "", fraction: 0.0, feedback: "" },
    { answer_text: "", fraction: 0.0, feedback: "" },
    { answer_text: "", fraction: 0.0, feedback: "" },
  ]);
  const [exams, setExams] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchExamInfoAndTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        const examsResponse = await fetch("http://localhost:5000/api/exams");
        if (!examsResponse.ok)
          throw new Error(
            `Failed to fetch exam info: ${examsResponse.statusText}`
          );
        const examsData = await examsResponse.json();
        setExams(examsData);
        const topicsResponse = await fetch("http://localhost:5000/api/topics");
        if (!topicsResponse.ok)
          throw new Error(
            `Failed to fetch topics: ${topicsResponse.statusText}`
          );
        const topicsData = await topicsResponse.json();
        setTopics(topicsData);
      } catch (err) {
        setError(`Error loading data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchExamInfoAndTopics();
  }, []);

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
    if (name === "exam_info_id") {
      localStorage.setItem('lastExamInfoId', value);
    }
    if (name === "question_number") {
      localStorage.setItem('lastQuestionNumber', value);
    }
  };
  const handleQuestionTextChange = (e) => {
    setQuestionData((prev) => ({ ...prev, question_text: e.target.value }));
  };
  const handleGeneralFeedbackChange = (e) => {
    setQuestionData((prev) => ({ ...prev, generalfeedback: e.target.value }));
  };
  const handleAddAnswer = () => {
    setAnswers((prev) => [
      ...prev,
      { answer_text: "", fraction: 0.0, feedback: "" },
    ]);
  };
  const handleRemoveAnswer = (index) => {
    if (answers.length <= 5) return; // Prevent removing below five
    setAnswers((prev) => prev.filter((_, i) => i !== index));
  };
  const handleAnswerChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newAnswers = [...answers];
    if (type === "checkbox") {
      newAnswers[index][name] = checked ? 1.0 : 0.0;
      if (checked) {
        newAnswers.forEach((ans, i) => {
          if (i !== index) ans.fraction = 0.0;
        });
      }
    } else {
      newAnswers[index][name] = value;
    }
    setAnswers(newAnswers);
  };
  const handleAnswerTextChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index].answer_text = e.target.value;
    setAnswers(newAnswers);
  };
  const handleAnswerFeedbackChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index].feedback = e.target.value;
    setAnswers(newAnswers);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    const correctAnswers = answers.filter((ans) => ans.fraction === 1.0);
    if (correctAnswers.length === 0) {
      setError("Please mark at least one answer as correct.");
      setLoading(false);
      return;
    }
    if (correctAnswers.length > 1) {
      setError("Only one answer can be marked as correct for this MCQ type.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        ...questionData,
        exam_info_id: parseInt(questionData.exam_info_id),
        topic_id: questionData.topic_id ? parseInt(questionData.topic_id) : null,
        question_number: questionData.question_number
          ? parseInt(questionData.question_number)
          : null,
        defaultmark: questionData.defaultmark
          ? parseInt(questionData.defaultmark)
          : null,
        answers: answers,
      };
      // Log the payload to inspect what is being sent to the backend
      console.log("Submitting payload:", payload);
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let responseData;
      if (!response.ok) {
        let errorMsg = "Failed to add question.";
        const contentType = response.headers.get("content-type");
        try {
          if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
            errorMsg = responseData.message || errorMsg;
          } else {
            const text = await response.text();
            errorMsg = text || errorMsg;
          }
        } catch {
          errorMsg = "Failed to parse error response.";
        }
        throw new Error(errorMsg);
      } else {
        responseData = await response.json();
      }
      setSuccessMessage("Question added successfully!");
      // Scroll to top so user sees the success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clear form only after successful submission
      const nextQuestionNumber = questionData.question_number
        ? String(Number(questionData.question_number) + 1)
        : "";
      localStorage.setItem('lastQuestionNumber', nextQuestionNumber);
      // Clear form immediately after successful submission
      setQuestionData((prev) => ({
        question_number: nextQuestionNumber,
        exam_info_id: localStorage.getItem('lastExamInfoId') || "",
        topic_id: "",
        question_text: "", // clear question text
        question_type: "MCQ",
        defaultmark: 1,
        generalfeedback: "", // clear general feedback
      }));
      setAnswers([
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
      ]);
    } catch (err) {
      setError(`Error adding question: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !exams.length && !topics.length && !error) {
    return (
      <Container
        maxWidth="md"
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" color="primary">
          Loading Exam Info and Topics...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Add New MCQ Question
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Question Details
          </Typography>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="exam-info-label">Exam Info</InputLabel>
                <Select
                  labelId="exam-info-label"
                  id="exam_info_id"
                  name="exam_info_id"
                  value={questionData.exam_info_id}
                  label="Exam Info"
                  onChange={handleQuestionChange}
                  required
                >
                  <MenuItem value="">Select Exam</MenuItem>
                  {exams.map((exam) => (
                    <MenuItem key={exam.id} value={exam.id}>
                      {exam.exam} ({exam.year}) - {exam.subject} ({exam.lang})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Question Number"
                type="number"
                name="question_number"
                value={questionData.question_number}
                onChange={handleQuestionChange}
                fullWidth
                margin="normal"
                placeholder="e.g., 1"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="topic-label">Topic</InputLabel>
                <Select
                  labelId="topic-label"
                  id="topic_id"
                  name="topic_id"
                  value={questionData.topic_id}
                  label="Topic"
                  onChange={handleQuestionChange}
                >
                  <MenuItem value="">Select Topic</MenuItem>
                  {topics.map((topic) => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.topic} ({topic.subject})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Default Mark"
                type="number"
                name="defaultmark"
                value={questionData.defaultmark}
                onChange={handleQuestionChange}
                fullWidth
                margin="normal"
                placeholder="e.g., 1"
              />
            </Grid>
            <Grid item xs={12}>
              {/* Use only Lexical editor for Question Text */}
              <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>
                Question Text
              </Typography>
              <Editor
                key="question-editor"
                value={questionData.question_text}
                onChange={(val) => {
                  setQuestionData((prev) => ({ ...prev, question_text: val }));
                }}
                placeholder="Enter the full question text here..."
                autoFocus={true}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Use Lexical editor for General Feedback */}
              <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>
                General Feedback
              </Typography>
              <Editor
                key="general-feedback-editor"
                value={questionData.generalfeedback}
                onChange={(val) => {
                  setQuestionData((prev) => ({ ...prev, generalfeedback: val }));
                  // console.log('generalfeedback changed:', val);
                }}
                placeholder="Optional general feedback for the question..."
                variant="general-feedback"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Question Type"
                name="question_type"
                value={questionData.question_type}
                onChange={handleQuestionChange}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
                placeholder="e.g., MCQ"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Answers
            </Typography>
            {answers.map((answer, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 4, // Increased margin bottom for more gap between answers
                  position: "relative",
                  background: "#f9f9f9",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    position: "absolute",
                    top: -18,
                    left: 16,
                    background: "#fff",
                    px: 1,
                  }}
                >
                  Answer {index + 1}
                </Typography>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    {/* Use Lexical editor for Answer Text */}
                    <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'left' }}>
                      Answer Text
                    </Typography>
                    <Editor
                      key={`answer-editor-${index}`}
                      value={answer.answer_text}
                      onChange={val => {
                        const newAnswers = [...answers];
                        newAnswers[index].answer_text = val;
                        setAnswers(newAnswers);
                        // console.log('answer_text changed:', val);
                      }}
                      placeholder="Enter answer text"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="fraction"
                          checked={answer.fraction === 1.0}
                          onChange={(e) => handleAnswerChange(index, e)}
                          color="success"
                        />
                      }
                      label="Correct Answer"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* Use Lexical editor for Answer Feedback */}
                    <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'left' }}>
                      Answer Feedback
                    </Typography>
                    <Editor
                      key={`answer-feedback-editor-${index}`}
                      value={answer.feedback}
                      onChange={val => {
                        const newAnswers = [...answers];
                        newAnswers[index].feedback = val;
                        setAnswers(newAnswers);
                        // console.log('answer feedback changed:', val);
                      }}
                      placeholder="Optional feedback for this answer..."
                      variant="feedback"
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
            {/* <Button
              variant="contained"
              color="secondary"
              onClick={handleAddAnswer}
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              Add Another Answer
            </Button> */}
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ px: 6, py: 2, fontWeight: "bold", fontSize: "1.1rem" }}
            >
              {loading ? "Adding Question..." : "Add Question"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
