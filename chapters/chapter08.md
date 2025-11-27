# Chapter 8 - Templates and Jinja2

Ansible uses **Jinja2 templates** to dynamically generate configuration files, scripts, and other text-based files.  
Templates allow you to use variables, conditionals, loops, and filters to customize files for each host.

---

# 8.1 What Are Templates?

Templates are text files with placeholders for dynamic content, usually ending with `.j2`.  
They are processed by Ansible using **Jinja2** and rendered on the target host.

Example template (`nginx.conf.j2`):
```
server {
    listen {{ app_port }};
    server_name {{ server_name }};
}
```
Rendered on host:
```
server {
    listen 8080;
    server_name web1.example.com;
}
```

---

# 8.2 Using the `template` Module

Copy and render a template from your control node to managed hosts:
```yaml
- name: Deploy nginx configuration
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: '0644'
  notify: Restart Nginx
```

- `src`: template file on control node  
- `dest`: destination path on remote host  
- `owner`, `group`, `mode`: file permissions  
- `notify`: triggers a handler if the file changes

---

# 8.3 Jinja2 Basics

### Variables
```
{{ variable_name }}
```

### Filters
Modify variables:
```
{{ app_port | int }}
{{ server_name | upper }}
```

### Conditionals
```
{% if deploy_env == 'prod' %}
listen 80;
{% else %}
listen 8080;
{% endif %}
```

### Loops
```
{% for host in groups['web'] %}
server_name {{ host }};
{% endfor %}
```

---

# 8.4 Using Facts in Templates

Example:
```
server {
    listen 80;
    server_name {{ ansible_facts.hostname }};
}
```
Facts let templates adapt automatically to each host.

---

# 8.5 Combining Templates with Handlers

Templates often trigger service reloads:
```yaml
- name: Deploy config
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Reload Nginx

handlers:
  - name: Reload Nginx
    service:
      name: nginx
      state: reloaded
```

---

# 8.6 Filters and Built-in Functions

Some common filters:

| Filter | Example | Result |
|--------|---------|--------|
| `default` | `{{ var | default('none') }}` | 'none' if var undefined |
| `int` | `{{ '10' | int }}` | 10 |
| `lower` | `{{ 'HELLO' | lower }}` | hello |
| `upper` | `{{ 'hello' | upper }}` | HELLO |
| `replace` | `{{ hostname | replace('web','srv') }}` | srv1.example.com |
| `list` | `{{ groups['web'] | list }}` | ['web1','web2'] |

---

# 8.7 Best Practices

- Keep templates simple and readable  
- Use variables and facts, not hardcoded values  
- Test template rendering with `ansible-playbook --check`  
- Trigger handlers only on changes (`notify`)  
- Use loops and conditionals for repeated blocks  
- Store templates in `templates/` directory within a role

---

# Summary

Templates and Jinja2 allow you to generate dynamic configuration files per host.  
Key takeaways:

- Templates use `.j2` files rendered with variables, facts, loops, and conditionals  
- The `template` module copies and renders templates to remote hosts  
- Handlers should be used to reload/restart services when templates change  
- Filters modify variable values for more flexibility  

Templates make playbooks reusable, dynamic, and environment-aware.
