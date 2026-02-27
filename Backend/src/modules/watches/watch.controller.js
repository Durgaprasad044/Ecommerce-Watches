const { supabase } = require("../../config/supabase");

exports.createWatch = async (req, res) => {
  try {
    const { name, brand, price, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // Get public URL
    const { data } = supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    // Insert into Supabase table
    const { data: insertedWatch, error } = await supabase
      .from("watches")
      .insert([
        {
          name,
          brand,
          price,
          description,
          image_url: imageUrl,
          vendor_id: req.user.id,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(insertedWatch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllWatches = async (req, res) => {
  const { data, error } = await supabase
    .from("watches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};