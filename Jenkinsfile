pipeline {
    agent any

    tools {
        nodejs "node" // Assuming you've configured NodeJS in Jenkins global tools with the name 'node'
    }

    environment {
        DOCKER_IMAGE = 'lamine2000/dev-inhub-plateform-frontend'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm // Checks out source code from the repository configured in Jenkins job
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Dockerize') {
            steps {
                script {
                    // Building Docker image
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "-f Dockerfile .")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Login to Docker registry
                    docker.withRegistry('', 'lamine-dockerhub') {
                        // Pushing Docker image
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace'
            cleanWs() // Cleans up the workspace
        }
    }
}
