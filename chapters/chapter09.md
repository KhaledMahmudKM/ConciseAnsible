# Chapter 9 - Handlers and Notifications

Handlers are special tasks in Ansible that run **only when notified** by another task.  
They are typically used for service restarts or reloads after a configuration change.

---

# 9.1 What Are Handlers?

Handlers are like “conditional tasks” triggered by other tasks.  
They run **once per play**, even if multiple tasks notify them.

Example:
```yaml
tasks:
  - name: Update nginx configuration
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

- `notify`: tells Ansible which handler to run
- Handlers are defined under the `handlers`: section

## 9.2 Rules of Handlers

- Run only if notified
- Run once per play
- Can be notified by multiple tasks
- Use descriptive names

## 9.3 Notifying Multiple Handlers

A task can notify multiple handlers:
```yaml
tasks:
  - name: Update app configuration
    template:
      src: app.conf.j2
      dest: /etc/app/app.conf
    notify:
      - Restart App
      - Reload Monitoring
```
Handlers section:
```yaml
handlers:
  - name: Restart App
    service:
      name: app
      state: restarted
  - name: Reload Monitoring
    service:
      name: monit
      state: reloaded
```

## 9.4 Conditional Handlers

You can run a handler only under certain conditions:
```yaml
tasks:
  - name: Update nginx config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: Restart Nginx
    when: ansible_facts.os_family == "Debian"

handlers:
  - name: Restart Nginx
    service:
      name: nginx
      state: restarted
```

## 9.5 Using Handlers with Roles

In roles, handlers live in roles/<role_name>/handlers/main.yml:

```
roles/
└── webserver/
    ├── tasks/
    │   └── main.yml
    └── handlers/
        └── main.yml
```

Example handler in a role:
```yaml
- name: Restart nginx
  service:
    name: nginx
    state: restarted
```

Tasks notify it like:
```yaml
- name: Deploy nginx template
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Restart nginx
```

## 9.6 Best Practices

- Give handlers clear, descriptive names
- Keep handlers idempotent
- Only notify handlers when changes occur
- Avoid unnecessary service restarts
- Place handlers in roles when possible

## Summary

Handlers allow Ansible to respond to changes in a controlled way:

- Triggered by tasks (`notify`)
- Run once per play
- Can restart/reload services or perform any action
- Use handlers to keep playbooks efficient and predictable



