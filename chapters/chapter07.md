# Chapter 7 - Variables and Facts

Variables make Ansible flexible and reusable.  
Facts provide system information gathered automatically from managed hosts.

Together, they enable dynamic, intelligent automation.

---

# 7.1 What Are Variables?

Variables store values that you want to reuse or parameterize in playbooks.

Examples:
```yaml
app_port: 8080
package_name: nginx
```

Use them:
```yaml
- name: Install package
  apt:
    name: "{{ package_name }}"
    state: present
```

---

# 7.2 Where to Define Variables

Variables can be defined in multiple places.

## 1. In a Playbook
```yaml
vars:
  app_port: 8080
```

## 2. In a `vars_files` file
Playbook:
```yaml
vars_files:
  - vars.yml
```
`vars.yml`:
```yaml
app_name: myapp
```

## 3. In Inventory (INI)
```ini
[web]
web1 app_env=prod
```

## 4. In Inventory (YAML)
```yaml
web:
  hosts:
    web1:
      app_env: prod
```

## 5. In `group_vars/` and `host_vars/` directories
Recommended for large projects.

Example directory:
```
inventory/
├── group_vars/
│   └── web.yml
└── host_vars/
    └── web1.yml
```

`group_vars/web.yml`:
```yaml
deploy_env: production
```

`host_vars/web1.yml`:
```yaml
hostname: web1-prod
```

## 6. Extra vars (highest priority)
```bash
ansible-playbook site.yml -e "version=2.1"
```

---

# 7.3 Variable Precedence (Important)

Variable sources override each other.

**highest → lowest priority**

1. Extra vars (`-e`)  
2. Task vars  
3. Block vars  
4. Role vars  
5. Play vars  
6. Inventory (host → group vars)  
7. Facts  
8. Defaults (role defaults)

---

# 7.4 Using Variables Safely

### Avoid undefined variable errors:
```yaml
{{ myvar | default('not set') }}
```

### Convert values:
```yaml
{{ port | int }}
```

### Check truthiness:
```yaml
when: enable_service | bool
```

---

# 7.5 Facts: Automatically Collected System Information

Ansible gathers system info from managed hosts when a play starts.

Facts include:

- OS type  
- Kernel version  
- Network interfaces  
- IP addresses  
- CPU/memory  
- Disk info  
- Installed packages  

View all facts:
```bash
ansible web -m setup
```

Example facts:
- `ansible_facts.hostname`
- `ansible_facts.os_family`
- `ansible_facts.ipv4`
- `ansible_facts.pkg_mgr`

Use facts in playbooks:
```yaml
when: ansible_facts.os_family == "Debian"
```

---

# 7.6 Disabling Fact Gathering (Optional)

To speed up playbook runs:
```yaml
gather_facts: no
```

Gather manually:
```yaml
- name: Gather facts now
  setup:
```

---

# 7.7 Custom Facts

You can define your own facts on the managed host.

Place a file in:
```
/etc/ansible/facts.d/custom.fact
```

`custom.fact` example:
```ini
[app]
version=1.5
role=backend
```

Access it:
```yaml
{{ ansible_facts.ansible_local.app.version }}
```

---

# 7.8 Registered Variables (Capturing Task Output)

Use `register:` to store results of a command or module.

Example:
```yaml
- name: Get file stat
  stat:
    path: /etc/passwd
  register: result

- name: Show size
  debug:
    msg: "File size is {{ result.stat.size }}"
```

Example with command:
```yaml
- name: Get current date
  command: date
  register: date_output

- name: Print date
  debug:
    msg: "{{ date_output.stdout }}"
```

---

# 7.9 The `debug` Module (Essential for Variables)

To print variables:
```yaml
- debug:
    var: app_port
```

Or print a message:
```yaml
- debug:
    msg: "Deploying to {{ deploy_env }}"
```

---

# 7.10 Best Practices

- Use meaningful variable names  
- Keep environment variables in `group_vars/`  
- Use default filters to avoid errors  
- Use registered variables for command output  
- Prefer inventory/YAML vars over inline vars  
- Use extra vars (`-e`) only for CI/CD or automation  

---

# Summary

Variables make playbooks flexible and reusable.  
Facts give you a real-time picture of each system.  

Together, they allow you to:

- Write dynamic logic  
- Control behavior based on OS type, environment, or config  
- Capture and use task output  
- Keep your playbooks clean and maintainable  

**Next recommended chapter:** Templates and Jinja2 (Chapter 9).
