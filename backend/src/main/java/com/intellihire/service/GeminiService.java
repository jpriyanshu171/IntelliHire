package com.intellihire.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // Common English stop words to remove during fallback
    private static final Set<String> STOP_WORDS = Set.of(
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves",
        "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
        "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
        "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
        "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about",
        "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up",
        "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when",
        "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no",
        "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don",
        "should", "now", "want", "looking", "job", "jobs", "role", "roles", "work", "position", "opening", "openings"
    );

    public List<String> extractKeywords(String userPrompt) {
        try {
            // Construct the prompt for Gemini
            String prompt = "Extract key technical skills, job roles, and locations from this user query: \"" + userPrompt + "\". " +
                    "Return ONLY a comma-separated list of keywords. Do not include any other text. Example output: Java, Spring Boot, New York";

            // Request Body
            Map<String, Object> content = new HashMap<>();
            Map<String, String> parts = new HashMap<>();
            parts.put("text", prompt);
            content.put("parts", List.of(parts));
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call API
            String url = apiUrl + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // Parse Response
            if (response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> contentResponse = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, String>> partsResponse = (List<Map<String, String>>) contentResponse.get("parts");
                    String text = partsResponse.get(0).get("text");
                    
                    // Clean up response (remove newlines, extra spaces)
                    text = text.replace("\n", "").trim();
                    
                    // Split comma-separated keywords
                    String[] keywords = text.split(",");
                    List<String> result = new ArrayList<>();
                    for (String k : keywords) {
                        String cleanKeyword = k.trim();
                        if (!cleanKeyword.isEmpty()) {
                            result.add(cleanKeyword);
                        }
                    }
                    System.out.println("Gemini Extracted Keywords: " + result);
                    return result;
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini API Error (using fallback): " + e.getMessage());
        }
        
        // Fallback: Smart keyword extraction
        return extractFallbackKeywords(userPrompt);
    }

    private List<String> extractFallbackKeywords(String text) {
        if (text == null || text.isEmpty()) return List.of();

        // Remove punctuation and split by whitespace
        String[] words = text.toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "").split("\\s+");
        
        // Filter out stop words
        List<String> keywords = Arrays.stream(words)
                .filter(word -> !STOP_WORDS.contains(word) && word.length() > 1)
                .collect(Collectors.toList());

        System.out.println("Fallback Extracted Keywords: " + keywords);
        return keywords;
    }
}
