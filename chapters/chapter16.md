# Ansible with Containers and Docker

Ansible can automate containerized environments like Docker and Kubernetes.  
This chapter focuses on using Ansible to manage Docker containers, images, networks, and volumes.

---

## Prerequisites

- Docker installed on target hosts  
- Python `docker` SDK module installed:

```bash
pip install docker
```
- Ansible installed on control node
- Target hosts reachable via SSH

---
## Docker Modules Overview

Ansible provides Docker-specific modules:
- `community.docker.docker_container` – manage containers
- `community.docker.docker_image` – manage images
- `community.docker.docker_network` – manage networks
- `community.docker.docker_volume` – manage volumes

---
## Managing Docker Images
### Pull an image
- name: Pull Nginx image
  community.docker.docker_image:
    name: nginx
    tag: latest
    source: pull

### Build an image from Dockerfile
```yaml
- name: Build custom image
  community.docker.docker_image:
    build:
      path: ./myapp
    name: myapp
    tag: v1.0
```

---
## Managing Docker Containers
### Run a container
```yaml
- name: Start Nginx container
  community.docker.docker_container:
    name: web
    image: nginx:latest
    state: started
    ports:
      - "8080:80"
```
### Stop and remove a container
```yaml
- name: Stop Nginx container
  community.docker.docker_container:
    name: web
    state: absent
```

---
## Managing Docker Networks and Volumes
### Create a network
```yaml
- name: Create custom network
  community.docker.docker_network:
    name: my_network
    state: present
```
### Create a volume
```yaml
- name: Create data volume
  community.docker.docker_volume:
    name: my_data
    state: present
```

---
## Combining Containers with Playbooks

You can automate multi-container setups:
```yaml
- hosts: docker_hosts
  become: yes
  tasks:
    - name: Pull images
      community.docker.docker_image:
        name: "{{ item }}"
      loop:
        - nginx
        - redis

    - name: Run Nginx container
      community.docker.docker_container:
        name: web
        image: nginx:latest
        state: started
        ports:
          - "8080:80"

    - name: Run Redis container
      community.docker.docker_container:
        name: redis
        image: redis:latest
        state: started
```

---
## Best Practices

- Use roles for containerized applications
- Separate image building and container deployment tasks
- Use variables for image tags, container names, and ports
- Use volumes for persistent data
- Test containers locally before deploying to production

---
## Summary

- Ansible with Docker allows:
- Automating container lifecycle: images, containers, networks, and volumes
- Deploying multi-container applications using playbooks
- Managing containerized infrastructure in a repeatable, declarative way
- Integrating Docker automation with roles and variables for maintainability
