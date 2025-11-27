# Chapter 11 - Roles, Project Structure, and Ansible Galaxy

As Ansible projects grow, organizing playbooks, tasks, and variables becomes essential.  
Roles provide a standard way to structure reusable automation components, and Ansible Galaxy allows sharing and reusing roles.

---

# 11.1 What Is a Role?

A **role** is a collection of tasks, variables, handlers, templates, and files that automate a specific function, like setting up a web server or database.

**Advantages of roles:**

- Modular and reusable  
- Easy to share  
- Standardized directory structure  
- Simplifies playbooks  

---

# 11.2 Standard Role Directory Structure



---

# 11.2 Standard Role Directory Structure
```
roles/
└── webserver/
├── tasks/
│ └── main.yml
├── handlers/
│ └── main.yml
├── templates/
│ └── nginx.conf.j2
├── files/
│ └── index.html
├── vars/
│ └── main.yml
├── defaults/
│ └── main.yml
├── meta/
│ └── main.yml
```


- **tasks/** – main task list (`main.yml`)  
- **handlers/** – service restart/reload handlers  
- **templates/** – Jinja2 templates  
- **files/** – static files to copy  
- **vars/** – variables with high precedence  
- **defaults/** – default variables (lowest precedence)  
- **meta/** – metadata and role dependencies  

---

# 11.3 Creating a Role

Use `ansible-galaxy` to scaffold a role:

```bash
ansible-galaxy init webserver
```

This creates the standard directory structure automatically.

## 11.4 Using a Role in a Playbook

Example playbook using the webserver role:
```yaml
- name: Configure web servers
  hosts: web
  become: yes
  roles:
    - webserver
```
- Roles can be applied to multiple hosts or groups.
- Multiple roles can be listed in a play:
```yaml
roles:
  - common
  - webserver
  - monitoring
```
## 11.5 Role Variables

Variables can be defined in:
- `defaults/main.yml` – default, lowest precedence
- `vars/main.yml` – higher precedence than defaults
- Playbook or extra vars – overrides role vars

Example `defaults/main.yml`:
```yaml
nginx_port: 80
server_name: localhost
```

## 11.6 Role Dependencies

Roles can depend on other roles.
Define dependencies in meta/main.yml:
```yaml
dependencies:
  - { role: common }
  - { role: monitoring }
```

When the role runs, dependencies run first.

## 11.7 Ansible Galaxy

Ansible Galaxy is a hub for sharing roles and collections.
It allows you to reuse community roles or share your own.

### 11.7.1 Searching for Roles

Use the CLI:
```bash
ansible-galaxy search nginx
```

Search results include:
- Role name
- Author
- Download count
- Supported platforms
- Galaxy rating

### 11.7.2 Installing Roles from Galaxy

Install a role:
```bash
ansible-galaxy install -p ./roles geerlingguy.nginx
```
### 11.7.3 Creating and Sharing Your Own Role

1. Scaffold role:
```bash
ansible-galaxy init myrole
```
2. Add tasks, handlers, templates, etc.
3. Test locally
4. Tag a release in GitHub: v1.0.0
5. Publish:
```bash
ansible-galaxy role import <GitHub_username>/<repository>
```

## 11.8 Best Practices for Roles

- Keep tasks simple and focused
- Use handlers for service changes
- Store static files in `files/`
- Store dynamic files in `templates/`
- Define default variables in `defaults/`
- Avoid hardcoding values; use variables
- Document roles in `README.md`
- Use semantic versioning
- Test roles before sharing

## Summary

Roles make large Ansible projects modular, reusable, and maintainable:
- Define tasks, handlers, templates, variables, defaults, and dependencies
- Apply roles in playbooks, alone or combined
- Ansible Galaxy allows searching, installing, and sharing roles
- Collections extend role functionality with modules and plugins

---