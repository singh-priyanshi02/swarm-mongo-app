# Swarm Mongo App – DevOps CI/CD & Auto Scaling

A containerized Task Management application deployed using Docker Swarm with an automated CI/CD pipeline, Trivy security scanning, GitHub Container Registry (GHCR), MongoDB Atlas, and CPU-based replica auto scaling.

## Architecture

```text
Developer
   |
   v
GitHub Repository
   |
   v
GitHub Actions
(Self-hosted EC2 Runner)
   |
   v
Docker Image Build
   |
   v
Trivy Vulnerability Scan
   |
   v
Push Image to GHCR
   |
   v
Docker Swarm Manager
   |
   +----------------------+
   |                      |
   v                      v
Worker Node 1          Worker Node 2
   |                      |
   +----------+-----------+
              |
              v
       Task Management App
              |
              v
        MongoDB Atlas
```

## Tech Stack

- **Application:** Node.js, Express.js, HTML, CSS, JavaScript
- **Database:** MongoDB Atlas
- **Containerization:** Docker
- **Orchestration:** Docker Swarm
- **CI/CD:** GitHub Actions
- **Self-hosted Runner:** AWS EC2
- **Container Registry:** GitHub Container Registry (GHCR)
- **Security Scanning:** Trivy
- **Cloud Infrastructure:** AWS EC2, VPC, Security Groups
- **Secrets Management:** Docker Swarm Secrets
- **Auto Scaling:** Custom CPU-based Bash script with systemd

## Features

- Create, read, update and delete tasks.
- MongoDB Atlas database integration.
- Dockerized Node.js application.
- Automated CI/CD pipeline on GitHub push.
- Docker image vulnerability scanning using Trivy.
- Docker image publishing to GHCR.
- Multi-node Docker Swarm deployment.
- Multiple application replicas.
- Secure MongoDB connection using Docker Secrets.
- CPU-based automatic replica scaling.

## CI/CD Pipeline

The GitHub Actions workflow performs these steps:

1. Checkout source code.
2. Build the Docker image.
3. Scan the image using Trivy.
4. Fail the pipeline for HIGH and CRITICAL vulnerabilities (excluding unfixed vulnerabilities).
5. Authenticate with GHCR using GitHub Actions token.
6. Push versioned and latest images to GHCR.

Workflow location:

`.github/workflows/deploy.yml`

## Docker Swarm Deployment

The application runs as a replicated Docker Swarm service.

- Manager node: `10.0.1.79`
- Worker node 1: `10.0.1.225`
- Worker node 2: `10.0.1.119`
- Application port: `8080`
- Initial replicas: `2`

Check cluster nodes:

```bash
docker node ls
```

Check service:

```bash
docker service ls
```

Check replicas:

```bash
docker service ps swarm-mongo-app
```

View application logs:

```bash
docker service logs swarm-mongo-app
```

## MongoDB Secrets

MongoDB connection credentials are stored as Docker Swarm Secrets instead of being included in the Docker image.

Secret name:

`mongo_uri`

The application reads the secret using:

```text
MONGODB_URI_FILE=/run/secrets/mongo_uri
```

## CPU-Based Auto Scaling

A custom Bash script monitors CPU utilization on the Swarm Manager and adjusts application replicas.

| Configuration | Value |
|---|---:|
| Minimum replicas | 2 |
| Maximum replicas | 5 |
| Scale up threshold | 70% |
| Scale down threshold | 25% |
| CPU sampling interval | 5 seconds |
| Scaling check interval | 30 seconds |

Scaling behavior:

- CPU usage reaches 70% or higher: increase replicas by one.
- CPU usage reaches 25% or lower: decrease replicas by one.
- Replicas remain between 2 and 5.

Script location:

`/usr/local/bin/swarm-autoscaler.sh`

Systemd service:

`swarm-autoscaler.service`

Check autoscaler:

```bash
sudo systemctl status swarm-autoscaler
```

View autoscaler logs:

```bash
sudo journalctl -u swarm-autoscaler -f
```

Restart autoscaler:

```bash
sudo systemctl restart swarm-autoscaler
```

**Note:** This is a custom lab-level autoscaler based on Manager EC2 CPU utilization, not cluster-wide CPU metrics or native Docker Swarm autoscaling.

## Application Access

Open the application using the Manager EC2 public IP:

```text
http://<MANAGER_PUBLIC_IP>:8080
```

Ensure the Manager Security Group allows inbound TCP traffic on port `8080` from the intended clients.

## Local Setup

Clone the repository:

```bash
git clone https://github.com/singh-priyanshi02/swarm-mongo-app.git
cd swarm-mongo-app
```

Install dependencies:

```bash
npm install
```

Configure a local `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
```

Start the application:

```bash
npm start
```

Never commit `.env` or expose database credentials.

## Project Outcome

Successfully implemented a containerized task management application with:

- Automated GitHub Actions CI/CD.
- Trivy vulnerability scanning.
- GHCR image publishing.
- Three-node Docker Swarm infrastructure.
- MongoDB Atlas integration.
- Docker Secrets for database credentials.
- Two running application replicas.
- CPU-based replica auto scaling.

## Repository

[GitHub – swarm-mongo-app](https://github.com/singh-priyanshi02/swarm-mongo-app)
