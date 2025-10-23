package com.chatapp.controller;

import com.chatapp.controller.dto.NewMessageNotification;
import com.chatapp.controller.dto.RoomCreateRequest;
import com.chatapp.model.ChatMessage;
import com.chatapp.model.ChatRoom;
import com.chatapp.repository.ChatMessageRepository;
import com.chatapp.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Controller
@RequestMapping("/api")
public class RoomController {

    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired private ChatMessageRepository messageRepository;
    @Autowired private ChatRoomRepository roomRepository;

    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, @Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(Instant.now());
        ChatRoom room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));
        chatMessage.setChatRoom(room);

        ChatMessage savedMessage = messageRepository.save(chatMessage);

        // Broadcast the full message to the specific chat room topic
        messagingTemplate.convertAndSend("/topic/chatrooms/" + roomId, savedMessage);

        // Broadcast a lightweight notification to a general topic for the new message indicator
        NewMessageNotification notification = new NewMessageNotification(roomId, savedMessage.getTimestamp());
        messagingTemplate.convertAndSend("/topic/activity", notification);
    }

    @GetMapping("/chatrooms")
    @ResponseBody
    public List<ChatRoom> getChatRooms() {
        return roomRepository.findAll();
    }

    @PostMapping("/chatrooms")
    @ResponseBody
    public ResponseEntity<ChatRoom> createChatRoom(@RequestBody RoomCreateRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (roomRepository.findByName(request.getName().trim()).isPresent()) {
            return ResponseEntity.status(409).build(); // 409 Conflict for existing name
        }
        ChatRoom newRoom = new ChatRoom();
        newRoom.setName(request.getName().trim());
        return ResponseEntity.ok(roomRepository.save(newRoom));
    }

    @GetMapping("/chatrooms/{roomId}/messages")
    @ResponseBody
    public List<ChatMessage> getRoomMessages(@PathVariable Long roomId) {
        return messageRepository.findByChatRoomIdOrderByTimestampAsc(roomId);
    }
}