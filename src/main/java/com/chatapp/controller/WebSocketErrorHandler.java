package com.chatapp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

// This annotation makes this class a global exception handler for controllers.
@ControllerAdvice
public class WebSocketErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketErrorHandler.class);

    /**
     * This method catches any exception that occurs in a @MessageMapping method.
     * By catching it here, we prevent it from bubbling up and causing the
     * WebSocket connection to be reset.
     */
    @MessageExceptionHandler
    public void handleException(Throwable exception) {
        // We log the error for debugging purposes but do not re-throw it.
        // This keeps the connection alive.
        logger.error("Error handling WebSocket message: " + exception.getMessage(), exception);

        // In a more advanced setup, you could send an error message back
        // to the specific user who caused the error. For now, simply
        // logging it and preventing the crash is the main goal.
    }
}