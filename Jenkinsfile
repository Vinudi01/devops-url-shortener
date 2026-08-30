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
                    echo "Node:"
                    node --version

                    echo ""
                    echo "NPM:"
                    npm --version

                    echo ""
                    echo "Python:"
                    python3 --version

                    echo ""
                    echo "Docker:"
                    docker --version

                    echo ""
                    echo "Docker Compose:"
                    docker compose version
                '''
            }
        }

        stage('Frontend Lint') {
            steps {
                sh '''
                    echo "================================"
                    echo " FRONTEND LINT"
                    echo "================================"

                    cd frontend

                    npm ci

                    npm run lint
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    echo "================================"
                    echo " FRONTEND BUILD"
                    echo "================================"

                    cd frontend

                    npm run build
                '''
            }
        }

        stage('Backend Check') {
            steps {
                sh '''
                    echo "================================"
                    echo " BACKEND CHECK"
                    echo "================================"

                    python3 -m compileall -q backend/app

                    echo "Backend syntax check passed."
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    echo "================================"
                    echo " DOCKER BUILD"
                    echo "================================"

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

        always {
            echo 'Pipeline finished.'
        }
    }
}