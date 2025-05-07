package ma.ensa.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import ma.ensa.dto.CandidatureDTO;
import ma.ensa.dto.CandidatureSubmissionDTO;
import ma.ensa.service.CandidatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/candidatures")
public class CandidatureController {

    @Autowired
    private CandidatureService candidatureService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<CandidatureDTO>> getAllCandidatures() {
        List<CandidatureDTO> candidatures = candidatureService.getAllCandidatures();
        return new ResponseEntity<>(candidatures, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidatureDTO> getCandidatureById(@PathVariable Long id) {
        Optional<CandidatureDTO> candidature = candidatureService.getCandidatureById(id);
        return candidature.map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CandidatureDTO>> getCandidaturesByUserId(@PathVariable Long userId) {
        List<CandidatureDTO> candidatures = candidatureService.getCandidaturesByUserId(userId);
        return new ResponseEntity<>(candidatures, HttpStatus.OK);
    }

    // Modified method to handle both JSON string and File for candidature
    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidatureDTO> submitCandidature(
            @RequestParam(value = "candidature") String candidatureString,
            @RequestParam Long userId,
            @RequestParam(required = false) MultipartFile[] files,
            @RequestParam(required = false) String[] documentNames) {

        try {
            // Parse JSON string to CandidatureSubmissionDTO
            CandidatureSubmissionDTO submissionDTO = objectMapper.readValue(candidatureString, CandidatureSubmissionDTO.class);

            // Map document names to files
            Map<String, MultipartFile> documents = new HashMap<>();
            if (files != null && documentNames != null && files.length == documentNames.length) {
                for (int i = 0; i < files.length; i++) {
                    documents.put(documentNames[i], files[i]);
                }
            }

            CandidatureDTO submittedCandidature = candidatureService.submitCandidature(submissionDTO, documents, userId);
            return new ResponseEntity<>(submittedCandidature, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/{id}/documents/{documentName}")
    public ResponseEntity<org.springframework.core.io.Resource> getCandidatureDocument(
            @PathVariable Long id,
            @PathVariable String documentName) {

        return candidatureService.getCandidatureDocument(id, documentName);
    }


    @PutMapping("/{id}")
    public ResponseEntity<CandidatureDTO> updateCandidature(
            @PathVariable Long id,
            @RequestPart("candidature") CandidatureSubmissionDTO submissionDTO,
            @RequestParam(required = false) MultipartFile[] files,
            @RequestParam(required = false) String[] documentNames) {

        // Map document names to files
        Map<String, MultipartFile> documents = new HashMap<>();
        if (files != null && documentNames != null && files.length == documentNames.length) {
            for (int i = 0; i < files.length; i++) {
                documents.put(documentNames[i], files[i]);
            }
        }

        CandidatureDTO updatedCandidature = candidatureService.updateCandidature(id, submissionDTO, documents);
        return new ResponseEntity<>(updatedCandidature, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidature(@PathVariable Long id) {
        candidatureService.deleteCandidature(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}