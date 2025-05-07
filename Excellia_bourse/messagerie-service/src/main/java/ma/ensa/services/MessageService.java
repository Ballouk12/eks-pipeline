package ma.ensa.services;

import ma.ensa.entities.Message;
import ma.ensa.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        message.setDate(new Date()); // On attribue automatiquement la date du message
        return messageRepository.save(message);
    }
}
