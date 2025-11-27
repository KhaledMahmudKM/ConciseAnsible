# Chapter 2 - Installing and Setting Up Ansible

## 2.1 Installing Ansible on Ubuntu

### Step 1: Update your package list
```bash
sudo apt update
```

### Step 2: Install Ansible
Ubuntu 22.04+ includes Ansible in the standard repository:

```bash
sudo apt install ansible -y
```

### Step 3: Verify the installation
```bash
ansible --version
```

You should see something like:

```
ansible [core 2.17.0]
```

---

## 2.2 Understanding the Ansible Configuration Files

After installation, Ansible looks for configuration in this order:

1. `ANSIBLE_CONFIG` environment variable  
2. `ansible.cfg` in the current directory  
3. `~/.ansible.cfg`  
4. `/etc/ansible/ansible.cfg`  

You can customize behavior like:
- default inventory location  
- SSH settings  
- privilege escalation  
- retry files  
- roles path  

But for most beginners, the default settings are fine.

---

## 2.3 Creating Your Inventory File

Ansible needs an *inventory file* to know which servers to manage.

Create a simple inventory:

```
/etc/ansible/inventory.ini
```

Example:

```ini
[webservers]
192.168.1.10
192.168.1.11

[dbservers]
192.168.1.20
```

Test connectivity:

```bash
ansible all -i inventory.ini -m ping
```

---

## 2.4 Passwordless SSH Setup (Recommended)

Ansible uses SSH to connect to Linux servers.  
The best practice is to use SSH keys.

Generate a key pair:

```bash
ssh-keygen -t ed25519
```

Copy your key to a remote machine:

```bash
ssh-copy-id user@server-ip
```

Test login:

```bash
ssh user@server-ip
```

If it logs in without asking for a password, Ansible will work smoothly.

---

## 2.5 Installing Additional Collections (Optional)

Some features require extra packages from Ansible Galaxy.

Example: AWS automation

```bash
ansible-galaxy collection install amazon.aws
```

Example: Cisco network automation

```bash
ansible-galaxy collection install cisco.ios
```

---

## 2.6 Testing Your Setup With an Ad-hoc Command

Try gathering facts from all hosts:

```bash
ansible all -i inventory.ini -m gather_facts
```

Or check uptime:

```bash
ansible all -i inventory.ini -m command -a "uptime"
```

---

## Summary
After this chapter, you should have:
- Ansible installed  
- An inventory file ready  
- SSH keys configured  
- Able to run ad-hoc commands

