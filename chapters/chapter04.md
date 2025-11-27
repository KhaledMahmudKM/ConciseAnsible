# Chapter 4 - Inventory Management

Inventory is the foundation of Ansible automation. It defines **which hosts** tasks and playbooks target and **how they are grouped**.

---

## 4.1 Introduction

- Inventory lists all the managed nodes (hosts).  
- Hosts can be organized into **groups** for easier management.  
- Proper inventory management is key for **scalability** and **automation efficiency**.

---

## 4.2 Static Inventory

Static inventories are simple text files that define hosts and groups.  
They can be in **INI** or **YAML** format.

### INI Example

```ini
[web]
web1.example.com
web2.example.com

[db]
db1.example.com
db2.example.com

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa
```
- `[web]` and `[db]` are groups.
- `[all:vars]` defines variables applied to all hosts.

### YAML Example

```yaml
all:
  hosts:
    web1.example.com:
    web2.example.com:
    db1.example.com:
    db2.example.com:
  vars:
    ansible_user: ubuntu
    ansible_ssh_private_key_file: ~/.ssh/id_rsa
  children:
    web:
      hosts:
        web1.example.com:
        web2.example.com:
    db:
      hosts:
        db1.example.com:
        db2.example.com:
```

## 4.3 Using Multiple Inventories

Ansible can merge multiple inventory files:
```bash
ansible-playbook site.yml -i inventory/prod -i inventory/dev
```

Or use a directory:
```
inventory/
  prod/
    hosts.ini
    group_vars/
  dev/
    hosts.ini
    group_vars/
```

Run:
```bash
ansible-playbook site.yml -i inventory/prod
```

## 4.4 Dynamic Inventory

Dynamic inventories are scripts or plugins that fetch host information automatically, often from cloud providers.
- **AWS**: `aws_ec2` plugin
- **Azure**: `azure_rm` plugin
- **GCP**: `gcp_compute` plugin

Example AWS dynamic inventory configuration:
```yaml
plugin: amazon.aws.aws_ec2
regions:
  - us-east-1
keyed_groups:
  - key: tags.Environment
    prefix: env
```
- Groups hosts based on tags like Environment=production.


## 4.5 Inventory Management Commands

- Ansible provides tools to inspect and manage inventory:

View inventory as JSON:
```bash
ansible-inventory --list
```

- Visualize host-group hierarchy:
```bash
ansible-inventory --graph
```

```bash
ansible-inventory -i aws_ec2.yml --graph
```
- Target a specific host or group:
```bash
ansible web -m ping
ansible db -m shell -a "uptime"
```

## 4.6 Group Variables and Host Variables

Organize variables for hosts and groups:
```
inventory/
├── group_vars/
│   └── web.yml
└── host_vars/
    └── web1.example.com.yml
```

- Group variables apply to all hosts in a group.
- Host variables override group or global variables for specific hosts.

## 4.7 Checking and Visualizing Inventory

Useful commands:

|Command|	Purpose|
|--------|--------|
|`ansible-inventory --list -i inventory.ini`	|Show full JSON inventory|
|`ansible-inventory --graph -i inventory.ini`	|Show host/group graph|
|`ansible all -m ping -i inventory.ini`	|Test connectivity|
|`ansible-playbook -i inventory.ini play.yml`	|Run with specific inventory|

## 4.8 Best Practices

- Use meaningful host and group names.
- Separate static and dynamic inventories.
- Avoid storing sensitive data in inventory files; use Ansible Vault.
- Keep inventory files under version control.
- Use group_vars and host_vars for organized variable management.

## 4.9 Summary

- An inventory defines the hosts Ansible manages.
- Supports INI, YAML, and dynamic formats.
- Host/group variables can be defined inline or in `host_vars` / `group_vars`.
- Group nesting provides flexible host organization.
- Dynamic inventories integrate with cloud providers.
- `ansible-inventory` helps validate and visualize.
