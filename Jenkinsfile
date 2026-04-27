pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Backend') {
            steps {
                dir('backend') {
                    bat 'start /B node server.js'
                }
            }
        }

        stage('Build Success') {
            steps {
                echo 'Build Success'
            }
        }

    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
