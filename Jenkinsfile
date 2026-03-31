pipeline {
    agent any

    environment {
        // Change if you eventually push to Docker Hub
        DOCKER_COMPOSE = 'docker compose' 
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins will automatically check out the code from the Git repository specified in your pipeline config.
                // However, we ensure that we are in the correct workspace directory.
                echo "Checking out from repository..."
                checkout scm
            }
        }

        stage('Build & Deploy with Docker Combine') {
            steps {
                script {
                    echo "Building and restarting containers..."
                    // Shut down existing containers
                    sh "${DOCKER_COMPOSE} down"
                    
                    // Build new containers and start them in the background
                    sh "${DOCKER_COMPOSE} up -d --build"
                }
            }
        }
        
        stage('Verify') {
            steps {
                echo "Checking if containers are running successfully..."
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo "Deployment Successful! Your Quiz App is Live."
        }
        failure {
            echo "Deployment Failed. Please check the logs."
        }
    }
}
