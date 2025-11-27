# Chapter 17: Ansible with Kubernetes

Ansible can automate the deployment and management of applications on **Kubernetes clusters**.  
This chapter introduces using Ansible with Kubernetes for configuration and orchestration.

---

## 17.1 Prerequisites

- Access to a Kubernetes cluster  
- `kubectl` configured on the control machine  
- Python `kubernetes` module installed:

    ```bash
    pip install kubernetes
    ```

- Ansible installed on the control node

## 17.2 Kubernetes Modules Overview

Ansible provides **k8s modules** to manage Kubernetes resources:

- `kubernetes.core.k8s` – manage pods, deployments, services, and more
- `kubernetes.core.k8s_info` – gather information about resources
- `kubernetes.core.k8s_scale` – scale deployments

## 17.3 Managing Kubernetes Resources

### Deploy a Pod
```yaml
- name: Create a pod
  kubernetes.core.k8s:
    state: present
    definition:
      apiVersion: v1
      kind: Pod
      metadata:
        name: nginx-pod
      spec:
        containers:
          - name: nginx
            image: nginx:latest
            ports:
              - containerPort: 80
```

### Create a Deployment
```yaml
- name: Deploy Nginx deployment
  kubernetes.core.k8s:
    state: present
    definition:
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: nginx-deploy
      spec:
        replicas: 3
        selector:
          matchLabels:
            app: nginx
        template:
          metadata:
            labels:
              app: nginx
          spec:
            containers:
              - name: nginx
                image: nginx:latest
                ports:
                  - containerPort: 80
```
## 17.4 Managing Services

```yaml
- name: Expose deployment as a service
  kubernetes.core.k8s:
    state: present
    definition:
      apiVersion: v1
      kind: Service
      metadata:
        name: nginx-service
      spec:
        selector:
          app: nginx
        ports:
          - protocol: TCP
            port: 80
            targetPort: 80
        type: LoadBalancer
```
## 17.5 Scaling and Updating Deployments

### Scale a Deployment
```yaml
- name: Scale deployment
  kubernetes.core.k8s_scale:
    name: nginx-deploy
    namespace: default
    replicas: 5
```

### Update an Image
```yaml
- name: Update deployment image
  kubernetes.core.k8s:
    state: present
    definition:
      spec:
        template:
          spec:
            containers:
              - name: nginx
                image: nginx:1.23
```

## 17.6 Gathering Resource Information

```yaml
- name: Get pods info
  kubernetes.core.k8s_info:
    kind: Pod
  register: pods_info

- debug:
    var: pods_info.resources
```

- Use this information for dynamic decision-making or reporting

## 17.7 Best Practices

- Use YAML resource definitions for clarity
- Use variables for cluster names, namespaces, and image versions
- Separate deployment, service, and scaling tasks
- Test changes in staging clusters before production
- Combine with roles for repeatable multi-application deployments

## Summary

- Ansible with Kubernetes allows:
- Declarative deployment of pods, deployments, and services
- Scaling and updating resources programmatically
- Gathering information for dynamic playbooks
- Integrating Kubernetes automation with roles and variables for maintainable workflows