pipeline {
  agent any

  environment {
    DOCKERHUB_IMAGE_BACKEND = 'charan0405/blog-backend'
    DOCKERHUB_IMAGE_FRONTEND = 'charan0405/blog-frontend'
  }

  stages {
    stage('Clone Repository') {
      steps {
        git 'https://github.com/Charan-0405/Blog-App-DevOps.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $DOCKERHUB_IMAGE_BACKEND ./backend'
        sh 'docker build -t $DOCKERHUB_IMAGE_FRONTEND ./frontend'
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh '''
            echo $PASSWORD | docker login -u $USERNAME --password-stdin
            docker push $DOCKERHUB_IMAGE_BACKEND
            docker push $DOCKERHUB_IMAGE_FRONTEND
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s/'
      }
    }
    stage('Restart Frontend Deployment') {
  steps {
    // For image updates
    sh 'kubectl rollout restart deployment blog-frontend'
  }
}

stage('Restart Backend Deployment') {
  steps {
    sh 'kubectl rollout restart deployment blog-backend'
  }
}
  }
}
