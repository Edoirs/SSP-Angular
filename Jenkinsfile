pipeline {
    agent any

    environment {
        SSH_KEY = credentials('54.195.241.202')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    set -e
                    set -x

                    mkdir -p ~/.ssh
                    chmod 700 ~/.ssh
                    ssh-keyscan 54.195.241.202 >> ~/.ssh/known_hosts

                    scp -i $SSH_KEY -r * ubuntu@54.195.241.202:/var/www/html/WATER-UI
                   

                    sudo rm -rf /var/www/html/niger-water
                
                    cd /var/www/html/WATER-UI    
                    unzip -o dist.zip
                    
                    cd dist
                    
                    sudo mv niger-water-sewage-corporation/ /var/www/html/niger-water
                '''
            }
        }
    }

    post {
        always{
            emailext to: "santosh.pandey@nownow.ng,harpreet.kaur@nownow.ng,vtosin@nownow.ng,rama.saini@nownow.ng",
            subject: "NISWASEC UI Build Deployment Email Notification",
            body: "Build Deployment is Successful, Please find attached logs for more details ~~~",
            attachLog: true
        }
        failure{
            emailext to: "santosh.pandey@nownow.ng,harpreet.kaur@nownow.ng,vtosin@nownow.ng,rama.saini@nownow.ng",
            subject: "NISWASEC UI jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
            body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL}",
            attachLog: true
        }
        changed{
            emailext to: "santosh.pandey@nownow.ng,harpreet.kaur@nownow.ng,vtosin@nownow.ng,rama.saini@nownow.ng",
            subject: "NISWASEC UI jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
            body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL}",
            attachLog: true
        }
    }
}