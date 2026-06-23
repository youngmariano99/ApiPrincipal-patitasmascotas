package com.patitas.alerta;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class HashTest {
    @Test
    public void generateHash() {
        System.out.println("HASH_123_GENERATED: " + new BCryptPasswordEncoder().encode("123"));
    }
}
