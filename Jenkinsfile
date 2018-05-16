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
            withCredentials([
                usernamePassword(credentialsId: 'npm-registry', usernameVariable: 'NPM_USER', passwordVariable: 'NPM_PASSWORD'),
                string(credentialsId: 'npm-registry-email', variable: 'NPM_EMAIL')
                ]) {
                stage('Publish') {
                    sh 'echo $NPM_USER'
                    sh '''
npm adduser <<EOF
$NPM_USER
$NPM_PASSWORD
$NPM_EMAIL
EOF
'''
                    sh 'npm publish'
                }
            }
        }
    }
}