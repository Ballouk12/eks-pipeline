package ma.ensa.services;

import ma.ensa.entities.UserRef;
import ma.ensa.repositories.UserRefRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserRefService {

    @Autowired
    private UserRefRepository userRefRepository;

    public UserRef saveUserRef(UserRef userRef) {
        return userRefRepository.save(userRef);
    }

    public List<UserRef> getAllUserRefs() {
        return userRefRepository.findAll();
    }

    public Optional<UserRef> getUserRefById(Long id) {
        return userRefRepository.findById(id);
    }

    public UserRef updateUserRef(Long id, UserRef updatedUserRef) {
        return userRefRepository.findById(id)
                .map(user -> {
                    user.setFirstName(updatedUserRef.getFirstName());
                    user.setLastName(updatedUserRef.getLastName());
                    user.setCne(updatedUserRef.getCne());
                    return userRefRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("UserRef non trouvé"));
    }

    public void deleteUserRef(Long id) {
        userRefRepository.deleteById(id);
    }

    public List<UserRef> processUploadedFile(MultipartFile file) throws IOException {
        List<UserRef> usersRef = new ArrayList<>();

        if (file.getOriginalFilename().endsWith(".csv")) {
            usersRef = processCSV(file);
        } else if (file.getOriginalFilename().endsWith(".xlsx")) {usersRef= processExcel(file);
        }

        return userRefRepository.saveAll(usersRef);
    }

    private List<UserRef> processCSV(MultipartFile file) throws IOException {
        List<UserRef> usersRef = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] values = line.split(",");
                UserRef userRef = new UserRef();
                userRef.setFirstName(values[0]);
                userRef.setLastName(values[1]);
                userRef.setCne(values[2]);
                usersRef.add(userRef);
            }
        }
        return usersRef;
    }

    private List<UserRef> processExcel(MultipartFile file) throws IOException {
        List<UserRef> usersRef = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            boolean firstRow = true;
            for (Row row : sheet) {
                if (firstRow) {
                    firstRow = false;
                    continue;
                }
                UserRef userRef = new UserRef();
                userRef.setFirstName(getCellValueAsString(row.getCell(0)));
                userRef.setLastName(getCellValueAsString(row.getCell(1)));
                userRef.setCne(getCellValueAsString(row.getCell(2)));
                usersRef.add(userRef);
            }
        }
        return usersRef;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            default:
                return "";
        }
    }
}