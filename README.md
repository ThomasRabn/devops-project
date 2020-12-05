# ECE Devops Labs - PROJECT

Thomas RABIAN - thomas.rabian@edu.ece.fr\
Thomas BASTIDE - thomas.bastide@edu.ece.fr

## The Repository

This repository purpose was, at first, to contain the ING4 Devops Labs. Its purpose has now become to accomodate the Devops end-of-semester project. Each requirement that this project fulfill will be explained in details in a specific section in this README file.

The lab was quite interesting and allowed us to revise almost everything that we have seen during the Devops course.

## The Web Application

First of all, it is needed to create a web application. As we are not in a Web Technologies course, we are not going to have a 'real' application. However, it is asked that we should have:

- a little user API application with CRUD user functionality
- storage in Redis database
- tests: unit, API, configuration, connection.

For this, we took the draft application located in the [assets/userapi](modules/4-continuous-testing/assets/userapi) folder and modified it in order to have a complete API.

## The Continuous Integration / Continuous Deployment (CI/CD)

### Continuous Integration (CI)

For the Continuous Integration part, we decided to use __Travis CI__. This was our first choice because it is the CI service that we have seen during the course. Because we already used it before, it was easy to implement the first pipeine to automatically test our application.\
When pushing to Github, we trigger Travis CI which will start a virtual machine that will launch all the commands we wrote in the `.travis.yaml` file. First, we declare that it is a NodeJS app and that we are using the redis-server in the 'services' part. The bash commands that the virtual machine will launch are:

```bash
echo 'Starting'
npm install
echo 'Testing'
npm test
```

Finally, it will write the status of the tests on Github so that other users can instantly know if the version that is on the master branch has passed or failed the tests.

### Continuous Deployment (CD)

For the Continuous Deployment part, we decided to use __Heroku__. We chose Heroku because it seemed to be the most used and the biggest name of the Continuous Deployment services. This part is at the end of our CI/CD pipe. Indeed, if Travis CI is done testing the application and all the tests have passed, it will automatically deploy the project on the Heroku app. The last deployed version should be available here: [my-devops-application](https://my-devops-application.herokuapp.com/).
As Redis is a Heroku add-on, and as we need to enter our credit card information to have access to it, it is not possible to use Redis on the Heroku app. However, the welcome page works so we can assume that the application would work if we add the Redis add-on.

## Run your application using Infrastructure as Code (IaC) approach

We are now going to implement a Virtual Machine (VM) using Vagrant. This VM will need to launch and test our previously made application. For this we need to:

- Create and start the VM
- Install Node.js and Redis environnements
- Install Git and clone our repository
- Launch and test the application

For this, we are using Ansible as the provisionner, which means that it will launch the tasks itself and we do not need to write the provisions as shell commands.

All the VM related files are available in the folder `/iac`. We are going to explain here how we have done that.

### Create and start the VM

This is a simple part. We have already seen in class how to do such a thing. First, we need to create a `Vagrantfile` which will contain all the main information about how our Virtual Machine will act. This file will launch Ansible which will follow the instructions in the `playbooks/run.yml` file. This `run.yml` will call multiple other files that will launch _tasks_ that will initialize our VM so that we can install everything we need.

### Install Node.js and Redis environnements

Redis was very easy to install. Indeed, the `yum` package manager of CentOS has a redis package that we can easily install using Ansible. Node.js, however, we quite tricky. Because we want to run Node v14, we need to do some manipulations. In fact, the `yum` packet manager only has the v6.7, which is far from the one we want. Thus, we need to dowload Node 14 setup from an internet URL, launch the setup and finally use `yum` to install the version we want.

### Install Git and clone our repository

This part was the most tricky part. Indeed, it took us a very long time to achieve what we wanted too. Our goal here was to install git and clone our GitHub repository so that we would be able to launch our application. Sadly, our repository is private, which means that we would need to have a connected account or an account SSH key to be able to verify our identity. However, we did not want to share one of our account private SSH key or credentials. We asked M. Kudinov how we could do it and we had the chance to have a little more details about how this should work. We have been told to use "SSH forwarding" but we were not sure about how to do it, as it was new for us and we usually pull and clone from GitHub using HTTPS.

At first, we wanted to use the private key that would be on the host computer (your SSH key for example). However, we were not sure if you were connected through SSH and we did not want to bother you by adding a SSH key on your computer. Thus, we made research and learned about GitHub's `deploy keys`. Those keys are single-repository keys that give you the ability to __pull__ a private repository. Therefore, it was not a big deal if we created this type of key and decided to put it in plain text in our Vagrant configuration. We know this is not how it should work, but it was the easiest way for us to make sure that it would work on any Linux distribution, even if it is a fresh install.

### Install the Node modules and PM2

Before all our applications, we need to install our project's modules. For this, we have a task that launches `npm install` in our repository. Moreover, we have a `npm install pm2 -g` which install PM2. PM2 is a Node module that allows us to launch our application in the background. It kind of daemonize Node.js.

### Launching the tests, launching the app and checking its status

After we have installed everything, we need to start our servers. First, we need to start the redis-server's database. As we cannot have a process that would stop our flow, we need to daemonize it using the command `redis-server --daemonize yes`. We then launch the application tests using `npm test` and we print the response on the output. We can then start the application using `pm2 start npm -- start` which will launch npm start in the background. We then check its status by going to `127.0.0.1:3000` on the VM and we return it. Finally, we tell the user if the application is running properly, and if it does we tell him that he can access it on his computer on the address `20.20.20.2:3000`.

## Build Docker image of your application

Create a Docker image of our application was fairly easy. In fact, our Dockerfile is very simple, it just needs to pull the Nodejs image from DockerHub, copy the files that are in the current directory, launch `npm install` to build the application and expose the port. We can then push this image to DockerHub and we are done!
