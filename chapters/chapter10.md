# Chapter 10 - Loops, Conditionals, and Error Handling

Ansible provides **loops**, **conditionals**, and **error handling** to make playbooks dynamic and robust.

---

# 10.1 Loops

Loops allow tasks to run multiple times with different items.

Example using a list of packages:
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
Loop with a dictionary:
```yaml
- name: Create users
  user:
    name: "{{ item.name }}"
    state: present
    groups: "{{ item.groups }}"
  loop:
    - { name: 'alice', groups: 'sudo' }
    - { name: 'bob', groups: 'docker' }
```

## 10.2 Conditionals

Use when: to run tasks only when conditions are met.
```yaml
- name: Install Apache on Debian systems
  apt:
    name: apache2
    state: present
  when: ansible_facts.os_family == "Debian"
```

Multiple conditions:
```yaml
- name: Task with multiple conditions
  command: echo "Hello"
  when: ansible_facts.os_family == "Debian" and ansible_facts.architecture == "x86_64"
```

## 10.3 Error Handling
### Ignore errors

```yaml
- name: Run risky command
  command: /bin/false
  ignore_errors: yes
```

### Use `failed_when`

Define when a task should be considered failed:
```yaml
- name: Check for file existence
  stat:
    path: /tmp/myfile
  register: file_status
  failed_when: file_status.stat.exists == false
```

### Use `block`, `rescue`, `always`

```yaml
tasks:
  - block:
      - name: Task 1
        command: /bin/true
      - name: Task 2
        command: /bin/false
    rescue:
      - name: Handle failure
        debug:
          msg: "Something went wrong"
    always:
      - name: Always runs
        debug:
          msg: "This always runs"
```

Blocks help structure playbooks with multiple tasks and proper error handling.

## 10.4 Best Practices

- Use loops instead of repeating tasks
- Keep conditionals simple and readable
- Use `ignore_errors` sparingly
- Use `block/rescue/always` for predictable failure handling
- Register variables when needed for decisions

## Summary

Loops, conditionals, and error handling make playbooks dynamic and robust:
- Loops allow repetitive tasks efficiently
- Conditionals control task execution based on host facts or variables
- Error handling ensures playbooks can continue or handle failures gracefully