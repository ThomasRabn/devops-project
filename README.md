# DevOps Project <img height="32px" alt="devops" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Devops-toolchain.svg/1280px-Devops-toolchain.svg.png"/> - Simple Web Application :earth_africa:

[![Build Status](https://travis-ci.com/ThomasRabn/ece-devops-labs.svg?token=1jxmpSezCsqHsfQfR29Q&branch=master)](https://travis-ci.com/ThomasRabn/ece-devops-labs)

## The Repository :book:

This repository purpose was, at first, to contain the ING4 Devops Labs. Its purpose has now become to accomodate the Devops end-of-semester project. Each requirement that this project fulfill will be explained in details in a specific section in this README file.

The project was quite interesting and allowed us to revise almost everything that we have seen during the DevOps course.

## The tasks :mechanic:

### 1. The Web Application :earth_africa:

First of all, it is needed to create a web application. As we are not in a Web Technologies course, we are not going to have a application with a complex back-end and a front-end. However, it is asked that we should have:

- a little user API application with CRUD user functionality
- storage in Redis database
- tests: unit, API, configuration, connection.

For this, we took the draft application located in the [assets/userapi](https://github.com/adaltas/ece-devops-2020-fall/tree/master/modules/4-continuous-testing/assets/userapi) folder and modified it in order to have a complete API.

### 2. The Continuous Integration / Continuous Deployment (CI/CD)

- #### Continuous Integration (CI)

  For the Continuous Integration part, we decided to use __Travis CI__. This was our first choice because it is the CI service that we have seen during the course. Because we already used it before, it was easy to implement the first pipeine to automatically test our application.\
  When pushing to Github, we trigger Travis CI which will start a virtual machine that will launch all the commands we wrote in the `.travis.yaml` file. First, we declare that it is a NodeJS app and that we are using the redis-server in the 'services' part. The bash commands that the virtual machine will launch are:

  ```bash
  echo 'Starting'
  npm install
  echo 'Testing'
  npm test
  ```

  Finally, it will write the status of the tests on Github so that other users can instantly know if the version that is on the master branch has passed or failed the tests.

- #### Continuous Deployment (CD) <img height="16px" alt="devops" src="https://avatars3.githubusercontent.com/u/23211?s=200&v=4"/>

  For the Continuous Deployment part, we decided to use __Heroku__. We chose Heroku because it seemed to be the most used and known of the Continuous Deployment services. This part is at the end of our CI/CD pipe. Indeed, if Travis CI is done testing the application and all the tests have passed, it will automatically deploy the project on the Heroku app. The last deployed version should be available here: [my-devops-application](https://my-devops-application.herokuapp.com/).\
  As Redis is a Heroku add-on, and as we need to enter our credit card information to have access to it, it is not possible to use Redis on the Heroku app. However, the welcome page works so we can assume that the application would work if we add the Redis add-on.

### 3. Infrastructure as Code (IaC) :computer:

We are now going to implement a Virtual Machine (VM) using Vagrant. This VM will need to launch and test our previously made application. For this we need to:

1. Create and start the VM
1. Install Node.js and Redis environnements
1. Install Git and clone our repository
1. Launch and test the application

For this, we are using Ansible as the provisionner, which means that it will launch the tasks itself and we do not need to write the provisions as shell commands.

All the VM related files are available in the folder `/iac`. We are going to explain here how we have done that.

- #### Create and start the VM

  This is a simple part. We have already seen in class how to do such a thing. First, we need to create a `Vagrantfile` which will contain all the main information about how our Virtual Machine will act. This file will launch Ansible which will follow the instructions in the `playbooks/run.yml` file. This `run.yml` will call multiple other files that will launch _tasks_ that will initialize our VM so that we can install everything we need.

- #### Install Node.js and Redis environnements

  Redis was very easy to install. Indeed, the `yum` package manager of CentOS has a redis package that we can easily install using Ansible. Node.js, however, we quite tricky. Because we want to run Node v14, we need to do some manipulations. In fact, the `yum` packet manager only has the v6.7, which is far from the one we want. Thus, we need to dowload Node 14 setup from an internet URL, launch the setup and finally use `yum` to install the version we want.

- #### Install Git and clone our repository

  This part was the most tricky part. Indeed, it took us a very long time to achieve what we wanted too. Our goal here was to install git and clone our GitHub repository so that we would be able to launch our application. Sadly, our repository is private, which means that we would need to have a connected account or an account SSH key to be able to verify our identity. However, we did not want to share one of our account private SSH key or credentials. We asked M. Kudinov how we could do it and we had the chance to have a little more details about how this should work. We have been told to use "SSH forwarding" but we were not sure about how to do it, as it was new for us and we usually pull and clone from GitHub using HTTPS.

  At first, we wanted to use the private key that would be on the host computer (your SSH key for example). However, we were not sure if you were connected through SSH and we did not want to bother you by adding a SSH key on your computer. Thus, we made research and learned about GitHub's `deploy keys`. Those keys are single-repository keys that give you the ability to __pull__ a private repository. Therefore, it was not a big deal if we created this type of key and decided to put it in plain text in our Vagrant configuration. We know this is not how it should work, but it was the easiest way for us to make sure that it would work on any Linux distribution, even if it is a fresh install.

- #### Install the Node modules and PM2

  Before all our applications, we need to install our project's modules. For this, we have a task that launches `npm install` in our repository. Moreover, we have a `npm install pm2 -g` which install PM2. PM2 is a Node module that allows us to launch our application in the background. It kind of daemonize Node.js.

- #### Launching the tests, launching the app and checking its status

  After we have installed everything, we need to start our servers. First, we need to start the redis-server's database. As we cannot have a process that would stop our flow, we need to daemonize it using the command `redis-server --daemonize yes`. We then launch the application tests using `npm test` and we print the response on the output. We can then start the application using `pm2 start npm -- start` which will launch npm start in the background. We then check its status by going to `127.0.0.1:3000` on the VM and we return it. Finally, we tell the user if the application is running properly, and if it does we tell him that he can access it on his computer on the address `20.20.20.2:3000`.

### 4. Build a Docker image of our application :whale:

Create a Docker image of our application was fairly easy. In fact, our Dockerfile is very simple, it just needs to pull the Nodejs image from DockerHub, copy the files that are in the current directory, launch `npm install` to build the application and expose the port. We can then push this image to DockerHub and we are done! You can find our Docker image [here](https://hub.docker.com/repository/docker/thomasrabn/devops-project-app)!

### 5. Make container orchestration using Docker Compose :whale2:

This part took a lot more time than the last one. We faced a lot of problems that were not visible: when rebuilding our application, the files copied were actually not replaced which caused a lot of problems (because we were not pulling our image). This was not too hard when we understood that, but we lost a lot of time. In the end, we have a fully working Docker Compose file that launches 2 containers: our application with Nodejs in the first one, and Redis in the other one. As we want to launch `npm test` before launching `npm start`, we provide a command to our application container so that it overrides the default commands with a command to launch both of them. As our Docker image launches `npm test` and `npm start`, we first have the output of the tests to make sure that everything is working fine, and we then have the start of the app so it is accessible on `127.0.0.1:3000`.

### 6. Make container orchestration using Kubernetes <img height="18.72" alt="Kubernetes" src="https://raw.githubusercontent.com/kubernetes/kubernetes/master/logo/logo.png"/>

We divided this part in 3 different tasks:

- Creation of a Deployement
- Creation of a Service
- Creation of a Persistent Volume & Persistent Volume Claim

All the file are in the `k8s` folder.

- #### Deployment

  The deployment script is in the `deployment.yml` file. The deployment name is called `deployment-devops-app`, and it runs our application image and a redis image. Each image is run in a different container, but both containers are part of the same pod. Because they are in the same pod and because their useful ports are exposed, they can communicate and exchange data. Also, redis container's `/data` folder is linked to the persistent volume claim that we implemented so that we can save the data on the host. We also overrides the default Redis' container command with a command that activates the `appendonly` storage to persist data. By default, Redis uses a `dump.rdb` file to save the data to the disk, but we decided to look for an other method and it seems that it is a safer storage method (but the output file is bigger).

- #### Service

  The service script is in the `service.yml` file. Its name is `service-devops-app` and it exposes the port 3000 of the container `devops-app` (which is our app) to the port 30003 of minikube. Thus, you can access it via the IP address : `<minikube-ip-address>:30003`. In our case, this address is `192.168.49.2:30003` but it might be something else on you machine.

- #### Persistent Volume

  The persistent volume and persistent volume claim are a method to persist the data of a container. We used it so that Redis can safely store its data on the host and can find them back when we restart it. With our persistent volume, we reserve 10Gi of storage to our cluster. In our persistent volume claim, we ask 3Gi out of the 10Gi that have been reserved. We use this space in our deployment to link the `/data` folder in Redis container to the `/mnt/data-redis` folder of the Kubernetes cluster allowing us to find the data back when restarting the deployment and even Minikube.

### Istio

  Istio has been a tough challenge. We did our best to use Istio to dynamically route requests and to gradually migrate the traffic from one application version another. However, even after following all the tutorials given in the lab a second time, we did not succeed in this task and we sadly do not have anything to show with Istio.

### Source Control Management - Git <img height="18.72" alt="git" src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png"/>

Since years we have been using Git, it is only since September that we are learning about real DevOps methods and better Git usages. As we are using this GitHub repository since the beginning of the school year, it is a mix of different approaches and it is not well-structured.
At first, we did not have any commit policy, we were just writing a commit that we thought was the most useful, sometimes adding uppercase letters and emojis. Moreover, we always pushed all our commits on the remote repository and never squashed them.
Since the end of November with the `WebTech Project`, we tried to improve our Git commits messages. For this, we implemented a branch policy and a commit policy: branches should be features-centered ans each commit must have a unified message template: `feature: functionnality and changes`. This lets us have a unified and easily understandable master branch. Commits on master must also be rare and important. For this, we followed [this article](https://blog.carbonfive.com/always-squash-and-rebase-your-git-commits)'s workflow for our project. It is a *squash and rebase* workflow which allows us to have a **cleaner** and **easier to understand** versionning graph. Since we are using this workflow, we have a much easier to understand repository and professional-looking commits. We have now totally understood this workflow which is about:

1. Pulling the latest master branch and integrating its changes in our branch by rebasing our branch on it
2. Squashing our commits so that we have only one commit per feature
3. Merging our branch into master

Finally, we have learned a lot about Git and we have put policies to have a cleaner and better repository.

## Bonus

- Better API
- More tests
- Alpine
- Vagrant SSH

## Authors :student: :man_student:

ING4 SI Inter TD03

Thomas RABIAN - thomas.rabian@edu.ece.fr \
Thomas BASTIDE - thomas.bastide@edu.ece.fr
