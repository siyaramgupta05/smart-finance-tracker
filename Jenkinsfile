pipeline {
    agent any
    
    environment {
        BACKEND_IMAGE  = "smart-finance-backend:latest"
        FRONTEND_IMAGE = "smart-finance-frontend:latest"
    }

    stages {
        stage('1. Build Java Artifact') {
            steps {
                echo 'Building Java Backend Project...'
                dir('backend') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('2. Build Docker Images') {
            steps {
                echo 'Building Docker Images for Backend and Frontend...'
                bat "docker build -t ${BACKEND_IMAGE} ./backend"
                bat "docker build -t ${FRONTEND_IMAGE} ./frontend"
            }
        }

        stage('3. Integration Test Run') {
            steps {
                echo 'Starting Backend Container to test database connection...'
                
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat 'docker stop test-backend-jenkins && docker rm test-backend-jenkins'
                }

                bat "docker run -d --name test-backend-jenkins -p 8085:8081 --add-host=host.docker.internal:host-gateway ${BACKEND_IMAGE}"
                
                echo 'Waiting for Spring Boot to start (20 seconds)...'
                bat 'timeout /t 20 /nobreak'

                echo 'Testing endpoint via Curl...'
                bat 'curl -f http://localhost:8085/api/expenses'
            }
            post {
                always {
                    echo 'Cleaning up test container...'
                    bat 'docker stop test-backend-jenkins && docker rm test-backend-jenkins'
                }
            }
        }
    }
}
