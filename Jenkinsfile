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

        stage('Docker Build') {
            steps {
                sh '''
                    docker compose build
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