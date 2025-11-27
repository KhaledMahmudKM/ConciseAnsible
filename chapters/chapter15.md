# Chapter 15: Ansible for Cloud Automation

Ansible can automate cloud resources across providers like AWS, Azure, GCP, and others.  
This chapter introduces how to use Ansible for provisioning, configuring, and managing cloud infrastructure.

---

## 15.1 Cloud Modules Overview

- Ansible provides **cloud-specific modules** for various providers:  
  - AWS: `ec2`, `s3_bucket`, `elb`  
  - Azure: `azure_rm_virtualmachine`, `azure_rm_resourcegroup`  
  - GCP: `gcp_compute_instance`, `gcp_storage_bucket`  

- These modules allow creating, updating, and deleting resources programmatically.

---

## 15.2 Setting Up Credentials

- **AWS Example:** Store credentials in `~/.aws/credentials`:
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```

- **Azure Example:** Use `az login` or a service principal  
- **GCP Example:** Use a service account JSON key  

---

## 15.3 Provisioning Cloud Resources

### AWS EC2 Instance Example:

```yaml
- name: Launch EC2 instance
  hosts: localhost
  gather_facts: no
  tasks:
    - name: Create a new EC2 instance
      amazon.aws.ec2_instance:
        name: mywebserver
        key_name: mykey
        instance_type: t2.micro
        image_id: ami-12345678
        wait: yes
        count: 1
      register: ec2
```

- `register`: ec2 captures instance details for further use

## 15.4 Managing Cloud Resources

Start, stop, or terminate instances:
```yaml
- name: Stop EC2 instance
  amazon.aws.ec2_instance:
    instance_ids: "{{ ec2.instance_ids }}"
    state: stopped
```

Manage storage, security groups, and networking via respective modules

## 15.5 Using Dynamic Inventories

Dynamic inventory scripts allow Ansible to fetch hosts from cloud providers automatically

Example AWS dynamic inventory:
```ini
plugin: amazon.aws.aws_ec2
regions:
  - us-east-1
keyed_groups:
  - key: tags.Environment
    prefix: env
```

- Reduces manual inventory management for ephemeral cloud hosts

## 15.6 Combining Cloud Provisioning with Configuration

- Use roles and playbooks to provision infrastructure and configure it in one workflow:
```yaml
- import_playbook: provision_ec2.yml
- hosts: tag_Environment_production
  roles:
    - webserver
    - monitoring
```

Enables infrastructure as code (**IaC**) approach

## 15.7 Best Practices

- Keep cloud credentials secure (use vaults or environment variables)
- Use dynamic inventories for ephemeral resources
- Separate provisioning and configuration for clarity
- Leverage tags and resource naming conventions
- Test playbooks in staging before production

## Summary

- Ansible for cloud automation allows:
- Provisioning and managing cloud resources
- Using dynamic inventories for automatic host detection
- Integrating infrastructure setup with application configuration
- Following IaC principles for repeatable, consistent cloud environments
