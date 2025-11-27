# Chapter 20 OSPF Automation and Interface Templates

This chapter covers **automating OSPF configurations** and using **Jinja2 templates** for network interfaces to simplify repetitive tasks across multiple devices.

---

## 20.1 Introduction

- OSPF is a widely used dynamic routing protocol.  
- Manual configuration on multiple routers is **error-prone**.  
- Ansible allows **repeatable, consistent OSPF deployment** and **interface management**.

---

## 20.2 OSPF Automation Basics

### 20.2.1 Cisco IOS Example

```yaml
- name: Configure OSPF on Cisco routers
  cisco.ios.ios_config:
    lines:
      - router ospf 1
      - network 10.0.0.0 0.0.0.255 area 0
      - network 192.168.1.0 0.0.0.255 area 0
```
- Defines OSPF process `1` and advertises multiple networks.
- Can be extended with loops for multiple routers or areas.

## 20.3 Using Loops for OSPF Networks
```yaml
- name: Configure OSPF networks dynamically
  cisco.ios.ios_config:
    lines:
      - "network {{ item.network }} {{ item.wildcard }} area {{ item.area }}"
  loop:
    - { network: "10.0.0.0", wildcard: "0.0.0.255", area: 0 }
    - { network: "192.168.1.0", wildcard: "0.0.0.255", area: 0 }
```
- Makes the playbook flexible and maintainable.

## 20.4 Interface Templates with Jinja2

Templates allow generating consistent interface configurations across multiple devices.

### 20.4.1 Template Example (`interface.j2`)
```jinja
interface {{ interface.name }}
 description {{ interface.description }}
 ip address {{ interface.ip }} {{ interface.mask }}
 no shutdown
```

Variables can be defined in `host_vars` or `group_vars`:
```yaml
interfaces:
  - name: GigabitEthernet0/1
    description: Uplink to Core
    ip: 10.0.1.1
    mask: 255.255.255.0
  - name: GigabitEthernet0/2
    description: LAN Connection
    ip: 192.168.1.1
    mask: 255.255.255.0
```

### 20.4.2 Deploying Interface Templates
```yaml
- name: Deploy interface configuration from template
  template:
    src: interface.j2
    dest: /tmp/{{ inventory_hostname }}_interfaces.cfg

- name: Push interface configuration to device
  cisco.ios.ios_config:
    src: /tmp/{{ inventory_hostname }}_interfaces.cfg
```
- Ensures uniform configuration across devices.
- Supports scaling to dozens of interfaces without copy-paste errors.

## 20.5 Combining OSPF and Interface Templates
```yaml
- hosts: routers
  become: yes
  vars_files:
    - group_vars/routers.yml
  tasks:
    - name: Deploy interface configurations
      template:
        src: interface.j2
        dest: /tmp/{{ inventory_hostname }}_interfaces.cfg

    - name: Push interface configuration
      cisco.ios.ios_config:
        src: /tmp/{{ inventory_hostname }}_interfaces.cfg

    - name: Configure OSPF dynamically
      cisco.ios.ios_config:
        lines:
          - "router ospf 1"
          - "network {{ item.network }} {{ item.wildcard }} area {{ item.area }}"
      loop: "{{ ospf_networks }}"
```

- Combines interface setup and OSPF routing in a single playbook.
- Variables (`interfaces`, `ospf_networks`) make automation flexible for different devices or topologies.

## 20.6 Best Practices

- Maintain separate templates for interfaces, routing, and VLANs.
- Store device-specific variables in `host_vars`.
- Use loops for multiple interfaces, networks, or areas.
- Test in lab environment before production deployment.
- Use idempotent modules to prevent accidental changes.

## Summary

- Ansible enables automated OSPF routing across multiple devices.
- Interface templates ensure consistent, repeatable configuration.
- Combining templates and OSPF tasks reduces errors and manual effort.
- Scalable network automation is achieved by using roles, variables, and templates effectively.