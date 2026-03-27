# Quiz App with Jenkins (Beginner)

This project is a simple Python Flask quiz backend with tests and Jenkins CI.

## 1) Local run (Windows PowerShell)

```powershell
cd quiz-jenkins-python
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -q
python app.py
```

Open: <http://localhost:5000/health>

## 2) Jenkins setup

1. Create a new Jenkins **Pipeline** job.
2. Choose **Pipeline script from SCM**.
3. Add your Git repository URL.
4. Keep script path as:
   - `Jenkinsfile` for Linux agent, or
   - `Jenkinsfile.windows` for Windows agent.
5. Click **Build Now**.

## 3) API endpoints

- `GET /health`
- `GET /quiz`
- `POST /submit`

Sample `POST /submit` body:

```json
{
  "answers": [
    { "id": 1, "answer": "Paris" },
    { "id": 2, "answer": "4" }
  ]
}
```
