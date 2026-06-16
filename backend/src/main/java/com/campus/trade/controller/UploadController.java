package com.campus.trade.controller;

import com.campus.trade.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping
    public Result<String> upload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return Result.fail("文件不能为空");
        }
        Path dir = Paths.get(uploadDir);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }
        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String filename = UUID.randomUUID() + ext;
        Files.write(dir.resolve(filename), file.getBytes());
        return Result.ok("/uploads/" + filename);
    }
}
