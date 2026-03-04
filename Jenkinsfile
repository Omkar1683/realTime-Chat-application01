pipeline {
    agent any

    tools {
        // Ensure these are configured in Jenkins Global Tool Configuration
        nodejs 'Node18'
        maven  'Maven3'
        jdk    'JDK24'
    }

    environment {
        MONGO_URI    = 'mongodb://localhost:27017/chatapp_test'
        JWT_SECRET   = 'jenkins-test-secret'
        CLIENT_URL   = 'http://localhost:3000'
        PORT         = '5000'
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        // ── Stage 2: Backend – Install & Test (Node/Jest) ──────────────────────
        stage('Backend - Install Dependencies') {
            steps {
                dir('backend') {
                    echo 'Installing backend Node.js dependencies...'
                    sh 'npm install'
                }
            }
        }

        stage('Backend - Unit Tests (Jest)') {
            steps {
                dir('backend') {
                    echo 'Running Jest unit tests...'
                    sh 'npm test -- --ci --reporters=default --reporters=jest-junit'
                }
            }
            post {
                always {
                    junit 'backend/junit.xml'
                }
            }
        }

        // ── Stage 3: Frontend – Install & Build ────────────────────────────────
        stage('Frontend - Install Dependencies') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    echo 'Building React app...'
                    sh 'npm run build'
                }
            }
        }

        // ── Stage 4: Selenium/TestNG Tests (Java) ─────────────────────────────
        stage('Selenium/TestNG - Build') {
            steps {
                dir('selenium-tests') {
                    echo 'Compiling Selenium/TestNG test classes...'
                    sh 'mvn clean compile -q'
                }
            }
        }

        stage('Selenium/TestNG - Run Tests') {
            steps {
                dir('selenium-tests') {
                    script {
                        echo 'Starting Backend Server...'
                        dir('../backend') {
                            bat 'call npx pm2 start server.js --name test-backend'
                        }

                        echo 'Starting Frontend Server...'
                        dir('../frontend') {
                            bat 'call npx pm2 serve dist 3000 --name test-frontend --spa'
                        }

                        echo 'Waiting for servers to start...'
                        sleep 15
                        
                        echo 'Seeding test database...'
                        dir('../backend') {
                            bat 'node seed.js'
                        }

                        echo 'Running Selenium/TestNG tests...'
                        // Catch errors so the pipeline can proceed to kill servers
                        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                            bat 'mvn test -Dheadless=true'
                        }
                    }
                }
            }
            post {
                always {
                    // Stop and remove the PM2 background servers
                    bat 'call npx pm2 delete test-backend test-frontend || exit 0'

                    // Ensure PM2 daemon is killed so workspace can be deleted
                  

         
                }
            }
        }

        // ── Stage 5: Deploy ────────────────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // Using Windows batch commands for PM2 deployment
                bat '''
                    echo "Stopping existing backend (if any)..."
                    call npx pm2 stop chat-backend || exit 0

                    echo "Starting backend with PM2..."
                    cd backend && npm install --omit=dev
                    call npx pm2 start server.js --name chat-backend --update-env || call npx pm2 restart chat-backend

                    echo "Deploy complete!"
                '''
            }
        }
    }

    // ── Post-build Actions ─────────────────────────────────────────────────────
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline FAILED. Check the logs above.'
            // emailext(
            //   subject: "BUILD FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //   body: "See: ${env.BUILD_URL}",
            //   to: 'your-email@example.com'
            // )
        }
        always {
            echo 'Deployment finished. (Skipping cleanWs to keep deployed files alive in PM2)'
            // cleanWs()
        }
    }
}
