# DevOps Project <img height="32px" alt="devops" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Devops-toolchain.svg/1280px-Devops-toolchain.svg.png"/> - Simple Web Application :earth_africa:

[![Build Status](https://travis-ci.com/ThomasRabn/ece-devops-labs.svg?token=1jxmpSezCsqHsfQfR29Q&branch=master)](https://travis-ci.com/ThomasRabn/ece-devops-labs)

## The Repository :book:

This repository purpose was, at first, to contain the ING4 Devops Labs. Its purpose has now become to accomodate the Devops end-of-semester project. Each requirement that this project fulfill will be explained in details in a specific section in this README file.

The project was quite interesting and allowed us to revise almost everything that we have seen during the DevOps course.

## The work and tasks :mechanic:

### 1. The Web Application :earth_africa:

First of all, it is needed to create a web application. It is asked that we should have:

- a little user API application with CRUD user functionality
- storage in Redis database
- tests: unit, API, configuration, connection.

For this, we took the draft application located in the [assets/userapi](https://github.com/adaltas/ece-devops-2020-fall/tree/master/modules/4-continuous-testing/assets/userapi) folder and modified it in order to have a better API. The functionnalities are:

- Create:
  - Adding a user by POST on `/user`
- Read:
  - Get a user by GET on `/user/:username`
  - Get all the users by GET on `/user`
- Update:
  - Modify a user by PUT on `/user/:username`
- Delete:
  - Delete a user by DELETE on `/user/:username`

We also added some front-end pages to simplify the use of the API.

### 2. The Continuous Integration / Continuous Deployment (CI/CD)

- #### Continuous Integration (CI)

  For the Continuous Integration part, we decided to use __Travis CI__. This was our first choice because it is the CI service that we have seen during the course. Because we already used it before, it was easy to implement the pipeline to automatically test our application.\
  When pushing to Github, we trigger Travis CI which will start a virtual machine that will launch all the commands we wrote in the `.travis.yaml` file. First, we declare that it is a NodeJS app and that we are using the redis-server in the 'services' part. The bash commands that the virtual machine will launch are:

  ```bash
  echo 'Starting'
  npm install
  echo 'Testing'
  npm test
  ```

  Finally, it will write the status of the tests on Github so that other users can instantly know if the version that is on the master branch has passed or failed the tests.

- #### Continuous Deployment (CD)

  For the Continuous Deployment part, we decided to use __Heroku__. We chose Heroku because it seemed to be the most used and known of the Continuous Deployment services. This part is at the end of our CI/CD pipe. Indeed, if Travis CI is done testing the application and all the tests have passed, it will automatically deploy the project on the Heroku app. The last deployed version should be available here: [my-devops-application](https://my-devops-application.herokuapp.com/).\
  As Redis is a Heroku add-on, and as we need to enter our credit card information to have access to it, it is not possible to use Redis on our Heroku app. However, the welcome page works so we can assume that the application would work if we added the Redis add-on.

### 3. Infrastructure as Code (IaC) :computer:

We are now going to implement a Virtual Machine (VM) using Vagrant. This VM will need to launch and test our previously made application. For this we need to:

1. Create and start the VM
2. Install Node.js, Git and Redis
3. Synchronize the host folder with `~/myrepo` on the machine. (`Bonus:` Clone our repository)
4. Launch and test the application

For this, we are using Ansible as the provisionner, which means that it will launch the tasks itself and we do not need to write the provisions as shell commands.

All the VM related files are available in the folder `/iac`. We are going to explain here how we have done that.

- #### Create and start the VM

  First of all, the `Vagrantfile` contains all the information for our VM to be started and will link to the `playbooks/run.yml` to launch the _tasks_ that we have written for Ansible. We use __CentOS 7__ as our VM's operating system.

- #### Install Node.js, Git and Redis

  Redis was very easy to install. Indeed, the `yum` package manager of CentOS has a redis package that we can easily install using Ansible. Node.js, however, was quite tricky. Because we want to run Node v14, we need to do some manipulations. In fact, the `yum` packet manager only has the v6.7, which is far from the one we want. Thus, we need to dowload Node 14 setup from an internet URL, launch the setup and finally use `yum` to install the version we want.

- #### Synchronize the application folder (or clone our repository)

  In this part, we try to copy the application source files so that we can launch the app in the VM. We implemented 2 solutions, one that should always work, and one that can work only if you have a GitHub SSH key on your host computer.\
  The first solution is a synchronized folder between the host and the VM. We are synchronizing the files in the folder `../` of the host (which is the folder above the Vagrantfile) to the folder `/home/vagrant/myrepo` of the VM.\
  The second solution is a clone of our GitHub repository. This will only work if you have a SSH key on your host computer. The VM will use the SSH Agent to know your identity and will be able to pull the repository. All of this is commented in our VM's tasks because we do not want to force you to add a SSH key on your computer.

- #### Install the Node modules and PM2

  Before we can run our application, we need to install our project's modules. For this, we have a task that launches `npm install` in our repository. Moreover, we have a `npm install pm2 -g` which install PM2. PM2 is a Node module that allows us to launch our application in the background. It daemonizes Node.js.

- #### Launching the tests, launching the app and checking its status

  After we have installed everything, we need to start our servers. First, we need to start the redis-server's database. As we cannot have a process that would stop our flow, we need to daemonize it using the command `redis-server --daemonize yes`. We then launch the application tests using `npm test` and we print the response on the output. We can then start the application using `pm2 start npm -- start` which will launch npm start in the background. We then check its status by going to `127.0.0.1:3000` on the VM and we return it. Finally, we tell the user if the application is running properly, and if it does we tell him that he can access it on his computer on the address `20.20.20.2:3000`.

### 4. Build a Docker image of our application :whale:

Create a Docker image of our application was fairly easy. In fact, our Dockerfile is very simple, it just needs to pull the Node.js image from DockerHub, copy the files that are in the current directory, launch `npm install` to build the application and expose the port. We can then push this image to DockerHub and we are done! You can find our Docker image [**here**](https://hub.docker.com/repository/docker/thomasrabn/devops-project-app)!

### 5. Make container orchestration using Docker Compose :whale2:

Our Docker Compose file launches 2 containers: our application with Node.js in the first one, and Redis in the other one. As we want to launch `npm test` before launching `npm start`, we provide a command to our application container so that it overwrites the default commands with a command to launch both of them. As our Docker image launches `npm test` and `npm start`, we first have the output of the tests to make sure that everything is working fine, and we then have the start of the app so that it is accessible on `127.0.0.1:3000`.

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

  The persistent volume and persistent volume claim are a method to persist the data of a container. We used it so that Redis can safely store its data on the host and can find them back when we restart it. With our persistent volume, we reserve 10Gi of storage to our cluster. In our persistent volume claim, we ask 3Gi out of the 10Gi that have been reserved. We use this space in our deployment to link the `/data` folder in Redis container to the `/mnt/data-redis` folder of the Kubernetes cluster allowing us to find the data back when restarting the deployment and even Minikube. We did activate the `appendonly` mode on Redis to make sure that all the data written to RAM are well copied on disk.

### 7. Istio

Istio has been a tough challenge. We did our best to use Istio to dynamically route requests and to gradually migrate the traffic from one application version to another. However, even after following all the tutorials given in the lab a second time, we did not succeed in this task and we sadly do not have anything to show with Istio.

### 8. Source Control Management - Git <img height="18.72" alt="git" src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png"/>

Since years we have been using Git, it is only since September that we are learning about real DevOps methods and better Git usages. As we are using this GitHub repository since the beginning of the school year, it is a mix of different approaches and it is not well-structured.
At first, we did not have any commit policy, we were just writing a commit that we thought was the most useful, sometimes adding uppercase letters and emojis. Moreover, we always pushed all our commits on the remote repository and never squashed them.
Since the end of November with the `WebTech Project`, we tried to improve our Git commits messages. For this, we implemented a branch policy and a commit policy: branches should be features-centered and each commit must have a unified message template: `feature: functionnality and changes`. This lets us have a unified and easily understandable master branch. Commits on master must also be rare and important. For this, we followed [this article](https://blog.carbonfive.com/always-squash-and-rebase-your-git-commits)'s workflow for our project. It is a *squash and rebase* workflow which allows us to have a **cleaner** and **easier to understand** versionning graph. Since we are using this workflow, we have a much easier to understand repository and professional-looking commits. We have now totally understood this workflow which is about:

1. Pulling the latest master branch and integrating its changes in our branch by rebasing our branch on it
2. Squashing our commits so that we have only one commit per feature
3. Merging our branch into master

Finally, we have learned a lot about Git and we have put policies to have a cleaner and better repository.

### 9. Bonus

- #### A. Better API

  We improved the given API with all the functionnalities in order to fulfill all the CRUD functionnalities we could think of:
  - Create:
    - Adding a user
  - Read:
    - Get a user
    - Get all the users (bonus)
  - Update:
    - Modify a user (bonus)
  - Delete:
    - Delete a user (bonus)

- #### B. More tests

  More API functionnalities lead to more tests to put in place. We did our best to add multiple tests for each functionnality and we have a total of 25 tests.

- #### C. Basic front-end for our API

  Because it is not convenient to use Postman to test the API, we added some HTML pages to test the functionnalities without the need to use anything else.

- #### D. Usage of host SSH key for Vagrant

  Because we think that synchronizing a folder is not the best method, we implemented, at first, a method to pull the application from the GitHub repository. For this, we tell Vagrant to use the host machine SSH authorizations to try and pull the repository. We tried it and it worked on our computers. To test it, you need to comment the line 17 (synchronized folder) of the Vagrantfile, and uncomment the task "_Clone the private repository into ~/myrepo_" in `iac/playbooks/roles/install/app/tasks/main.yml`.

- #### E. Docker images size

  That is not really a bonus, however we thought it would be interesting to talk about it here. For our Docker images, we used _Linux Alping_ images. Alpine is a Linux distribution that is much smaller than usual Linux distributions. It allows us to have very slight Docker images.

## Usage :man_teacher:

### 1. Clone the repository and install Node.js

First of all you will need to clone the repository and install Node.js runtime environment (v14 preferably) as well as Redis. Here is an example for Debian based distributions assuming you already have Git installed:

```bash
# Install Node.js 14
wget -qO- https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
# Install (and autolaunch) Redis
sudo apt install redis
# Clone the repository using HTTPS
git clone https://github.com/ThomasRabn/ece-devops-labs.git devops-rabian-bastide
cd devops-rabian-bastide
```

### 2. Use the application

The application is using Node.js, so it is very easy to use. Make sure Redis is running, you can use `redis-server` to launch it.

```bash
# Install dependencies
npm install
# Test the application
npm test
# Run the application
npm start
```

You can then open your browser and go to [`localhost:3000`](http://locahost:3000), where you will find the application homepage. All the methods of the API are available in the _Tasks section_. You might face an error when killing the process with (CTRL+C), it is a drawback of totally terminating the process, but it allows us to avoid `address already in use` error.

### 3. Use the Vagrant VM

For this part, you will first need to install everything needed:

1. Install VirtualBox - https://www.virtualbox.org/wiki/Downloads
2. Install Vagrant on your computer - https://www.vagrantup.com/downloads.html
3. (Optional) **On Windows**, ensure that Hyper-V is disabled:
   - Open a new PowerShell
   - Run the following command:   
      ```bash
      Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
      ```
4. Download the `centos/7` Vagrant box for the **Virtualbox provider**, run:

```bash
vagrant box add centos/7
```

Then, you can run this part in 2 different ways. The easier way would be to launch the Vagrantfile as it is, using synchronized folders. The other way would be to modify the code to make use of the SSH GitHub clonage (by commenting line 17 in the Vagrantfile and uncommenting the task "_Clone the private repository into ~/myrepo_" in `iac/playbooks/roles/install/app/tasks/main.yml`). Either way, you can launch the VM with:

```bash
cd iac
vagrant up
```

You will then be prompted with the tests' results and you should be able to see the message telling you to go to [`20.20.20.2:3000`](http://20.20.20.2:3000) in your browser to find the application running in the guest machine.

### 4. Docker image

You can use our Docker image on its own. You will first to install [Docker](https://docs.docker.com/engine/install/). Then, you can either build the image with the Dockerfile and run it, or pull it from the repository with the name [thomasrabn/devops-project-app](https://hub.docker.com/repository/docker/thomasrabn/devops-project-app). Here, we are going to show you the pull method. To run the application without the use of Redis you can launch:

```bash
docker run -p 3000:3000 thomasrabn/devops-project-app
```

If you want to use your local Redis database, you can use:

```bash
docker run --network="host" thomasrabn/devops-project-app
```

In both ways, the application will be accessible on [`localhost:3000`](http://localhost:3000).

### 5. Docker Compose

Docker Compose is very easy and will launch 2 containers: one with the application and an other one with Redis. When launching the Docker Compose file, we are prompted with the results of the tests and the server is launched. Here is how you can launch the Docker Compose file from the root of the project:

```bash
docker-compose up
```

You will then be able to access the application on [`localhost:3000`](http://localhost:3000).

### 6. Kubernetes

For container orchestration using Kubernetes, you will first need to [Install Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). You will then need to start Minikube with:

```
minikube start
```

Once this is done, go into the project root directory and use:

```bash
kubectl apply -f k8s
```

It will launch the 4 files in the `k8s/` folder, which will create:

  - 1 deployment with 1 pod and 2 container
  - 1 service linking the `<minikube-ip>:30003` to the application
  - 1 PV and 1 PVC allowing to store Redis' data on the cluster

By going to `<minikube-ip>:30003`, you will be able to access the application.

**`Note!`** It might happen that the application container will be ready before the Redis container which may cause issues. If you face the `HMSET not found`, make sure to relaunch the deployment.

## Useful links :link:

- [Our Travis CI link](https://travis-ci.com/github/ThomasRabn/ece-devops-labs)
- [Our application on Heroku (without Redis)](https://my-devops-application.herokuapp.com/)
- [Our application image on DockerHub](https://hub.docker.com/repository/docker/thomasrabn/devops-project-app)
## Authors :student: :man_student:

ING4 SI Inter TD03

Thomas RABIAN - thomas.rabian@edu.ece.fr \
Thomas BASTIDE - thomas.bastide@edu.ece.fr
