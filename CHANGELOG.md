# Changelog

All noteable changes on this repository will be written in this file.

## [0.0.8] - 2020-12-21

### Modified

- **[docker]** - `.dockerignore` modifed so that it does not exports the `docker-compose.yml` file.
- **[docker]** - Dockerfile modified to start only `npm start`.
- **[docker-compose]** - Docker Compose modified so that it overrides the application's image commands to run the tests before the app.

## [0.0.7] - 2020-12-11 - Kubernetes Persistent Volume & Volume Claim

### Added

- **[kubernetes-pv]** - 10Gi persistent volume in minikube's `/mnt/data-redis` directory.
- **[kubernetes-pvc]** - 3Gi persistent volume claim to the previously cited persistent volume.

### Modified

- **[kubernetes-deployment]** - Deployment modified so that `redis` container in the pod has access to the files in `/mnt/data-redis`

## [0.0.6] - 2020-12-08 - - Kubernetes

### Added

- **[kubernetes-deployment]** - Kubernetes deployment put in place for container orchestration.
- **[kubernetes-service]** - Kubernetes service for container orchestration, application available on `<Minikube-IP>:30003`

### Modified

- **[docker]** - Modifications made to the Dockerfile so that it runs `npm test && npm start` when launched

## [0.0.5] - 2020-12-07 - Docker Compose

### Added

- **[docker-compose]** - Container orchestration using Docker Compose: launch & start our application automatically.

## [0.0.4] - 2020-12-07 - Docker image

### Added

- **[docker]** - Dockerfile to build a Docker image of our application.

### [0.0.3] - 2020-12-04 - Infrastructure as Code

### Added

- **[IaC]** - Vagrantfile created to automatically start the application on a Vagrant virtual machine.
- **[Iac]** - Ansible used to provision the virtual environment.

## [0.0.2] - 2020-12-01 - Continuous Deployment

### Added

- **[CI/CD]** - Pipe from Travis CI to Heroku working.
- **[CD]** - Automatic deployment on Heroku when pushing to Github: https://my-devops-application.herokuapp.com/.

## [0.0.1] - 2020-10-14 - Continuous Integration

### Added

- **[tests]** - Unit tests are operational.
- **[CI]** - `.travis.yml` : Allows us to use Travis CI and to automatically test our project.

### Modified

- **[application]** API fonctionnalities fully working.

## [0.0.0] - 2020-09-14 - Start

### Added

- **[application]** - Create a HTTP web server using Node.js & Express.
