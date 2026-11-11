package com.mintech.ecommerce.security;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class LoginRateLimiter {

    private static final long WINDOW_NANOS = Duration.ofMinutes(1).toNanos();
    private static final int MAX_ATTEMPTS = 10;
    private static final int MAX_CLIENTS = 10_000;

    private final Map<String, AttemptWindow> clients = new HashMap<>();
    private long lastCleanup = System.nanoTime();

    public synchronized boolean tryAcquire(String address) {
        long now = System.nanoTime();
        if (now - lastCleanup >= WINDOW_NANOS) {
            clients.values().removeIf(window -> now - window.startedAt >= WINDOW_NANOS);
            lastCleanup = now;
        }

        AttemptWindow window = clients.get(address);
        if (window == null || now - window.startedAt >= WINDOW_NANOS) {
            if (window == null && clients.size() >= MAX_CLIENTS) {
                return false;
            }
            clients.put(address, new AttemptWindow(now, 1));
            return true;
        }
        if (window.attempts >= MAX_ATTEMPTS) {
            return false;
        }
        clients.put(address, new AttemptWindow(window.startedAt, window.attempts + 1));
        return true;
    }

    private record AttemptWindow(long startedAt, int attempts) {
    }
}
