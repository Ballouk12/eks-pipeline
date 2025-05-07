package ma.ensa.service;

import ma.ensa.dto.BourseDTO;
import ma.ensa.dto.CriterionDTO;
import ma.ensa.entities.Bourse;
import ma.ensa.entities.Criterion;
import com.fasterxml.jackson.databind.ObjectMapper;
import ma.ensa.repositories.BourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BourseService {

    @Autowired
    private BourseRepository bourseRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${file.upload-dir:uploads/pdfs}")
    private String uploadDir;

    public List<BourseDTO> getAllBourses() {
        return bourseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<BourseDTO> getBourseById(Long id) {
        return bourseRepository.findById(id)
                .map(this::convertToDTO);
    }

    public BourseDTO saveBourse(BourseDTO bourseDTO) {
        Bourse bourse = convertToEntity(bourseDTO);
        Bourse savedBourse = bourseRepository.save(bourse);
        return convertToDTO(savedBourse);
    }

    public BourseDTO updateBourse(Long id, BourseDTO bourseDTO) {
        Optional<Bourse> existingBourse = bourseRepository.findById(id);
        if (existingBourse.isPresent()) {
            Bourse bourse = existingBourse.get();
            updateBourseFromDTO(bourse, bourseDTO);
            Bourse updatedBourse = bourseRepository.save(bourse);
            return convertToDTO(updatedBourse);
        } else {
            throw new RuntimeException("Bourse not found with id: " + id);
        }
    }

    public void deleteBourse(Long id) {
        if (bourseRepository.existsById(id)) {
            bourseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Bourse not found with id: " + id);
        }
    }

    public List<BourseDTO> searchBourses(String searchTerm) {
        // Implement search logic (title, university, description)
        return bourseRepository.findByTitleContainingOrUniversityContainingOrDescriptionContaining(
                        searchTerm, searchTerm, searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BourseDTO> filterBoursesByPlaces(Integer places) {
        return bourseRepository.findByPlacesGreaterThanEqual(places).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BourseDTO> filterBoursesByDuration(Integer duration) {
        return bourseRepository.findByDurationGreaterThanEqual(duration).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BourseDTO> filterBoursesByAmount(Double amount) {
        return bourseRepository.findByAmountGreaterThanEqual(amount).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Method to create a new Bourse with PDF file
    public Bourse createBourseWithPdf(String bourseJson, MultipartFile pdfFile) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Convert JSON string to Bourse object
        Bourse bourse = objectMapper.readValue(bourseJson, Bourse.class);

        // Handle PDF file upload if provided
        if (pdfFile != null && !pdfFile.isEmpty()) {
            // Generate a unique filename to avoid overwriting
            String uniqueFilename = UUID.randomUUID().toString() + "_" + pdfFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Copy file to the upload directory
            Files.copy(pdfFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Store only the file path in the database
            bourse.setPdfLink(uniqueFilename);
        }

        // Save bourse to database
        return bourseRepository.save(bourse);
    }

    // Method to retrieve PDF file as a Resource
    public Resource getPdfFile(String filename) throws MalformedURLException {
        Path filePath = Paths.get(uploadDir).resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Could not read file: " + filename);
        }
    }

    public Bourse addEligibilityCriteria(Long id, List<Criterion> criteria) {
        Optional<Bourse> optionalBourse = bourseRepository.findById(id);
        if (optionalBourse.isPresent()) {
            Bourse bourse = optionalBourse.get();
            bourse.setEligibilityCriteria(criteria);
            return bourseRepository.save(bourse);
        } else {
            throw new RuntimeException("Bourse not found with id: " + id);
        }
    }

    public Bourse addRequiredDocuments(Long id, List<String> documents) {
        Optional<Bourse> optionalBourse = bourseRepository.findById(id);
        if (optionalBourse.isPresent()) {
            Bourse bourse = optionalBourse.get();
            bourse.setRequiredDocuments(documents);
            return bourseRepository.save(bourse);
        } else {
            throw new RuntimeException("Bourse not found with id: " + id);
        }
    }

    // Helper methods for DTO conversion
    private BourseDTO convertToDTO(Bourse bourse) {
        BourseDTO dto = new BourseDTO();
        dto.setId(bourse.getId());
        dto.setTitle(bourse.getTitle());
        dto.setUniversity(bourse.getUniversity());
        dto.setDescription(bourse.getDescription());
        dto.setPlaces(bourse.getPlaces());
        dto.setStartDate(bourse.getStartDate());
        dto.setDeadline(bourse.getDeadline());
        dto.setAmount(bourse.getAmount());
        dto.setDuration(bourse.getDuration());
        dto.setPdfLink(bourse.getPdfLink());

        // Convert Criterion entities to DTOs
        if (bourse.getEligibilityCriteria() != null) {
            List<CriterionDTO> criteriaDTOs = bourse.getEligibilityCriteria().stream()
                    .map(criterion -> {
                        CriterionDTO criterionDTO = new CriterionDTO();
                        criterionDTO.setName(criterion.getName());
                        criterionDTO.setValue(criterion.getValue());
                        return criterionDTO;
                    })
                    .collect(Collectors.toList());
            dto.setEligibilityCriteria(criteriaDTOs);
        }

        dto.setRequiredDocuments(bourse.getRequiredDocuments());
        return dto;
    }

    private Bourse convertToEntity(BourseDTO dto) {
        Bourse bourse = new Bourse();
        updateBourseFromDTO(bourse, dto);
        return bourse;
    }

    private void updateBourseFromDTO(Bourse bourse, BourseDTO dto) {
        bourse.setTitle(dto.getTitle());
        bourse.setUniversity(dto.getUniversity());
        bourse.setDescription(dto.getDescription());
        bourse.setPlaces(dto.getPlaces());
        bourse.setStartDate(dto.getStartDate());
        bourse.setDeadline(dto.getDeadline());
        bourse.setAmount(dto.getAmount());
        bourse.setDuration(dto.getDuration());
        bourse.setPdfLink(dto.getPdfLink());

        // Convert DTO criteria to entities
        if (dto.getEligibilityCriteria() != null) {
            List<Criterion> criteria = dto.getEligibilityCriteria().stream()
                    .map(criterionDTO -> {
                        Criterion criterion = new Criterion();
                        criterion.setName(criterionDTO.getName());
                        criterion.setValue(criterionDTO.getValue());
                        return criterion;
                    })
                    .collect(Collectors.toList());
            bourse.setEligibilityCriteria(criteria);
        }

        bourse.setRequiredDocuments(dto.getRequiredDocuments());
    }
}