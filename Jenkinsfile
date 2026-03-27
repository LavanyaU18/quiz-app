pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/YOUR_REPO.git'
            }
        }

        stage('Install') {
            steps {
                bat 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                bat 'pytest'
            }
        }

        stage('Run App') {
            steps {
                bat 'python app.py'
            }
        }
    }
}