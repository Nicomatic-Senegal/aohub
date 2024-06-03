pipeline {
    agent any

    tools {
        nodejs "node" // Assuming you've configured NodeJS in Jenkins global tools with the name 'node'
    }

    environment {
        DOCKER_IMAGE = 'lamine2000/prod-inhub-plateform-frontend'
        DOCKER_TAG = "build-${new Date().format('yyyyMMddHHmmss')}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm // Checks out source code from the repository configured in Jenkins job
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
                        def builtImage = docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        builtImage.push('latest')

                        // builtImage.push('latest')
                    }
                }
            }
        }

      stage('Trigger Deployment') {
            steps {
                httpRequest url:"http://dev.plateforme-inhub.com:1888", validResponseCodes:'200'
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
