# Chapter 14: Real-World Examples of Ansible Automation

To solidify your understanding, this chapter provides practical, real-world scenarios where Ansible is used to automate IT tasks.

---

## 14.1 Web Server Deployment

**Objective:** Automate the deployment of a web server with Nginx.

```yaml
- name: Deploy Nginx Web Server
  hosts: webservers
  become: yes
  roles:
    - common
    - nginx
```
- `common` role installs utilities and updates packages
- `nginx` role installs Nginx, deploys config templates, and starts the service

## 14.2 Multi-Tier Application Deployment

**Objective**: Deploy a multi-tier application with database, backend, and frontend.
```yaml
- hosts: db
  become: yes
  roles:
    - mysql

- hosts: app
  become: yes
  roles:
    - python-app
    - backend

- hosts: web
  become: yes
  roles:
    - nginx
    - frontend
```

- Separate roles for database, application, and web layer
- Allows easy scaling and maintenance of each tier

## 14.3 Cloud Infrastructure Provisioning

**Objective**: Provision EC2 instances in AWS and configure them.
```yaml
- hosts: localhost
  tasks:
    - name: Launch EC2 instance
      amazon.aws.ec2_instance:
        name: myapp-server
        key_name: mykey
        instance_type: t2.micro
        image_id: ami-12345678
        wait: yes
      register: ec2

- hosts: tag_Environment_production
  become: yes
  roles:
    - webserver
```

- Dynamic inventory using EC2 tags
- Combines provisioning and configuration in one workflow

## 14.4 Continuous Integration and Deployment (CI/CD)

**Objective**: Automate CI/CD pipelines for application deployment.
```yaml
- hosts: jenkins
  become: yes
  roles:
    - jenkins
    - git

- hosts: app_servers
  become: yes
  roles:
    - deploy_app
    - restart_services
```

- Jenkins role sets up CI server
- Git role ensures latest code checkout
- Deploy role automates deployment and service restart

## 14.5 Security Automation

**Objective**: Automatically enforce security policies.
```yaml
- hosts: all
  become: yes
  roles:
    - security_updates
    - firewall
    - ssh_hardening
```

- `security_updates` ensures latest patches
- `firewall configures` rules consistently
- `ssh_hardening` enforces secure SSH settings

## 14.6 Containerized Application Deployment

**Objective**: Deploy a multi-container application using Docker.
```yaml
- hosts: docker_hosts
  become: yes
  roles:
    - docker
    - webapp_containers
```

- `docker` role installs and configures Docker
- `webapp_containers` role deploys containers, networks, and volumes

## 14.7 Lessons Learned

- Use roles to modularize automation
- Variables and inventories help adapt playbooks to multiple environments
- Dynamic inventories simplify cloud and container deployments
- Testing and CI/CD integration ensures reliable automation
- Security and compliance can be automated consistently

## Summary

Real-world examples demonstrate how Ansible can:
- Deploy servers, applications, and containers
- Automate cloud provisioning and CI/CD workflows
- Enforce security and operational policies
- Provide scalable, repeatable, and maintainable automation
