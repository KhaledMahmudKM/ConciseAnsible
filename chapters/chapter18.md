# Chapter 18 - Networking Automation

Ansible is widely used to automate **network configuration, management, and monitoring** across multiple devices and vendors. This chapter covers concepts, modules, and best practices for networking automation.

---

## 18.1 Introduction

- Networking automation reduces **manual configuration errors**.  
- Ansible supports many network devices: Cisco, Juniper, Arista, Huawei, etc.  
- Tasks include configuring interfaces, VLANs, routing, ACLs, and monitoring.

---

## 18.2 Networking Modules Overview

Ansible provides **network-specific modules**, often prefixed by the vendor:

| Vendor  | Example Modules                     |
|---------|------------------------------------|
| Cisco   | `ios_config`, `ios_command`, `ios_facts` |
| Juniper | `junos_config`, `junos_command`, `junos_facts` |
| Arista  | `eos_config`, `eos_command`, `eos_facts` |
| Generic | `net_ping`, `net_get`, `net_put` |

- Modules abstract device-specific commands.  
- Support **idempotency** and **rollback** features.

---

## 18.3 Gathering Facts

Use modules to collect information about network devices:

```yaml
- name: Gather Cisco IOS facts
  cisco.ios.ios_facts:
```
- Facts include hostname, interfaces, IP addresses, and OS version.
- Facts can be used in conditional tasks.

## 18.4 Configuring Interfaces

Example: Configure an interface on a Cisco IOS device:
```yaml
- name: Configure interface
  cisco.ios.ios_config:
    lines:
      - interface GigabitEthernet0/1
      - description Connected to LAN
      - ip address 192.168.1.1 255.255.255.0
      - no shutdown
```
- Ensures idempotent interface configuration.

## 18.5 VLAN Management

Example: Create VLANs on switches:
```yaml
- name: Create VLAN 10
  cisco.ios.ios_config:
    lines:
      - vlan 10
      - name Sales
```
- Supports bulk VLAN creation with loops:

```yaml
- name: Create multiple VLANs
  cisco.ios.ios_config:
    lines:
      - "vlan {{ item.id }}"
      - "name {{ item.name }}"
  loop:
    - { id: 10, name: Sales }
    - { id: 20, name: Engineering }
```

## 18.6 Managing Routing

Example: Configure static routes:
```yaml
- name: Add static route
  cisco.ios.ios_config:
    lines:
      - ip route 0.0.0.0 0.0.0.0 192.168.1.254
```
Use BGP or OSPF modules for dynamic routing configurations.

## 18.7 Using Templates

Jinja2 templates allow generating complex configurations:
```yaml
- name: Deploy interface configuration from template
  template:
    src: interface.j2
    dest: /tmp/interfaces.cfg
```
- Useful for multi-device deployment with consistent naming and addressing.

## 18.8 Error Handling and Rollback

- Use `rollback` features on supported modules.
- Use `block` and `rescue` to handle failures:
```yaml
- block:
    - name: Push config
      cisco.ios.ios_config:
        lines: "{{ config_lines }}"
  rescue:
    - debug:
        msg: "Configuration failed, rolling back."
```

## 18.9 Best Practices

- Test configurations in a lab or virtual environment first.
- Use idempotent tasks to avoid accidental overwrites.
- Store sensitive credentials in Ansible Vault.
- Organize network roles by vendor and function (interfaces, VLANs, routing).
- Use facts gathering to dynamically adjust configurations.

## Summary

- Ansible enables automated network management across vendors.
- Modules, templates, and roles improve consistency and reduce manual errors.
- Dynamic facts and conditional tasks allow smart, adaptive automation.
- Proper planning, testing, and best practices ensure safe deployment on production networks.
