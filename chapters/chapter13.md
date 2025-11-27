# Chapter 13: Ansible Vault and Security

**Purpose:** Protect sensitive data like passwords, API keys, and private keys in your Ansible projects.

---

## 13.1 What Is Ansible Vault?

- Encrypts files and variables in playbooks  
- Ensures sensitive data is **not stored in plain text**  
- Integrated with playbooks, roles, and inventories  

---

## 13.2 Creating Vault Files

```bash
ansible-vault create secrets.yml
```

- Opens an editor to add encrypted content
- Saves file in encrypted form

## 13.3 Editing Vault Files
```bash
ansible-vault edit secrets.yml
```

Opens the file securely for editing

## 13.4 Encrypting Existing Files
```bash
ansible-vault encrypt vars.yml
```

Encrypts an existing YAML file

## 13.5 Decrypting Files
```bash
ansible-vault decrypt secrets.yml
```

Makes encrypted files readable again

## 13.6 Using Vault in Playbooks
```yaml
vars_files:
  - secrets.yml
```

Run playbook with vault password:
```bash
ansible-playbook site.yml --ask-vault-pass
```

Or use a password file:
```bash
ansible-playbook site.yml --vault-password-file ~/.vault_pass.txt
```

## 13.7 Best Practices

- Store vault passwords securely
- Only encrypt sensitive data, not the whole project
- Use different vaults for different environments
- Combine Vault with CI/CD pipelines for automation

## Summary

This chapter was about how to encrypt and manage secrets safely with Ansible Vault, keeping automation secure and compliant.