/* ==========================================
   SUPABASE CONFIGURATION
========================================== */

const CONFIG = {

    // Supabase Project
    supabaseUrl:
        "https://whufoyezmrnkbhyfkyuk.supabase.co",

    supabaseAnonKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodWZveWV6bXJua2JoeWZreXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1OTcwOTQsImV4cCI6MjEwMTE3MzA5NH0.FU4GDtaAK2iLzbXmFBmo_DSVBmF2ij1uUCulDYwIX9k",

    // Storage Bucket
    bucketName: "memoris",

    // Database Table
    tableName: "memory",

    // Website Settings
    maxImageSize: 10 * 1024 * 1024, // 10MB

    allowedImageTypes: [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/gif"
    ],

    // Relationship Date
    relationshipDate: "2025-08-01T00:00:00",

    // Admin Password (change later)
    adminPassword: "123456"

};

/* ==========================================
   DON'T EDIT BELOW
========================================== */

Object.freeze(CONFIG);