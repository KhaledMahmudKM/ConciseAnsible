# Chapter 22 - Ansible Best Practices and Optimization

Once your Ansible projects grow, following best practices ensures **maintainability, efficiency, and reliability**.

---

## 22.1 Organize Your Project

- Use **roles** for modularity  
- Keep **playbooks short and readable**  
- Separate **vars**, **defaults**, **handlers**, **templates**, and **files** in roles  
- Use **directory structure** consistently:

```
project/
├── inventories/
├── playbooks/
├── roles/
└── group_vars/
```

---

## 22.2 Use Version Control

- Store playbooks, roles, and inventories in **Git**  
- Use branches for testing new changes  
- Commit meaningful messages  

---

## 22.3 Idempotency

- Ensure tasks can run multiple times **without changing the system unnecessarily**  
- Example: `state: present` or `state: latest` for package installation  

```yaml
- name: Install nginx
  apt:
    name: nginx
    state: latest
```

## 22.4 Avoid Hardcoding Values

- Use variables and defaults instead of hardcoding
- Use `group_vars` and `host_vars` for environment-specific values

## 22.5 Optimize Playbooks

- Use **tags** to run specific tasks
- Use **delegation** for tasks that should run on a specific host
- Use `run_once` for tasks that only need one execution
- Use **fact caching** for large inventories to reduce repeated gathering

## 22.6 Minimize Repetitive Tasks

- Use **loops** for multiple items
- Use `include_tasks` or **roles** for reusable blocks
- Avoid copy-pasting tasks

## 22.7 Error Handling and Logging

- Use `block`/`rescue`/`always` for predictable error handling
- Use `ignore_errors` only when safe
- Enable verbose logging for debugging:

```bash
ansible-playbook site.yml -vvv
```

## 22.8 Security Practices

- Use **Ansible Vault** for sensitive data
- Limit SSH access and privileges
- Audit playbooks regularly for hardcoded secrets or insecure practices

## 22.9 Performance Tips

- Use `async` and `poll` for long-running tasks
```yaml
- name: Run long task asynchronously
  command: /usr/bin/long_task.sh
  async: 600
  poll: 0
```
- Use `serial` to control batch execution
- Limit `gather_facts` when unnecessary: `gather_facts: no`

## 22.10 Documentation

- Include README.md for each role and project
- Document variables, expected hosts, dependencies, and examples
- Helps team members understand and reuse automation

## Summary

This chapter covers best practices and optimization:

- Organize projects and use roles
- Ensure idempotency and avoid hardcoding
- Optimize performance and reduce repetitive tasks
- Handle errors gracefully and maintain security
- Document thoroughly for maintainability
