# Chapter 12: Advanced Playbook Techniques

Once you are comfortable with basic playbooks, Ansible provides advanced techniques to make automation **more dynamic, reusable, and maintainable**.

---

# 12.1 Include and Import Statements

Use include/import to organize large playbooks.

### `import_playbook`
- Static inclusion  
- Processed **at playbook parse time**  

```yaml
- import_playbook: webservers.yml
- import_playbook: databases.yml
```

### `include_tasks`

- Dynamic inclusion
- Processed at runtime
- Useful for conditional task execution

```yaml 
- include_tasks: setup.yml
  when: ansible_facts.os_family == "Debian"
```
## 12.2 Using Tags

Tags allow running only specific parts of a playbook:
```yaml
- name: Install packages
  apt:
    name: "{{ item }}"
    state: present
  loop:
    - git
    - curl
  tags: packages
```
Run tagged tasks:
```bash
ansible-playbook site.yml --tags packages
```

Skip tasks:
```bash
ansible-playbook site.yml --skip-tags packages
```

## 12.3 Using `include_vars` and `import_role`

Dynamic inclusion of variables:
```yaml
- name: Include environment variables
  include_vars: "vars/{{ env }}.yml"
```

Dynamic inclusion of roles:
```yaml
- name: Include role dynamically
  import_role:
    name: "{{ role_name }}"
```

## 12.4 Delegation and Local Actions

Run tasks on a **specific host**:
```yaml
- name: Run command on database server
  command: /usr/bin/backup.sh
  delegate_to: db1.example.com
```

Run tasks on the **control node**:
```yaml
- name: Generate local report
  local_action:
    module: command
    args:
      cmd: /usr/bin/generate_report.sh
```

## 12.5 Using `block` for Grouping and Error Handling

Blocks allow grouping tasks and managing errors:
```yaml
tasks:
  - block:
      - name: Step 1
        command: /bin/true
      - name: Step 2
        command: /bin/false
    rescue:
      - name: Handle error
        debug:
          msg: "An error occurred"
    always:
      - name: Always runs
        debug:
          msg: "This runs regardless"
```
## 12.6 Using `run_once` and `serial`

- **`run_once`**: execute task only on the first host
```yaml
- name: Print once
  debug:
    msg: "This runs only once"
  run_once: yes
```

- **`serial`**: limit play execution per batch
```yaml
- hosts: web
  serial: 2
```

## 12.7 Loops with Complex Data Structures

Loop over dictionaries:
```yaml
users:
  alice:
    groups: sudo
  bob:
    groups: docker

- name: Create users
  user:
    name: "{{ item.key }}"
    groups: "{{ item.value.groups }}"
    state: present
  loop: "{{ users | dict2items }}"
```

Loop with include_tasks:
```yaml
- include_tasks: setup_user.yml
  loop: "{{ users | dict2items }}"
  loop_control:
    loop_var: user
```

## 12.8 Dynamic Inventories and Fact Filtering

Filter facts dynamically:
```yaml
- debug:
    msg: "{{ ansible_facts['interfaces'] }}"
```

Use `hostvars` and `group_names` for dynamic referencing:
```yaml
- debug:
    msg: "Database host is {{ hostvars[groups['db'][0]].ansible_facts.hostname }}"
```

## 12.9 Best Practices

- Break large playbooks into smaller includes or roles
- Use tags to run parts of the playbook efficiently
- Group tasks with `block` for readability and error handling
- Use delegation and run_once to control task execution
- Use dynamic variables, loops, and hostvars to handle complex scenarios

## Summary

- Advanced playbook techniques help:
- Organize complex automation
- Execute tasks conditionally or on specific hosts
- Handle errors and failures gracefully
- Loop through complex data
- Work efficiently with large inventories
- Mastering these techniques prepares you for real-world automation at scale.