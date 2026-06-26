pipeline {
    agent any
    
    tools {
        maven 'M3' 
        jdk 'JDK17'
    }
    
    environment {
        BACKEND_IMAGE  = "smart-finance-backend:latest"
        FRONTEND_IMAGE = "smart-finance-frontend:latest"
    }

    stages {
        stage('1. Build Java Artifact') {
            steps {
                echo 'Building Java Backend Project...'
                dir('C:/antigravity/smart-finance-tracker/backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('2. Build Docker Images') {
            steps {
                echo 'Building Docker Images...'
                dir('C:/antigravity/smart-finance-tracker') {
                    bat "docker build -t ${BACKEND_IMAGE} ./backend"
                    bat "docker build -t ${FRONTEND_IMAGE} ./frontend"
                }
            }
        }

        stage('3. Integration Test Run') {
            steps {
                echo 'Starting Test Environment inside Docker Network...'
                
                // 1. एक अस्थायी डॉकर नेटवर्क बनाना ताकि कंटेनर्स आपस में सीधे बात कर सकें
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    bat 'docker network create jenkins-test-net'
                }

                // पुराने कंटेनर को हटाना
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    bat 'docker stop test-backend-jenkins && docker rm test-backend-jenkins'
                }

                // 2. बैकएंड कंटेनर को डॉकर नेटवर्क और लोकल होस्ट दोनों के साथ रन करना
                bat "docker run -d --name test-backend-jenkins --network jenkins-test-net -p 8085:8081 -e SPRING_DATASOURCE_PASSWORD=admin --add-host=host.docker.internal:host-gateway ${BACKEND_IMAGE}"
                
                echo 'Waiting 30 seconds for Spring Boot to initialize...'
                bat 'powershell -Command "Start-Sleep -Seconds 30"'

                echo '--- PRINTING DOCKER CONTAINER LOGS ---'
                bat 'docker logs test-backend-jenkins'

                echo 'Testing backend server connectivity inside Docker Network...'
                // 3. विंडोज के क्युरल की जगह सीधे डॉकर के अंदरूनी नेटवर्क के क्युरल का उपयोग (100% फुलप्रूफ)
                bat 'docker run --rm --network jenkins-test-net curlimages/curl -f http://test-backend-jenkins:8081/api/expenses'
            }
            post {
                always {
                    echo 'Cleaning up test environment...'
                    bat 'docker stop test-backend-jenkins && docker rm test-backend-jenkins'
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        bat 'docker network rm jenkins-test-net'
                    }
                }
            }
        }
    }
}
