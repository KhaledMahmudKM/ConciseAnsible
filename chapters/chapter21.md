# Chapter 21 - BGP Automation

This chapter covers automating BGP (Border Gateway Protocol) configuration using Ansible on Cisco and Juniper devices.

---

## 21.1 Introduction

BGP is the backbone of Internet routing and multi-site enterprise connectivity.  
Automating BGP ensures:

- Consistent peer configuration  
- Accurate route advertisement  
- Reduction of manual errors  

Ansible makes BGP scalable across dozens or hundreds of routers.

---

## 21.2 Basic BGP Configuration (Cisco IOS)

```yaml
- name: Configure BGP
  cisco.ios.ios_config:
    lines:
      - router bgp 65001
      - neighbor 192.168.1.2 remote-as 65002
      - network 10.10.10.0 mask 255.255.255.0

### 19.3.1 BGP Configuration (Cisco IOS)
```yaml
- name: Configure BGP
  cisco.ios.ios_config:
    lines:
      - router bgp 65001
      - neighbor 192.168.1.2 remote-as 65002
      - network 10.10.10.0 mask 255.255.255.0
```
- Automates peer setup and network advertisement.

## 21.3 Configuring Multiple BGP Neighbors

```yaml
- name: Configure multiple BGP neighbors
  cisco.ios.ios_config:
    lines:
      - "neighbor {{ item.ip }} remote-as {{ item.asn }}"
  loop:
    - { ip: "192.168.1.2", asn: 65002 }
    - { ip: "192.168.1.3", asn: 65003 }
```
This approach scales better than writing multiple neighbor commands manually.

## 21.4 Advertising Networks Dynamically
```yaml
- name: Advertise networks in BGP
  cisco.ios.ios_config:
    lines:
      - "network {{ item.network }} mask {{ item.mask }}"
  loop:
    - { network: "10.10.10.0", mask: "255.255.255.0" }
    - { network: "192.168.50.0", mask: "255.255.255.0" }
```

## 21.5 Juniper BGP Automation Example
```yaml
- name: Configure BGP on Juniper router
  juniper.junos.junos_config:
    lines:
      - set routing-options router-id 1.1.1.1
      - set protocols bgp group IBGP type internal
      - set protocols bgp group IBGP neighbor 2.2.2.2
      - set protocols bgp group IBGP neighbor 2.2.2.2 peer-as 65001
      - set protocols bgp group EBGP type external
      - set protocols bgp group EBGP neighbor 3.3.3.3 peer-as 65002
```
- Supports idempotent automation for BGP peer and policy configuration.

## 21.6 Using Variables for BGP (recommended)

`group_vars/bgp.yml`:
```yaml
asn: 65001
bgp_neighbors:
  - { ip: "10.0.0.2", remote_as: 65002 }
  - { ip: "10.0.0.3", remote_as: 65003 }
advertised_networks:
  - { network: "10.10.10.0", mask: "255.255.255.0" }
```

Playbook:
```yaml
- name: Configure BGP using variables
  cisco.ios.ios_config:
    lines:
      - "router bgp {{ asn }}"
      - "neighbor {{ item.ip }} remote-as {{ item.remote_as }}"
  loop: "{{ bgp_neighbors }}"
```


## 21.7 Best Practices

- Use iBGP full-mesh or route reflectors depending on your topology.
- Store BGP neighbors in a variables file for reuse.
- Use templates if you have complex BGP policy configurations.
- Test BGP configs in GNS3, EVE-NG, or CML before production deployment.
- Apply strict filtering (prefix lists, route maps) to avoid route leaks.

## Summary

BGP automation ensures reliable, consistent routing configuration across your network.
With Ansible modules, loops, and variables, you can automate BGP peers, networks, and routing policies in a scalable manner.