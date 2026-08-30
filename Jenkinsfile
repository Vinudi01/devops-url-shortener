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

        stage('Docker Check') {
            steps {
                sh '''
                    echo "Running containers:"
                    docker ps
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
