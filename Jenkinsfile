# Jenkins pipeline for the Kisan Market frontend.

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'make install'
            }
        }

        stage('Test') {
            steps {
                sh 'make test'
            }
        }

        stage('Build') {
            steps {
                sh 'make build'
            }
        }
    }

    post {
        always {
            sh 'rm -rf build'
        }
    }
}
