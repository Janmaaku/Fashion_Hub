<?php
// src/config/Database.php

class Database {
    private $db;
    
    public function __construct() {
        $firebase = FirebaseConfig::getInstance();
        $this->db = $firebase->getDatabase();
    }
    
    /**
     * Create a new record
     */
    public function create($path, $data) {
        try {
            $reference = $this->db->getReference($path);
            $newRef = $reference->push($data);
            return [
                'success' => true, 
                'id' => $newRef->getKey(),
                'data' => $data
            ];
        } catch (Exception $e) {
            return [
                'success' => false, 
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Read data from path
     */
    public function read($path) {
        try {
            $reference = $this->db->getReference($path);
            $data = $reference->getValue();
            return [
                'success' => true, 
                'data' => $data
            ];
        } catch (Exception $e) {
            return [
                'success' => false, 
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Update existing record
     */
    public function update($path, $data) {
        try {
            $reference = $this->db->getReference($path);
            $reference->update($data);
            return ['success' => true];
        } catch (Exception $e) {
            return [
                'success' => false, 
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Delete record
     */
    public function delete($path) {
        try {
            $reference = $this->db->getReference($path);
            $reference->remove();
            return ['success' => true];
        } catch (Exception $e) {
            return [
                'success' => false, 
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Query by field value
     */
    public function query($path, $field, $value) {
        try {
            $reference = $this->db->getReference($path);
            $query = $reference->orderByChild($field)->equalTo($value);
            $data = $query->getValue();
            return [
                'success' => true, 
                'data' => $data
            ];
        } catch (Exception $e) {
            return [
                'success' => false, 
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Set data at path (overwrites existing)
     */
    public function set($path, $data) {
        try {
            $reference = $this->db->getReference($path);
            $reference->set($data);
            return ['success' => true];
        } catch (Exception $e) {
            return [
                'success' => false, 
                'error' => $e->getMessage()
            ];
        }
    }
}
?>