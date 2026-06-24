package com.patitas.alerta.controllers;

import com.patitas.alerta.dtos.AuthRequest;
import com.patitas.alerta.dtos.AuthResponse;
import com.patitas.alerta.dtos.RegistroRequest;
import com.patitas.alerta.entities.Usuario;
import com.patitas.alerta.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Endpoints para Login y Registro de usuarios")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private com.patitas.alerta.repositories.UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Operation(summary = "Iniciar Sesión", description = "Recibe email y password, y devuelve un token JWT de acceso válido por 10 horas.")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("Usuario no encontrado con email: " + request.getEmail()));

        java.util.Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("id", usuario.getId().toString());
        claims.put("nombreCompleto", usuario.getNombreCompleto());
        claims.put("rol", usuario.getRol());

        final String jwt = jwtUtil.generateToken(claims, userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/registro")
    @Operation(summary = "Registrar nuevo usuario", description = "Crea una nueva cuenta de tipo VECINO.")
    public ResponseEntity<?> registro(@RequestBody RegistroRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        Usuario nuevoUsuario = Usuario.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol("VECINO")
                .nombreCompleto(request.getNombreCompleto())
                .telefonoEncriptado("enc_" + request.getTelefono())
                .build();

        usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.ok(java.util.Map.of("mensaje", "Usuario registrado con éxito"));
    }
}
