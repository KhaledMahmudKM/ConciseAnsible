# Chapter 3 - Core Ansible Concepts

This chapter explains the fundamental building blocks of Ansible: modules, tasks, plays, playbooks, inventories, facts, and idempotency.  
These concepts form the foundation for everything you do with Ansible.

---

## 3.1 Modules

**Modules** are the smallest units of work in Ansible.  
Each task uses a module to perform an action, such as:

- Installing a package (`apt`, `yum`)
- Managing files (`copy`, `template`, `file`)
- Managing services (`service`, `systemd`)
- Running commands (`command`, `shell`)
- Creating users (`user`)
- Working with the cloud (`amazon.aws.ec2`, `azure.azcollection.azure_rm_vm`)

Example:

```yaml
- name: Install nginx
  apt:
    name: nginx
    state: present
```

---

## 3.2 Tasks

A **task** is a single module invocation.  
Tasks run **sequentially** in the order they appear in a playbook.

Example task:

```yaml
- name: Start nginx service
  service:
    name: nginx
    state: started
```

Key characteristics:
- Tasks are idempotent.
- Tasks can notify handlers.
- Tasks run on all targeted hosts unless limited.

---

## 3.3 Plays

A **play** defines:
- which hosts to run tasks on
- what tasks to run
- privilege escalation (sudo)
- variables and other settings

Example:

```yaml
- name: Configure web servers
  hosts: webservers
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
```

A play is a mapping between hosts and tasks.

---

## 3.4 Playbooks

A **playbook** is a YAML file containing one or more plays.  
It is the main way you define automation.

Example playbook:

```yaml
---
- name: Setup web servers
  hosts: webservers
  become: yes

  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present

    - name: Enable nginx
      service:
        name: nginx
        state: started
```

Run it with:

```bash
ansible-playbook webserver.yaml
```

---

## 3.5 Inventory

The **inventory** defines *which* machines Ansible will manage.  
It can be:

- static (INI or YAML file)
- dynamic (cloud APIs)
- mixed

Example INI-style:

```ini
[webservers]
192.168.1.10
192.168.1.11

[dbservers]
db01.example.com
```

Example YAML-style:

```yaml
all:
  children:
    webservers:
      hosts:
        192.168.1.10:
        192.168.1.11:
    dbservers:
      hosts:
        db01.example.com:
```

---

## 3.6 Facts

**Facts** are system details collected automatically from managed nodes, such as:

- OS version  
- network interfaces  
- memory and CPU  
- mount points  
- IP addresses  

Gather facts manually:

```bash
ansible all -m setup
```

Use a fact in a playbook:

```yaml
debug:
  msg: "This host's IP is {{ ansible_default_ipv4.address }}"
```

---

## 3.7 Variables

Variables let you write flexible playbooks.

Examples:

```yaml
vars:
  package_name: nginx
```

Use like:

```yaml
apt:
  name: "{{ package_name }}"
```

Variables can come from:
- playbooks
- inventory
- `group_vars` and `host_vars`
- facts
- command-line (`--extra-vars`)
- roles
- include files

---

## 3.8 Idempotency

**Idempotency** means a task can run repeatedly without changing the system once the desired state is reached.

Example:

```yaml
apt:
  name: nginx
  state: present
```

If nginx is already installed, nothing changes — no side effects.

This makes Ansible reliable and predictable.

---

## 3.9 Handlers (Preview)

Handlers are special tasks that run *only when notified*, typically after a change.

Example:

```yaml
- name: Restart nginx
  service:
    name: nginx
    state: restarted
  listen: restart nginx
```

They will be fully covered in Chapter 10.

---

## 3.10 Putting It All Together

A complete playbook combining these concepts:

```yaml
---
- name: Complete configuration
  hosts: webservers
  become: yes

  vars:
    package_name: nginx

  tasks:
    - name: Install package
      apt:
        name: "{{ package_name }}"
        state: present

    - name: Start service
      service:
        name: "{{ package_name }}"
        state: started
```

---

## Summary

In this chapter, you learned the essential Ansible concepts:

- Modules → what actions are performed  
- Tasks → single unit of work  
- Plays → map tasks to hosts  
- Playbooks → automation defined in YAML  
- Inventory → list of managed hosts  
- Facts → system details gathered automatically  
- Variables → make playbooks flexible  
- Idempotency → ensures safe repeated runs  

These basics prepare you for writing real automation.

