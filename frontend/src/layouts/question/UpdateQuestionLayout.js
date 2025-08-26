import React, { useState, useEffect, useRef } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Grid, Alert, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import Editor from "../../components/Editor";
import { fetchQuestionByExamAndNumber, fetchQuestionNumbersByExam, updateQuestion } from "../../api/question";

export default function UpdateQuestionLayout() {
  const [questionNumbers, setQuestionNumbers] = useState([]);
  const [qnLoading, setQnLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [questionNumber, setQuestionNumber] = useState("");
  const [questionData, setQuestionData] = useState({
    question_number: "",
    question_text: "",
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fetching, setFetching] = useState(false);
  
  // Create a ref for the question text editor
  const questionEditorRef = useRef(null);

  // Fetch exams on mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/exams");
        if (!res.ok) throw new Error("Failed to fetch exams");
        const data = await res.json();
        setExams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch question numbers when exam changes
  useEffect(() => {
    if (!selectedExamId) {
      setQuestionNumbers([]);
      setQuestionNumber("");
      return;
    }
    setQnLoading(true);
    fetchQuestionNumbersByExam(selectedExamId)
      .then(nums => {
        setQuestionNumbers(nums || []);
        setQuestionNumber("");
      })
      .catch(() => setQuestionNumbers([]))
      .finally(() => setQnLoading(false));
  }, [selectedExamId]);

  // Fetch question when exam and question number are selected
  const handleFetchQuestion = async () => {
    if (!selectedExamId || !questionNumber) {
      setError("Please select exam and enter question number.");
      return;
    }
    setError(null);
    setFetching(true);
    try {
      const q = await fetchQuestionByExamAndNumber(selectedExamId, questionNumber);
      console.log('[UpdateQuestionLayout] Backend response for question:', q);
      if (!q) throw new Error("Question not found");
      // Debug: log all fields to inspect what is being loaded into editors
      console.log('[DEBUG] question_text:', q.question_text);
      console.log('[DEBUG] generalfeedback:', q.generalfeedback);
      if (q.answers) {
        q.answers.forEach((a, i) => {
          console.log(`[DEBUG] answer[${i}].answer_text:`, a.answer_text);
          console.log(`[DEBUG] answer[${i}].feedback:`, a.feedback);
        });
      }
      setQuestionData({
        id: q.id || null, // Ensure id is set if available
        question_number: q.question_number || questionNumber,
        question_text: q.question_text || "",
        defaultmark: q.defaultmark || 1,
        generalfeedback: q.generalfeedback || "",
      });
      setAnswers(q.answers || [
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
        { answer_text: "", fraction: 0.0, feedback: "" },
      ]);
      setSuccessMessage("Question loaded. You can now update it.");
      
      // Use setTimeout to ensure DOM is updated before focusing
      setTimeout(() => {
        if (questionEditorRef.current) {
          questionEditorRef.current.focus();
        }
      }, 100);
      
    } catch (err) {
      setError(err.message);
      setSuccessMessage(null);
    } finally {
      setFetching(false);
    }
  };
  // Placeholder for fetching and updating logic

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newAnswers = [...answers];
    if (type === "checkbox" && name === "fraction") {
      // Handle correct answer checkbox
      newAnswers[index][name] = checked ? 1.0 : 0.0;
      if (checked) {
        // If this answer is marked as correct, unmark all others
        newAnswers.forEach((ans, i) => {
          if (i !== index) ans.fraction = 0.0;
        });
      }
    } else {
      newAnswers[index][name] = value;
    }
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // You may need to fetch the question ID from the loaded data or backend
      // Here, we assume questionData has an id field (add it if needed)
      const id = questionData.id;
      if (!id) throw new Error("No question ID found. Cannot update.");
      const payload = {
        question_number: questionData.question_number,
        question_text: questionData.question_text,
        defaultmark: questionData.defaultmark,
        generalfeedback: questionData.generalfeedback,
        answers: answers.map(a => ({
          ...a,
          answer_text: a.answer_text,
          feedback: a.feedback,
        })),
      };
      await updateQuestion(id, payload);
      setSuccessMessage("Question updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Update Question
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {/* Step 1: Select Exam and Question Number */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="exam-select-label">Exam</InputLabel>
            <Select
              labelId="exam-select-label"
              value={selectedExamId}
              label="Exam"
              onChange={e => setSelectedExamId(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">Select Exam</MenuItem>
              {exams.map(exam => (
                <MenuItem key={exam.id} value={exam.id}>
                  {exam.exam} ({exam.year}) - {exam.subject} ({exam.lang})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} size="small" disabled={!selectedExamId || qnLoading}>
            <InputLabel id="question-number-label">Question Number</InputLabel>
            <Select
              labelId="question-number-label"
              value={String(questionNumber || "")}
              label="Question Number"
              onChange={e => setQuestionNumber(e.target.value)}
              disabled={!selectedExamId || qnLoading}
            >
              <MenuItem value="">Select Question</MenuItem>
              {questionNumbers.map((num, idx) => (
                <MenuItem key={`qn-option-${idx}`} value={String(num)}>{num}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchQuestion}
            disabled={fetching || loading || !selectedExamId || !questionNumber}
          >
            {fetching ? "Loading..." : "Load Question"}
          </Button>
        </Box>
        {/* Step 2: Show form only if question is loaded */}
        {questionData && questionData.question_number && (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Question Details
            </Typography>
            <Grid container spacing={2} direction="column">
              <Grid>
                <TextField
                  label="Question Number"
                  type="number"
                  name="question_number"
                  value={questionData.question_number}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  placeholder="e.g., 1"
                  disabled
                />
              </Grid>
              <Grid>
                <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>
                  Question Text
                </Typography>
                <Editor
                  key={`question-editor-${questionData.question_number}`}
                  value={questionData.question_text || "<p></p>"}
                  onChange={val => setQuestionData(prev => ({ ...prev, question_text: val }))}
                  placeholder="Edit the question text here..."
                  ref={questionEditorRef}
                  autoFocus={true}
                />
              </Grid>
              <Grid>
                <TextField
                  label="Default Mark"
                  type="number"
                  name="defaultmark"
                  value={questionData.defaultmark}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  placeholder="e.g., 1"
                />
              </Grid>
              <Grid>
                <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>
                  General Feedback
                </Typography>
                <Editor
                  key={`general-feedback-editor-${questionData.question_number}`}
                  value={questionData.generalfeedback}
                  onChange={val => setQuestionData(prev => ({ ...prev, generalfeedback: val }))}
                  placeholder="Edit general feedback..."
                  variant="general-feedback"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Answers
              </Typography>
              {answers.map((answer, index) => {
                // Always guarantee unique key by combining question number and index (and id if present)
                const answerKey = `q${questionData.question_number}-a${index}-${answer.id || 'noid'}`;
                return (
                  <Paper key={`answer-paper-${answerKey}`} variant="outlined" sx={{ p: 2, mb: 2, background: "#f9f9f9" }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Answer {index + 1}
                    </Typography>
                    <Editor
                      key={`answer-editor-${answerKey}`}
                      value={answer.answer_text}
                      onChange={val => {
                        const newAnswers = [...answers];
                        newAnswers[index].answer_text = val;
                        setAnswers(newAnswers);
                      }}
                      placeholder="Edit answer text"
                    />
                    <Box sx={{ my: 1 }}>
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
                    </Box>
                    <Editor
                      key={`answer-feedback-editor-${answerKey}`}
                      value={answer.feedback}
                      onChange={val => {
                        const newAnswers = [...answers];
                        newAnswers[index].feedback = val;
                        setAnswers(newAnswers);
                      }}
                      placeholder="Edit answer feedback"
                      variant="feedback"
                    />
                  </Paper>
                );
              })}
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
                {loading ? "Updating..." : "Update Question"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
