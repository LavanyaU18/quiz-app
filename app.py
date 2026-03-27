from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

QUIZ = [
    {"id": 1, "category": "GK", "question": "Capital of France updated yeahhhhhhh?", "options": ["Berlin","Paris","Rome"], "answer": "Paris"},
    {"id": 2, "category": "Math", "question": "5 + 3 = dp", "options": ["6","8","10"], "answer": "8"},
    {"id": 3, "category": "CS", "question": "HTML stands for?", "options": ["Hyper Text Markup Language","HighText Machine Language","None"], "answer": "Hyper Text Markup Language"},
    {"id": 4, "category": "GK", "question": "Largest planet?", "options": ["Earth","Mars","Jupiter"], "answer": "Jupiter"},
    {"id": 5, "category": "Math", "question": "10 * 2 = ?", "options": ["20","10","5"], "answer": "20"},
    {"id": 6, "category": "GK", "question": "National animal of India?", "options": ["Lion","Tiger","Elephant"], "answer": "Tiger"},
    {"id": 7, "category": "CS", "question": "CPU stands for?", "options": ["Central Processing Unit","Control Process Unit","Computer Personal Unit"], "answer": "Central Processing Unit"},
    {"id": 8, "category": "Math", "question": "12 / 4 = ?", "options": ["2","3","4"], "answer": "3"},
    {"id": 9, "category": "GK", "question": "Which ocean is largest?", "options": ["Atlantic","Indian","Pacific"], "answer": "Pacific"},
    {"id": 10, "category": "CS", "question": "Java is a?", "options": ["Programming Language","Operating System","Browser"], "answer": "Programming Language"}
]
@app.route('/')
def index():
    return render_template('index.html')

@app.get("/quiz")
def get_quiz():
    category = request.args.get("category")
    data = QUIZ if not category else [q for q in QUIZ if q["category"] == category]
    safe = [{k:v for k,v in q.items() if k!="answer"} for q in data]
    return jsonify(safe)

@app.post("/submit")
def submit():
    data = request.get_json()
    answers = data.get("answers", [])
    answer_map = {q["id"]: q["answer"] for q in QUIZ}
    
    score = sum(1 for a in answers if answer_map.get(a["id"]) == a["answer"])
    
    return jsonify({"score": score, "total": len(answers)})

if __name__ == "__main__":
    app.run(debug=True)