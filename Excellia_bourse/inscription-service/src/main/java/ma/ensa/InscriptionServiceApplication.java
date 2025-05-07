package ma.ensa;

import ma.ensa.producer.UserEventProducer;
import ma.ensa.services.KafkaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class InscriptionServiceApplication {
    @Autowired
    UserEventProducer userEventProducer;
    public static void main(String[] args) {
        SpringApplication.run(InscriptionServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner sendUserToKafkaTopic() {
        return args -> {
            userEventProducer.publishListUsers();
            System.out.println("Sending users to kafka topic: ");
        };
    }

}
