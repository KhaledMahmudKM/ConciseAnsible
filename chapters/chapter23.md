# Chapter 23 - Troubleshooting and Debugging Ansible

Even with best practices, playbooks may fail or behave unexpectedly.  
This chapter covers **how to diagnose, debug, and resolve issues**.

---

## 23.1 Verbose Mode

Use verbose flags to get detailed output:

```bash
ansible-playbook site.yml -v     # basic verbosity
ansible-playbook site.yml -vv    # more details
ansible-playbook site.yml -vvv   # very detailed
ansible-playbook site.yml -vvvv  # full debug
```
- `-v` through `-vvvv` increase the level of information

## 23.2 Check Mode

- Use `--check` to run playbooks without making changes:
```bash
ansible-playbook site.yml --check
```
- Useful for testing changes safely
- Combined with `--diff` to see what would change

## 23.3 Dry-Run with Diff
```bash
ansible-playbook site.yml --check --diff
```
- Shows differences for templates, files, or configs
- Helps confirm changes before applying

## 23.4 Debug Module

- Print variable values or messages:
```yaml
- name: Debug a variable
  debug:
    var: my_variable
```

- Custom messages:
```yaml
- debug:
    msg: "Current hostname is {{ ansible_facts.hostname }}"
```
## 23.5 Registering Variables

- Capture task results for debugging:
```yaml
- name: Run command
  command: /bin/ls /tmp
  register: ls_output
```
```yaml
- debug:
    var: ls_output.stdout_lines
```

- Helps track what tasks return

## 23.6 Conditional Debugging

- Debug only when conditions are met:

```yaml
- debug:
    msg: "Package installation failed"
  when: package_result.failed
```

## 23.7 Handling Failed Tasks

- Use `ignore_errors` to continue execution:

```yaml
- command: /bin/false
  ignore_errors: yes
```

- Use `failed_when` for custom failure conditions:

```yaml
- stat:
    path: /tmp/myfile
  register: file_stat
  failed_when: not file_stat.stat.exists
```

## 23.8 Reviewing Logs

- Ansible writes logs if `ANSIBLE_LOG_PATH` is set:
```bash
export ANSIBLE_LOG_PATH=~/ansible.log
ansible-playbook site.yml
```

- Review logs to identify patterns or repeated errors

## 23.9 Common Issues

- **SSH connectivity** – ensure keys, users, and ports are correct
- **Python version issues** – target hosts may require a compatible Python interpreter
- **Variable precedence conflicts** – check defaults, vars, host_vars, and extra vars
- **Permissions** – check `become` usage for tasks requiring root

## 23.10 Best Practices

- Test playbooks incrementally
- Use verbose and debug output strategically
- Combine `register`, `when`, and `debug` for precise troubleshooting
- Keep a log for recurring issues

## Summary

Troubleshooting and debugging are essential skills:
Verbose mode and check mode help preview changes
Debug module and registered variables clarify task behavior
Logs and error handling ensure reliable automation
Anticipate common issues like SSH, permissions, or Python versions