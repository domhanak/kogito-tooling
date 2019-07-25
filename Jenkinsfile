@Library('jenkins-pipeline-shared-libraries')_

pipeline {
    agent {
        label 'kogito-tooling-test'
    }
    tools {
        nodejs "nodejs-11.0.0"
    }
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10')
        timeout(time: 90, unit: 'MINUTES')
    }
    environment {
        SONARCLOUD_TOKEN = credentials('SONARCLOUD_TOKEN')
    }
    stages {
        stage('Initialize') {
            steps {
                sh 'printenv'
            }
        }
        stage('Prepare') {
            steps {
                sh "npm install -g yarn"
                sh "yarn install"
                sh "export XAUTHORITY=$HOME/.Xauthority"
                sh "wget -P $HOME/.vnc https://gitlab.mw.lab.eng.bos.redhat.com/jbossqe-jenkins/mwqa-cloud-slaves/tree/master/label/linux/all_user_hudson/home/hudson/.vnc/passwd"
                sh "wget -P $HOME/.vnc https://gitlab.mw.lab.eng.bos.redhat.com/jbossqe-jenkins/mwqa-cloud-slaves/tree/master/label/linux/all_user_hudson/home/hudson/.vnc/xstartup"
                sh "chmod 600 $HOME/.vnc/passwd"
            }
        }
        stage('Build kogito-tooling') {
            steps {
                dir("kogito-tooling") {
                    script {
                        githubscm.checkoutIfExists('kogito-tooling', "$CHANGE_AUTHOR", "$CHANGE_BRANCH", 'kiegroup', "$CHANGE_TARGET")
                        wrap([$class: 'Xvnc', takeScreenshot: false, useXauthority: true]) {
                            sh('yarn run build:prod')
                        }
                    }
                }
            }
        }
    }
    post {
        unstable {
            script {
                mailer.sendEmailFailure()
            }
        }
        failure {
            script {
                mailer.sendEmailFailure()
            }
        }
        always {
            junit '**/**/junit.xml'
            cleanWs()
        }
    }
}
