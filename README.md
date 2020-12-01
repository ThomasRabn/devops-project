# ECE Devops Labs - PROJECT

Devops Project - Thomas RABIAN - thomas.rabian@edu.ece.fr

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

For the Continuous Integration part, we decided to use __Travis CI__. This was our first choice because it is the CI service that we have seen during the course. Because we already used it before, it was easy to implement the first pipeine to automatically test our application.
When pushing to Github, we trigger Travis CI which will start a virtual machine that will launch all the commands we wrote in the `.travis.yaml` file. First, we declare that it is a NodeJS app and that we are using the redis-server in the 'services' part. The bash commands that the virtual machine will launch are:

```bash
echo 'Starting'
npm install
echo 'Testing'
npm test
```

Finally, it will write the status of the tests on Github so that other users can instantly know if the version that is on the master branch has passed or failed the tests.

## Continuous Deployment (CD)

For the Continuous Deployment part, we decided to use __Heroku__. We chose Heroku because it seemed to be the most used and the biggest name of the Continuous Deployment services. This part is at the end of our CI/CD pipe. Indeed, if Travis CI is done testing the application and all the tests have passed, it will automatically deploy the project on the Heroku app. The last deployed version should be available here: https://my-devops-application.herokuapp.com/.
As Redis is a Heroku add-on, and as we need to enter our credit card information to have access to it, it is not possible to use Redis on the Heroku app. However, the welcome page works so we can assume that the application would work if we add the Redis add-on.
