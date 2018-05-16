node {
    checkout scm
    
    docker.image('node:alpine').inside {        
        stage('Install') {
            sh 'npm install'
        }
        
        stage('Test') {
            sh 'npm test'
        }
        
        stage('Build') {
            sh 'npm run build'
        }
    }
}
