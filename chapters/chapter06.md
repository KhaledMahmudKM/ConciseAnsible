# Chapter 6 - Modules

**Modules** are the real “workers” in Ansible.  
Every task in a playbook uses a module to perform an action such as:

- Installing packages  
- Managing users  
- Copying files  
- Starting services  
- Editing configuration files  
- Interacting with APIs  
- Managing cloud resources  

Playbooks only describe *what* to do.  
**Modules actually do the work.**

---

## 6.1 What Is a Module?

A **module** is a reusable, standalone unit of code that performs a specific operation.

Example task using the `apt` module:
```yaml
- name: Install nginx
  apt:
    name: nginx
    state: present
```

Ansible executes this module on the target host via SSH (or WinRM for Windows).

## 6.2 Running Modules Directly with ansible Command

You don’t need a playbook just to test a module.

Example:
```bash
ansible all -m ping
```
Install a package:

```bash
ansible web -m apt -a "name=nginx state=present" -b
```
Check free memory:
```bash
ansible all -m shell -a "free -m"
```

## 6.3 Types of Modules
### 1. Core modules

Available on all systems, stable and maintained by Ansible.

Examples:

- `apt`
- `yum`
- `copy`
- `file`
- `service`
- `user`
- `template`

### 2. Extras / Community modules

Provided by collections such as:

- community.general
- ansible.posix
- amazon.aws
- azure.azcollection
- community.docker

Example:
```yaml
- amazon.aws.ec2_instance:
    name: web1
    instance_type: t2.micro
```

### 3. Custom modules

You can write your own using:

- Python
- PowerShell (for Windows)
- Any script that returns JSON
---

## 6.4 Frequently Used Modules
### Package Management
```yaml
apt:
  name: nginx
  state: present
```

```yaml
yum:
  name: httpd
  state: latest
```
### File Management
```yaml
copy:
  src: files/app.conf
  dest: /etc/app.conf
```

```yaml
file:
  path: /tmp/testfile
  state: touch
```
### Service Management
```yaml
service:
  name: nginx
  state: restarted
  enabled: yes
```
### User Management
```yaml
user:
  name: deploy
  state: present
  groups: sudo
```

### Template Rendering
```yaml
template:
  src: nginx.conf.j2
  dest: /etc/nginx/nginx.conf
```
### Command Modules

- `command`
- `shell`
- `raw`

Examples:
```yaml
command: ls -l /var/www
```

```yaml
shell: "echo $PATH"
```
`raw` runs without Python and is used for bootstrapping:
```yaml
raw: "yum install -y python3"
```

## 6.5 Idempotency: The Most Important Feature

Most modules are idempotent, meaning:

>Running them multiple times results in the same system state.

Example:
```yaml
apt:
  name: nginx
  state: present
```

Running it again will not reinstall nginx.
Modules compare the desired state to the current state and act only when necessary.

## 6.6 Checking Module Documentation

Use:

```bash
ansible-doc apt
```
Search modules:
```bash
ansible-doc -l | grep mysql
```
View examples:
```bash
ansible-doc service
```

## 6.7 Writing Your Own Module (Simple Example)

Here is a minimal Python-based custom module:
```python
#!/usr/bin/python3

from ansible.module_utils.basic import AnsibleModule

def run():
    module = AnsibleModule(
        argument_spec=dict(
            message=dict(type='str', required=True)
        )
    )
    msg = module.params['message']
    module.exit_json(changed=False, msg=f"Hello {msg}")

if __name__ == '__main__':
    run()
```

Usage:
```yaml
- name: Custom hello module
  custom_hello:
    message: "Ansible User"
```

## 6.8 Best Practices When Using Modules

* Prefer idempotent modules (apt, file, service, template)
* Avoid shell/command unless necessary
* Validate syntax with ansible-playbook --syntax-check
* Use ansible-doc frequently
* Use fully qualified module names (FQCN)
    * Example: ansible.builtin.copy

## Summary

Modules are where the actual work happens in Ansible:

- They manage files, packages, users, services, cloud resources, and more
- You can run them standalone or from playbooks
- Most modules are idempotent, making automation safe and repeatable
- You can write your own modules for custom logic
