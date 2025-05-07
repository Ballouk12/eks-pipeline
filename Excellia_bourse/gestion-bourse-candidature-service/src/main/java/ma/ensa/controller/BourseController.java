package ma.ensa.controller;


import ma.ensa.dto.BourseDTO;
import ma.ensa.dto.CriterionDTO;
import ma.ensa.entities.Bourse;
import ma.ensa.entities.Criterion;
import ma.ensa.service.BourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bourses")
@CrossOrigin(origins = "*")
public class BourseController {

    @Autowired

    private BourseService bourseService;

    @GetMapping
    public ResponseEntity<List<BourseDTO>> getAllBourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer places,
            @RequestParam(required = false) Integer duration,
            @RequestParam(required = false) Double amount) {

        List<BourseDTO> bourses;

        if (search != null && !search.isEmpty()) {
            bourses = bourseService.searchBourses(search);
        } else if (places != null) {
            bourses = bourseService.filterBoursesByPlaces(places);
        } else if (duration != null) {
            bourses = bourseService.filterBoursesByDuration(duration);
        } else if (amount != null) {
            bourses = bourseService.filterBoursesByAmount(amount);
        } else {
            bourses = bourseService.getAllBourses();
        }

        return ResponseEntity.ok(bourses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BourseDTO> getBourseById(@PathVariable Long id) {
        Optional<BourseDTO> bourse = bourseService.getBourseById(id);
        return bourse.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BourseDTO> createBourse(@RequestBody BourseDTO bourseDTO) {
        BourseDTO createdBourse = bourseService.saveBourse(bourseDTO);
        return new ResponseEntity<>(createdBourse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BourseDTO> updateBourse(@PathVariable Long id, @RequestBody BourseDTO bourseDTO) {
        try {
            BourseDTO updatedBourse = bourseService.updateBourse(id, bourseDTO);
            return ResponseEntity.ok(updatedBourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBourse(@PathVariable Long id) {
        try {
            bourseService.deleteBourse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Bourse> createBourseWithPdf(
            @RequestParam("bourse") String bourseJson,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf) {
        try {
            Bourse newBourse = bourseService.createBourseWithPdf(bourseJson, pdf);
            return new ResponseEntity<>(newBourse, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/pdf/{filename}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        try {
            Resource file = bourseService.getPdfFile(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Updated to handle List<CriterionDTO> instead of List<String>
    @PostMapping("/{id}/criteria")
    public ResponseEntity<Bourse> addEligibilityCriteria(@PathVariable Long id, @RequestBody List<CriterionDTO> criteriaDTO) {
        try {
            // Convert DTO to Entity
            List<Criterion> criteria = criteriaDTO.stream()
                    .map(dto -> {
                        Criterion criterion = new Criterion();
                        criterion.setName(dto.getName());
                        criterion.setValue(dto.getValue());
                        return criterion;
                    })
                    .collect(Collectors.toList());

            Bourse updatedBourse = bourseService.addEligibilityCriteria(id, criteria);
            return ResponseEntity.ok(updatedBourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<Bourse> addRequiredDocuments(@PathVariable Long id, @RequestBody List<String> documents) {
        try {
            Bourse updatedBourse = bourseService.addRequiredDocuments(id, documents);
            return ResponseEntity.ok(updatedBourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}