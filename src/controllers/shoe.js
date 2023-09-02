import Shoe from "../modules/Shoe.js";
import uploadImagetoCloud from "../utils/Cloudinary/uploadImagetoCloud.js";
import { createError } from "../utils/error.js";

function escapeRegexCharacters(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const getShoes = async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qSubcategory = req.query.subcategory;
  const qProducer = req.query.producer;
  const qSubsubcategory = req.query.subsubcategory;
  const qName = req.query.q;

  try {
    let products;

    if (qNew) {
      products = await Shoe.find().sort({ createdAt: -1 }).limit(1);
    } else {
      const filter = {};

      if (qCategory) {
        filter.category = qCategory;
      }

      if (qSubcategory) {
        filter.subcategory = qSubcategory;
      }
      if (qProducer) {
        filter.producer = qProducer;
      }

      if (qSubsubcategory) {
        filter.subsubcategory = qSubsubcategory;
      }

      if (qName) {
        // Perform approximate match for qName
        const regexPattern = escapeRegexCharacters(qName); // Escape special characters
        const regex = new RegExp(regexPattern, "i"); // 'i' flag makes the regex case-insensitive
        filter.$or = [
          { name: { $regex: regex } },
          { category: { $regex: regex } },
          { subcategory: { $regex: regex } },
          { producer: { $regex: regex } }
        ];
      }

      products = await Shoe.find(filter);
    }

    res.status(200).json(products);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getShoe = async (req, res, next) => {
  try {
    const shoe = await Shoe.findById(req.params.id);

    if (!shoe)
      return next(await createError(404, "Product not found!", req, null));

    res.status(200).json(shoe);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const addShoe = async (req, res, next) => {
  try {
    const shoe = new Shoe(req.body);
    const savedShoe = await shoe.save();

    res.status(201).json(savedShoe);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

/*

export const addShoe = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Request body must be an array of shoes." });
    }

    const savedShoes = await Shoe.insertMany(req.body);

    res.status(201).json(savedShoes);
  } catch (err) {
    next(err);
  }
}
*/

export const deleteShoe = async (req, res, next) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);

    if (!shoe)
      return next(await createError(404, "Product not found!", req, null));

    res.status(200).json({ message: "Product Deleted" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const updateShoe = async (req, res, next) => {
  try {
    const Shoeupdate = await Shoe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!Shoeupdate)
      return next(await createError(404, "Shoe not found!", req, null));

    res.status(200).json(Shoeupdate);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const uploadImages = async (req, res, next) => {
  try {
    const base64Images = req.body.productimg;
    //console.log("data=>",req.body.productimg)

    const uploadedImages = await Promise.all(
      base64Images.map((image) => uploadImagetoCloud(image))
    );

    res.status(200).json(uploadedImages);
  } catch (error) {
    console.error("Error uploading images:", error);
    next(await createError(500, err, req, null));
  }
};

export const getShoeadmin = async (req, res, next) => {
  try {
    const shoe = await Shoe.findById(req.params.id);

    if (!shoe)
      return next(await createError(404, "Product not found!", req, null));

    const shoes = {
      id: shoe._id,
      title: shoe.name,
      img: shoe.productimg[0],
      info: {
        productId: shoe._id,
        color: shoe.color,
        price: shoe.price,
        producer: shoe.producer,
      },
    };

    res.status(200).json(shoes);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const decrementQuantity = async (req, res, next) => {
  const { products } = req.body;
  //console.log("productsin backend=>",req.body)
  try {
    for (const productData of products) {
      const { _id, color, size, quantity } = productData;

      const product = await Shoe.findById(_id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const colorName = product.color.find((c) => c.colorName === color);
      if (!colorName) {
        return res.status(404).json({ message: "Color not found" });
      }

      const sizeInfo = colorName.sizes.find((s) => s.size === size);
      if (!sizeInfo) {
        return res.status(404).json({ message: "Size not found" });
      }

      if (sizeInfo.quantity > 0) {
        sizeInfo.quantity -= quantity;
        await product.save();
      }
    }

    return res.json({ message: "Quantities decremented successfully" });
  } catch (error) {
    console.error("Error decrementing quantities", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
