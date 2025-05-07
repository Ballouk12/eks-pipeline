package ma.ensa.service;

import jakarta.annotation.Resource;
import ma.ensa.dto.CandidatureDTO;
import ma.ensa.dto.CandidatureSubmissionDTO;
import ma.ensa.entities.Bourse;
import ma.ensa.entities.Candidature;
import ma.ensa.repositories.BourseRepository;
import ma.ensa.repositories.CondidatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CandidatureService {

    @Autowired
    private CondidatureRepository candidatureRepository;

    @Autowired
    private BourseRepository bourseRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public List<CandidatureDTO> getAllCandidatures() {
        return candidatureRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<CandidatureDTO> getCandidatureById(Long id) {
        return candidatureRepository.findById(id).map(this::convertToDTO);
    }

    public List<CandidatureDTO> getCandidaturesByUserId(Long userId) {
        return candidatureRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CandidatureDTO> getCandidaturesByBourseId(Long bourseId) {
        return candidatureRepository.findByBourseId(bourseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CandidatureDTO submitCandidature(CandidatureSubmissionDTO submissionDTO, Map<String, MultipartFile> documents, Long userId) {
        Optional<Bourse> bourseOpt = bourseRepository.findById(submissionDTO.getBourseId());
        if (!bourseOpt.isPresent()) {
            throw new RuntimeException("Bourse not found with id: " + submissionDTO.getBourseId());
        }

        Bourse bourse = bourseOpt.get();

        // Check if user already applied
        if (candidatureRepository.existsByUserIdAndBourseId(userId, submissionDTO.getBourseId())) {
            throw new RuntimeException("User has already applied to this bourse");
        }

        // Validate required documents
        if (bourse.getRequiredDocuments() != null) {
            for (String requiredDoc : bourse.getRequiredDocuments()) {
                if (!documents.containsKey(requiredDoc) || documents.get(requiredDoc).isEmpty()) {
                    throw new RuntimeException("Missing required document: " + requiredDoc);
                }
            }
        }

        Candidature candidature = new Candidature();
        candidature.setUserId(userId);
        candidature.setName(submissionDTO.getName());
        candidature.setEmail(submissionDTO.getEmail());
        candidature.setCne(submissionDTO.getCne());
        candidature.setBourse(bourse);
        candidature.setStatus("En cours de traitement");
        candidature.setApplicationDate(new Date());
        candidature.setCriteriaResponses(submissionDTO.getCriteriaResponses());

        // Create document folder if doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }

        // Save documents
        Map<String, String> documentPaths = new HashMap<>();
        for (Map.Entry<String, MultipartFile> entry : documents.entrySet()) {
            String documentName = entry.getKey();
            MultipartFile file = entry.getValue();

            if (file != null && !file.isEmpty()) {
                try {
                    String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
                    Path path = uploadPath.resolve(filename);
                    Files.copy(file.getInputStream(), path);
                    documentPaths.put(documentName, filename);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to store document: " + documentName, e);
                }
            }
        }

        candidature.setDocuments(documentPaths);
        return convertToDTO(candidatureRepository.save(candidature));
    }

    public CandidatureDTO updateCandidature(Long id, CandidatureSubmissionDTO submissionDTO, Map<String, MultipartFile> documents) {
        Optional<Candidature> candidatureOpt = candidatureRepository.findById(id);
        if (!candidatureOpt.isPresent()) {
            throw new RuntimeException("Candidature not found with id: " + id);
        }

        Candidature candidature = candidatureOpt.get();
        candidature.setName(submissionDTO.getName());
        candidature.setEmail(submissionDTO.getEmail());
        candidature.setCne(submissionDTO.getCne());
        candidature.setCriteriaResponses(submissionDTO.getCriteriaResponses());

        // Update documents
        Map<String, String> existingDocuments = candidature.getDocuments();
        if (existingDocuments == null) {
            existingDocuments = new HashMap<>();
        }

        for (Map.Entry<String, MultipartFile> entry : documents.entrySet()) {
            String documentName = entry.getKey();
            MultipartFile file = entry.getValue();

            if (file != null && !file.isEmpty()) {
                try {
                    // Delete old document if exists
                    if (existingDocuments.containsKey(documentName)) {
                        Path oldPath = Paths.get(uploadDir).resolve(existingDocuments.get(documentName));
                        Files.deleteIfExists(oldPath);
                    }

                    String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
                    Path path = Paths.get(uploadDir).resolve(filename);
                    Files.copy(file.getInputStream(), path);
                    existingDocuments.put(documentName, filename);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to update document: " + documentName, e);
                }
            }
        }

        candidature.setDocuments(existingDocuments);
        return convertToDTO(candidatureRepository.save(candidature));
    }

    public void deleteCandidature(Long id) {
        Optional<Candidature> candidatureOpt = candidatureRepository.findById(id);
        if (candidatureOpt.isPresent()) {
            Candidature candidature = candidatureOpt.get();

            // Delete all associated documents
            Map<String, String> documents = candidature.getDocuments();
            if (documents != null) {
                for (String filePath : documents.values()) {
                    try {
                        Path path = Paths.get(uploadDir).resolve(filePath);
                        Files.deleteIfExists(path);
                    } catch (IOException e) {
                        // Log error but continue with deletion
                        System.err.println("Failed to delete document file: " + e.getMessage());
                    }
                }
            }

            candidatureRepository.deleteById(id);
        } else {
            throw new RuntimeException("Candidature not found with id: " + id);
        }
    }

    private CandidatureDTO convertToDTO(Candidature candidature) {
        CandidatureDTO dto = new CandidatureDTO();
        dto.setId(candidature.getId());
        dto.setBourseId(candidature.getBourse().getId());
        dto.setBourseTitle(candidature.getBourse().getTitle());
        dto.setUniversity(candidature.getBourse().getUniversity());
        dto.setName(candidature.getName());
        dto.setEmail(candidature.getEmail());
        dto.setCne(candidature.getCne());
        dto.setStatus(candidature.getStatus());
        dto.setApplicationDate(candidature.getApplicationDate());
        dto.setCriteriaResponses(candidature.getCriteriaResponses());
        dto.setDocuments(candidature.getDocuments());
        return dto;
    }
    public ResponseEntity<org.springframework.core.io.Resource> getCandidatureDocument(Long candidatureId, String documentName) {
        Optional<Candidature> candidatureOpt = candidatureRepository.findById(candidatureId);
        if (!candidatureOpt.isPresent()) {
            throw new RuntimeException("Candidature not found with id: " + candidatureId);
        }

        Candidature candidature = candidatureOpt.get();
        Map<String, String> documents = candidature.getDocuments();

        if (documents == null || !documents.containsKey(documentName)) {
            throw new RuntimeException("Document not found: " + documentName);
        }

        String filename = documents.get(documentName);
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();

        try {
            org.springframework.core.io.Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Could not read file: " + filename);
            }

            // Détermine le Content-Type dynamiquement en fonction de l'extension
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream"; // Type par défaut si indétectable
            }

            // Force le téléchargement avec Content-Disposition: attachment
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
            headers.setContentType(MediaType.parseMediaType(contentType));

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } catch (IOException e) {
            throw new RuntimeException("Error while reading file: " + filename, e);
        }
    }
}