# Chapter 5 - Playbooks

A **playbook** is the core of Ansible automation.  
It describes *what* you want to configure, install, or run on your systems—written in simple, human-readable **YAML**.

Playbooks → contain **plays** → which run **tasks** → using **modules**.

---

## 5.1 What Is a Playbook?

A playbook tells Ansible:

- Which **hosts** to manage  
- With which **user**  
- What **tasks** to run  
- In what **order**  
- Using which **variables**, **handlers**, **roles**, etc.

Example structure:
```yaml
- name: Configure web servers
  hosts: web
  become: yes
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
```

## 5.2 Anatomy of a Playbook

A playbook consists of one or more **plays**.

#### Minimal playbook
```yaml
- hosts: all
  tasks:
    - name: Test connectivity
      ping:
```

A play contains:

| Component    | Description                    |
| ------------ | ------------------------------ |
| **name**     | Optional friendly title        |
| **hosts**    | Target hosts or groups         |
| **vars**     | Variables for this play        |
| **tasks**    | Ordered set of actions         |
| **handlers** | Triggered by notifications     |
| **become**   | Privilege escalation           |
| **roles**    | Reusable configuration bundles |

## 5.3 Tasks

Tasks are executed in order, one by one.

Example tasks:

```yaml
tasks:
  - name: Install Git
    apt:
      name: git
      state: present

  - name: Start Apache
    service:
      name: apache2
      state: started
      enabled: yes
```
Each task uses a **module**.
Modules do the real work: install packages, copy files, manage services…

## 5.4 Handlers

Handlers run only when notified by tasks.

Example:

```yaml
tasks:
  - name: Update Nginx config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: Restart Nginx

handlers:
  - name: Restart Nginx
    service:
      name: nginx
      state: restarted
```
Handlers prevent unnecessary restarts.

## 5.5 Variables in Playbooks

Variables can be defined:

#### Inline in a play
```yaml
vars:
  app_port: 8080
```

#### Passed as extra vars
```bash
ansible-playbook deploy.yml -e "version=1.2"
```
#### Loaded from vars files
```yaml
vars_files:
  - vars/common.yml
```

## 5.6 Conditionals

Use when: to run tasks only when conditions match.
```yaml
- name: Install Apache on Debian systems
  apt:
    name: apache2
    state: present
  when: ansible_facts.os_family == "Debian"
```

## 5.7 Loops

Run a task multiple times using loops.

```yaml
- name: Install multiple packages
  apt:
    name: "{{ item }}"
    state: present
  loop:
    - git
    - curl
    - unzip
```
## 5.8 Tags

Tags let you run specific parts of a playbook.

```yaml
tasks:
  - name: Install Nginx
    apt:
      name: nginx
      state: present
    tags: install

  - name: Copy config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    tags: config
```

Run only the config task:
```bash
ansible-playbook web.yml --tags config
```
## 5.9 Multiple Plays in One Playbook

You can target different host groups in one file.

```yaml
- name: Configure DB servers
  hosts: db
  tasks:
    - name: Install MySQL
      apt:
        name: mysql-server
        state: present

- name: Configure Web servers
  hosts: web
  tasks:
    - name: Install PHP
      apt:
        name: php
        state: present
```
## 5.10 Best Practices for Playbooks

- Keep playbooks short and readable
- Use variables instead of hardcoding values
- Use handlers for restarts
- Use roles for large projects
- Use tags for selective runs
- Use become: yes only when needed
- Test with --check (dry run mode)

## Summary

A playbook is the foundational building block in Ansible.
It describes:

- **What** hosts to configure
- **Which** tasks to run
- **How** to run them (loops, conditionals, handlers, tags)

Playbooks make automation predictable, repeatable, and maintainable.

Next recommended chapter: Modules: The Building Blocks of Automation.