pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Project Info') {
            steps {
                sh '''
                    echo "================================"
                    echo " URL SHORTENER CI"
                    echo "================================"

                    echo ""
                    echo "Git:"
                    git --version

                    echo ""
                    echo "Docker:"
                    docker --version

                    echo ""
                    echo "Docker Compose:"
                    docker compose version

                    echo ""
                    echo "Project:"
                    ls -la
                '''
            }
        }

        stage('Frontend Lint') {
            steps {
                sh '''
                    cd frontend
                    npm ci
                    npm run lint
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    cd frontend
                    npm run build
                '''
            }
        }

        stage('Backend Check') {
            steps {
                sh '''
                    python3 --version
                    python3 -m py_compile backend/app/*.py
                '''
            }
        }

        stage('Backend Tests') {
            steps {
                sh '''
                    python3 -m venv .venv

                    .venv/bin/pip install --upgrade pip
                    .venv/bin/pip install -r backend/requirements.txt
                    .venv/bin/pip install pytest

                    PYTHONPATH=. .venv/bin/pytest -v tests/
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('Sonarqube') {
                    withCredentials([
                        string(
                            credentialsId: 'SonarQube',
                            variable: 'SONAR_TOKEN'
                        )
                    ]) {
                        sh '''
                            sonar-scanner \
                            -Dsonar.token="$SONAR_TOKEN"
                        '''
                    }
                }
            }
        }   

        stage('SonarQube Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                    echo "================================"
                    echo " TRIVY FILESYSTEM SECURITY SCAN"
                    echo "================================"

                    trivy fs \
                    --scanners vuln,secret \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    .
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker compose build
                '''
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh '''
                    echo "================================"
                    echo " TRIVY DOCKER IMAGE SCAN"
                    echo "================================"

                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    devops-url-shortener-backend:latest

                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    devops-url-shortener-frontend:latest
                '''
            }
        }
    }


    post {
        success {
            echo 'CI SUCCESS'
        }

        failure {
            echo 'CI FAILED'
        }
    }
}