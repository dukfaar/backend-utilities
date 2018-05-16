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
                    sh 'echo -e "$NPM_USER\n$NPM_PASSWORD\n$NPM_EMAIL\n" | npm adduser'
                    sh 'npm publish'
                }
            }
        }
    }
}
