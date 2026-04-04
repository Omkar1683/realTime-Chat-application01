pipeline {
   agent { label 'mern-agent' }

   stages {

       stage('Install Backend') {
           steps {
               dir('backend') {
                   bat 'npm install'
               }
           }
       }

       stage('Start Backend') {
           steps {
               dir('backend') {
                   bat 'start /B npm start'
               }
           }
       }

       stage('Wait') {
           steps {
               bat 'timeout /t 10'
           }
       }

       stage('Run Selenium Tests') {
           steps {
               dir('selenium-tests') {
                   bat 'mvn clean test'
               }
           }
       }
   }

 post {
    always {
        echo 'Build Completed'
    }
}
}
