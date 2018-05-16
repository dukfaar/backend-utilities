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

        if(env.BRANCH_NAME == 'master') {
            withCredentials([string(credentialsId: 'npm-registry-token', variable: 'NPM_TOKEN')
                ]) {
                stage('Publish') {
                    sh "echo '//npm-registry.dukfaar.com/:_authToken=${NPM_TOKEN}' >> .npmrc"
                    sh 'npm publish'
                }
            }
        }
    }
}
