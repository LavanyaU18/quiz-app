from app import app

def test_home():
    client = app.test_client()
    res = client.get('/')
    assert res.status_code == 200

def test_quiz():
    client = app.test_client()
    res = client.get('/quiz')
    assert res.status_code == 200