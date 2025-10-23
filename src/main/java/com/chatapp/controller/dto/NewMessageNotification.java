package com.chatapp.controller.dto;

import java.time.Instant;

public class NewMessageNotification {
    private Long roomId;
    private Instant timestamp;

    public NewMessageNotification(Long roomId, Instant timestamp) {
        this.roomId = roomId;
        this.timestamp = timestamp;
    }

    // Getters
    public Long getRoomId() { return roomId; }
    public Instant getTimestamp() { return timestamp; }
}