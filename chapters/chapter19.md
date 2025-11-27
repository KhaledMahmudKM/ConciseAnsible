# Chapter 19 - VLAN Automation

This chapter focuses on automating VLAN creation, modification, and assignment using Ansible on network devices such as Cisco IOS switches.

---

## 19.1 Introduction

VLANs are foundational to network segmentation. Using Ansible, you can:
- Create VLANs
- Name VLANs
- Assign VLANs to interfaces
- Apply consistent configurations across multiple switches

---

### 19.2 Basic VLAN Creation (Cisco IOS)

```yaml
- name: Create VLANs on Cisco switch
  cisco.ios.ios_config:
    lines:
      - vlan 10
      - name Sales
      - vlan 20
      - name Engineering
```
### 19.3 Creating Multiple VLANs with Loops

- Use loops to automate multiple VLANs:
```yaml
- name: Create multiple VLANs dynamically
  cisco.ios.ios_config:
    lines:
      - "vlan {{ item.id }}"
      - "name {{ item.name }}"
  loop:
    - { id: 10, name: Sales }
    - { id: 20, name: Engineering }
    - { id: 30, name: HR }
```
This method is scalable and template-friendly.

### 19.4 Assign VLAN to Interfaces
```yaml
- name: Assign VLAN 10 to interface
  cisco.ios.ios_config:
    lines:
      - interface GigabitEthernet0/1
      - switchport mode access
      - switchport access vlan 10
```
### 19.5 Assigning VLANs to Multiple Interfaces
- Loop for multiple interfaces:
```yaml
- name: Assign VLANs to multiple interfaces
  cisco.ios.ios_config:
    lines:
      - "interface {{ item.interface }}"
      - "switchport mode access"
      - "switchport access vlan {{ item.vlan }}"
  loop:
    - { interface: "Gig0/1", vlan: 10 }
    - { interface: "Gig0/2", vlan: 20 }
```
