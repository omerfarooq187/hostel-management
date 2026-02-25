package com.innovatewithomer.hostel_management.config;

import com.innovatewithomer.hostel_management.entities.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private Long userId;
    private Long hostelId;
    private String email;
    private String password;
    private Role role;
    private boolean active;

    public UserPrincipal(
            Long userId,
            Long hostelId,
            String email,
            String password,
            Role role,
            boolean active
    ) {
        this.userId = userId;
        this.hostelId = hostelId;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getHostelId() {
        return hostelId;
    }

    public Role getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return active;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
