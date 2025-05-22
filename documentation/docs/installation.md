---
sidebar_position: 2
id: installation
sidebar_label: Setting up your instance
---

# Setting up your instance

Deployment is done with docker-compose.

## Prerequisites

- General knowledge about docker and docker-compose.
- A hosting machine with docker-compose installed.

## Getting started

- Take the docker-compose.yaml (docker/docker-compose-prod.yaml) template file and copy it to the hosting machine.
- Configure the needed environment variables. The .env.template file can be used as a template

| Varriable         | Description                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| DB_IMAGE          | The postgres database image to use. Default: "postgres:17-alpine3.20"                                                    |
| DB_PASSWORD       | The database password                                                                                                    |
| DB_NAME           | The name of the database (name whatever you want)                                                                        |
| DB_NAME           | The name of the database (name whatever you want)                                                                        |
| FRONTEND_PORT     | The port on which Ambys should run. Default: "3000"                                                                      |
| APP_IMAGE_NAME    | Name of the docker image for Ambys. Could be either a local image or an image from docker hub. Default: "stego416/ambys" |
| APP_IMAGE_VERSION | The tag of the image. Use latest to always be up to date or use a specific version. Default: "latest"                    |
| JWT_KEY           | Your private JWT key for the backend                                                                                     |
| DISABLE_SIGNUP    | Whether signups should be allowed or not. The first user you create will ignore this setting.                            |

- Run `docker-compose -f docker-compose-prod.yaml up -d` to start the app.
- Make necessary settings in the app. 
