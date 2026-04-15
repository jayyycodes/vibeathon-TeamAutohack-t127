import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { evaluateCode } from '../services/api';

const PRESET_TASKS = [
  {
    title: 'Linear Regression',
    code: `import numpy as np

# Generate sample data
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2.5 * X + np.random.randn(100, 1) * 2 + 5

# Implement linear regression from scratch
X_b = np.c_[np.ones((100, 1)), X]
theta = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)

print(f"Intercept: {theta[0][0]:.4f}")
print(f"Slope: {theta[1][0]:.4f}")
print(f"Prediction for X=5: {theta[0][0] + theta[1][0] * 5:.4f}")`,
  },
  {
    title: 'KNN Classifier',
    code: `import numpy as np
from collections import Counter

class KNNClassifier:
    def __init__(self, k=3):
        self.k = k
    def fit(self, X, y):
        self.X_train = np.array(X)
        self.y_train = np.array(y)
    def predict(self, X):
        return [self._predict(x) for x in np.array(X)]
    def _predict(self, x):
        distances = [np.sqrt(np.sum((x - x_train)**2)) for x_train in self.X_train]
        k_indices = np.argsort(distances)[:self.k]
        k_labels = [self.y_train[i] for i in k_indices]
        return Counter(k_labels).most_common(1)[0][0]

X_train = [[1,2],[2,3],[3,1],[6,5],[7,8],[8,6]]
y_train = [0, 0, 0, 1, 1, 1]
knn = KNNClassifier(k=3)
knn.fit(X_train, y_train)
print(f"Prediction for [5,5]: {knn.predict([[5,5]])[0]}")
print(f"Prediction for [1,1]: {knn.predict([[1,1]])[0]}")`,
  },
  {
    title: 'Decision Tree',
    code: `import numpy as np

def entropy(y):
    hist = np.bincount(y)
    ps = hist / len(y)
    return -np.sum([p * np.log2(p) for p in ps if p > 0])

def information_gain(X, y, feature_idx, threshold):
    left_mask = X[:, feature_idx] <= threshold
    right_mask = ~left_mask
    if sum(left_mask) == 0 or sum(right_mask) == 0:
        return 0
    n = len(y)
    child = (sum(left_mask)/n)*entropy(y[left_mask]) + (sum(right_mask)/n)*entropy(y[right_mask])
    return entropy(y) - child

X = np.array([[2,3],[1,1],[4,5],[6,7],[5,4],[3,2]])
y = np.array([0, 0, 1, 1, 1, 0])

best_gain = 0
for feat in range(X.shape[1]):
    for thresh in np.unique(X[:, feat]):
        gain = information_gain(X, y, feat, thresh)
        if gain > best_gain:
            best_gain = gain
            best_feat, best_thresh = feat, thresh

print(f"Best feature: {best_feat}")
print(f"Best threshold: {best_thresh}")  
print(f"Info gain: {best_gain:.4f}")`,
  },
  {
    title: 'K-Means Clustering',
    code: `import numpy as np

def kmeans(X, k=2, max_iters=100):
    np.random.seed(42)
    centroids = X[np.random.choice(X.shape[0], k, replace=False)]
    for iteration in range(max_iters):
        distances = np.array([np.sqrt(np.sum((X - c)**2, axis=1)) for c in centroids])
        labels = np.argmin(distances, axis=0)
        new_centroids = np.array([X[labels == i].mean(axis=0) for i in range(k)])
        if np.allclose(centroids, new_centroids):
            print(f"Converged at iteration {iteration + 1}")
            break
        centroids = new_centroids
    return labels, centroids

X = np.array([[1,2],[1.5,1.8],[5,8],[8,8],[1,0.6],[9,11]])
labels, centroids = kmeans(X, k=2)
print(f"Labels: {labels}")
print(f"Centroids:\\n{centroids}")`,
  },
  {
    title: 'Neural Network',
    code: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def relu(x):
    return np.maximum(0, x)

class SimpleNN:
    def __init__(self, input_size, hidden_size, output_size):
        np.random.seed(42)
        self.W1 = np.random.randn(input_size, hidden_size) * 0.5
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.5
        self.b2 = np.zeros((1, output_size))
    def forward(self, X):
        self.a1 = relu(X.dot(self.W1) + self.b1)
        return sigmoid(self.a1.dot(self.W2) + self.b2)

nn = SimpleNN(2, 4, 1)
X = np.array([[0,0],[0,1],[1,0],[1,1]])
output = nn.forward(X)
for i, x in enumerate(X):
    print(f"Input {x} -> {output[i][0]:.4f}")`,
  },
];

export default function CodeLabScreen() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(0);
  const [code, setCode] = useState(PRESET_TASKS[0].code);
  const [output, setOutput] = useState('');
  const [evalResult, setEvalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const pyodideRef = useRef(null);

  const loadPyodide = async () => {
    if (pyodideRef.current) { setPyodideReady(true); return; }
    setPyodideLoading(true);
    setOutput('Loading Python runtime...');
    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/' });
      await pyodide.loadPackage('numpy');
      pyodideRef.current = pyodide;
      setPyodideReady(true);
      setOutput('✅ Python ready! Click ▶ Run Code.');
    } catch (err) {
      setOutput(`❌ Failed to load Pyodide: ${err.message}`);
    } finally {
      setPyodideLoading(false);
    }
  };

  useEffect(() => { loadPyodide(); }, []);

  const handleTaskChange = (index) => {
    setSelectedTask(index);
    setCode(PRESET_TASKS[index].code);
    setOutput('');
    setEvalResult(null);
  };

  const handleRunCode = async () => {
    if (!pyodideRef.current) { setOutput('⏳ Loading...'); await loadPyodide(); if (!pyodideRef.current) return; }
    setRunning(true);
    setOutput('Running...');
    setEvalResult(null);
    try {
      pyodideRef.current.runPython(`import sys\nfrom io import StringIO\nsys.stdout = StringIO()`);
      pyodideRef.current.runPython(code);
      const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()');
      setOutput(stdout || '(No output)');
    } catch (err) {
      setOutput(`❌ Error:\n${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setEvalResult(null);
    try {
      const result = await evaluateCode(code, PRESET_TASKS[selectedTask].title);
      setEvalResult(result);
    } catch (err) {
      setEvalResult({ score: 0, feedback: err.message, fix: '' });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (s) => s >= 8 ? 'text-[#2E7D32]' : s >= 5 ? 'text-[#E65100]' : 'text-[#C62828]';

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')} className="p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer">
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="heading-display text-2xl">Code Lab</h1>
              <p className="text-xs text-text-muted">Write, run, and get AI reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${pyodideReady ? 'bg-[#2E7D32]' : 'bg-[#E65100] animate-pulse'}`} />
            <span className="text-xs text-text-muted">{pyodideReady ? 'Ready' : 'Loading...'}</span>
          </div>
        </div>

        {/* Task tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_TASKS.map((task, idx) => (
            <button
              key={idx}
              onClick={() => handleTaskChange(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTask === idx ? 'bg-black text-white' : 'bg-white border-[1.5px] border-border text-text-secondary hover:border-black'
              }`}
            >
              {task.title}
            </button>
          ))}
        </div>

        {/* Editor + Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1A1A1A] rounded-t-xl">
              <span className="text-xs text-[#9C9690] font-mono">editor.py</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C62828]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E65100]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]/60" />
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 min-h-[340px] p-4 bg-[#1A1A1A] rounded-b-xl font-mono text-sm text-[#F0EDE8] resize-none focus:outline-none leading-relaxed border border-[#333] border-t-0"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D0D0D] rounded-t-xl">
              <span className="text-xs text-[#9C9690] font-mono">output</span>
              <span className="text-[10px] text-[#666] uppercase tracking-wider">stdout</span>
            </div>
            <div className="flex-1 min-h-[340px] p-4 bg-[#0D0D0D] rounded-b-xl font-mono text-sm text-[#C8FF00] whitespace-pre-wrap overflow-auto border border-[#333] border-t-0">
              {output || '// Output appears here...'}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={handleRunCode} disabled={running || pyodideLoading} className="btn-accent flex items-center gap-2">
            {running ? (
              <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" /> Running...</>
            ) : '▶ Run Code'}
          </button>
          <button onClick={handleEvaluate} disabled={loading} className="btn-primary w-auto flex items-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Evaluating...</>
            ) : 'Evaluate with AI'}
          </button>
        </div>

        {/* AI Review */}
        {evalResult && (
          <div className="card mt-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">AI Code Review</h3>
              <span className={`text-2xl font-bold font-display ${getScoreColor(evalResult.score)}`}>{evalResult.score}/10</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface mb-4">
              <div className={`h-2.5 rounded-full transition-all duration-1000 ${evalResult.score >= 8 ? 'bg-[#2E7D32]' : evalResult.score >= 5 ? 'bg-[#E65100]' : 'bg-[#C62828]'}`} style={{ width: `${evalResult.score * 10}%` }} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="section-label mb-1">Feedback</p>
                <p className="text-sm text-text-secondary leading-relaxed">{evalResult.feedback}</p>
              </div>
              {evalResult.fix && (
                <div>
                  <p className="section-label mb-1">Suggestion</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{evalResult.fix}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
