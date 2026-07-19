package com.employee.automation.utilities;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * JsonDataReader — Reads JSON test data files using Gson.
 * Used for reading credentials.json and other test fixtures.
 */
public class JsonDataReader {

    private static final Logger log = LogManager.getLogger(JsonDataReader.class);
    private static final String TEST_DATA_DIR = "src/test/resources/testdata/";

    private JsonDataReader() {}

    /**
     * Reads a JSON file and returns the root JsonObject.
     *
     * @param fileName File name (e.g., "credentials.json")
     * @return Parsed JsonObject
     */
    public static JsonObject readJsonFile(String fileName) {
        String filePath = TEST_DATA_DIR + fileName;
        try {
            String content = Files.readString(Paths.get(filePath), StandardCharsets.UTF_8);
            JsonObject jsonObject = JsonParser.parseString(content).getAsJsonObject();
            log.info("JsonDataReader: Loaded '{}' successfully.", fileName);
            return jsonObject;
        } catch (IOException e) {
            log.error("JsonDataReader: Failed to read '{}' — {}", filePath, e.getMessage());
            throw new RuntimeException("Cannot read JSON file: " + filePath, e);
        }
    }

    /**
     * Reads a nested string value from JSON.
     *
     * @param fileName  JSON file name
     * @param objectKey Top-level key (e.g., "validLogin")
     * @param fieldKey  Field inside the object (e.g., "email")
     * @return String value
     */
    public static String getString(String fileName, String objectKey, String fieldKey) {
        JsonObject root = readJsonFile(fileName);
        JsonObject obj  = root.getAsJsonObject(objectKey);
        if (obj == null || !obj.has(fieldKey)) {
            throw new RuntimeException("Key path not found: " + objectKey + "." + fieldKey + " in " + fileName);
        }
        return obj.get(fieldKey).getAsString();
    }

    /**
     * Reads credentials from credentials.json.
     * Keys: validLogin, invalidLogin, emptyEmail, emptyPassword
     */
    public static String getCredential(String credentialKey, String fieldKey) {
        return getString("credentials.json", credentialKey, fieldKey);
    }

    /**
     * Maps a JSON file to a Java object using Gson.
     *
     * @param fileName  JSON file name
     * @param classType Target class
     * @param <T>       Generic type
     * @return Deserialized object
     */
    public static <T> T readAs(String fileName, Class<T> classType) {
        JsonObject root = readJsonFile(fileName);
        return new Gson().fromJson(root, classType);
    }
}
