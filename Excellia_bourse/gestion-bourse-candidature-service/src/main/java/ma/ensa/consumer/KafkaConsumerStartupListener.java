package ma.ensa.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumerStartupListener {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerStartupListener.class);

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        logger.info("**************************************************************");
        logger.info("KAFKA CONSUMER READY TO RECEIVE MESSAGES FROM usersTopic");
        logger.info("**************************************************************");
    }
}