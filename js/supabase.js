/* ==========================================
   SUPABASE INITIALIZATION
========================================== */

const { createClient } = supabase;

const db = createClient(
    CONFIG.supabaseUrl,
    CONFIG.supabaseAnonKey
);

/* ==========================================
   GENERATE UNIQUE FILE NAME
========================================== */

function generateFileName(file) {

    const extension = file.name.split('.').pop();

    return `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2,10)}.${extension}`;

}

/* ==========================================
   UPLOAD IMAGE TO STORAGE
========================================== */

async function uploadImage(file){

    try{

        const filename = generateFileName(file);

        const { error } = await db.storage

            .from(CONFIG.bucketName)

            .upload(filename,file);

        if(error)
            throw error;

        const { data } = db.storage

            .from(CONFIG.bucketName)

            .getPublicUrl(filename);

        return{

            success:true,

            path:filename,

            url:data.publicUrl

        };

    }

    catch(err){

        console.error(err);

        return{

            success:false,

            message:err.message

        };

    }

}

/* ==========================================
   SAVE MEMORY
========================================== */

async function saveMemory(title,description,imageUrl,imagePath){

    try{

        const { error } = await db

        .from(CONFIG.tableName)

        .insert({

            title:title,

            description:description,

            image_url:imageUrl,

            image_path:imagePath,

            created_at:new Date()

        });

        if(error)
            throw error;

        return true;

    }

    catch(err){

        console.error(err);

        return false;

    }

}

/* ==========================================
   LOAD MEMORIES
========================================== */

async function getMemories(){

    const { data,error } = await db

        .from(CONFIG.tableName)

        .select("*")

        .order("created_at",{

            ascending:false

        });

    if(error){

        console.error(error);

        return [];

    }

    return data;

}

/* ==========================================
   DELETE MEMORY
========================================== */

async function deleteMemory(id,path){

    try{

        await db.storage

        .from(CONFIG.bucketName)

        .remove([path]);

        await db

        .from(CONFIG.tableName)

        .delete()

        .eq("id",id);

        return true;

    }

    catch(err){

        console.error(err);

        return false;

    }

}

/* ==========================================
   UPDATE MEMORY
========================================== */

async function updateMemory(

    id,

    title,

    description

){

    try{

        const { error } = await db

        .from(CONFIG.tableName)

        .update({

            title,

            description

        })

        .eq("id",id);

        if(error)
            throw error;

        return true;

    }

    catch(err){

        console.error(err);

        return false;

    }

}