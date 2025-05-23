import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState("");

  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setReview(""); // Clear previous review
    try {
      const response = await axios.post(
        "https://ai-code-review-l74v.onrender.com/ai/get-review",
        {
          code,
        }
      );
      setReview(response.data);
    } catch (error) {
      setReview("❌ Error fetching review.", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="left">
        <div className="instructions">
          <h2>👨‍💻 How to Use:</h2>
          <ol>
            <li>Type or paste your code in the editor below.</li>
            <li>
              Click on <strong>"Review Code"</strong> to get suggestions.
            </li>
            <li>See the AI-powered review on the right.</li>
          </ol>
        </div>

        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            placeholder="// Paste or type your code here"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>

        <div
          onClick={code.trim() ? reviewCode : null}
          className={`review ${!code.trim() ? "disabled" : ""}`}
        >
          Review Code
        </div>
      </div>

      <div className="right">
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
            <p>Analyzing your code...</p>
          </div>
        ) : review ? (
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        ) : (
          <div className="placeholder">
            <h2>🛠️ Review your code</h2>
            <p>
              Paste your code on the left and click{" "}
              <strong>"Review Code"</strong> to see AI suggestions here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
